import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import {
  PopulatedArticleDocument,
  articleContext,
} from "../context/ArticleProvider";
import Button from "../ui/Button";
import Input from "../ui/Input";
import SelectSimple from "../ui/SelectSimple";

import { ErrorMessage } from "./articleForm/NewArticle";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { scrapCauses } from "@/lib/config";
import { useRefreshArticles } from "@/lib/useRefreshArticles";
import { articleApi } from "@/lib/api/articles";
import QtyFromZeroNewLocation from "./QtyFromZeroNewLocationField";

interface Props {
  newQty: number;
  oldQty: number;
  article: PopulatedArticleDocument;
  setUpdatedArticle: Dispatch<SetStateAction<PopulatedArticleDocument>>;
  setClose: Dispatch<SetStateAction<boolean>>;
}

interface FormValues {
  sellPrice: number | "";
  scrapComment: string;
}

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

const schema = Yup.object({
  sellPrice: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Ange ett giltigt pris")
    .min(0, "Försäljningspriset kan inte vara negativt")
    .optional(),

  scrapComment: Yup.string(),
});

const ScrapCause = ({
  newQty,
  oldQty,
  article,
  setUpdatedArticle,
  setClose,
}: Props) => {
  const { setSectionDirty } = useContext(articleContext);

  const refreshArticles = useRefreshArticles();

  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(article.inventoryLocation);

  const [selectedScrapCause, setSelectedScrapCause] = useState("repair");

  const [error, setError] = useState("");

  const isIncrease = newQty > oldQty;
  const isDecrease = newQty < oldQty;

  const quantityChange = Math.abs(newQty - oldQty);

  const requiresNewLocation =
    oldQty === 0 &&
    newQty > 0 &&
    String(article.inventoryLocation._id) === VIRTUAL_LOCATION_ID;

  const hasSelectedValidLocation =
    selectedLocation !== null &&
    String(selectedLocation._id) !== VIRTUAL_LOCATION_ID;

  const formik = useFormik<FormValues>({
    initialValues: {
      sellPrice: article.price ?? "",
      scrapComment: "",
    },

    validationSchema: schema,

    onSubmit: async ({ sellPrice, scrapComment }) => {
      setError("");

      if (newQty === oldQty) {
        setClose(true);
        return;
      }

      if (requiresNewLocation && !hasSelectedValidLocation) {
        setError("Välj en lagerplats innan du höjer saldot från 0.");
        return;
      }

      if (isDecrease && selectedScrapCause === "sold" && sellPrice === "") {
        setError("Fyll i pris per enhet för de sålda artiklarna.");
        return;
      }

      try {
        /*
         * newQty är redan det slutliga saldot.
         * Därför används alltid updateMode "set".
         */
        const result = await articleApi.updateQuantity({
          articleId: String(article._id),
          updateMode: "set",
          enteredQty: newQty,

          newLocationId: requiresNewLocation
            ? String(selectedLocation?._id)
            : undefined,

          cause: isDecrease ? selectedScrapCause : undefined,

          pricePerUnit:
            isDecrease && selectedScrapCause === "sold"
              ? Number(sellPrice)
              : undefined,

          comment: scrapComment.trim() || undefined,
        });

        const updatedArticle: PopulatedArticleDocument = {
          ...article,
          qty: result.qty,
          price: result.price,
          inventoryLocation: result.inventoryLocation,
        };

        setUpdatedArticle(updatedArticle);

        await refreshArticles();

        setSectionDirty("quantity", false);
        setClose(true);

        alert("Lagersaldot är uppdaterat!");
      } catch (error) {
        console.error("Update article quantity error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Lagersaldot kunde inte uppdateras.",
        );
      }
    },
  });

  const resetQty = (): void => {
    setUpdatedArticle((previousArticle) => ({
      ...previousArticle,
      qty: oldQty,
    }));

    setSectionDirty("quantity", false);
    setClose(true);
  };

  const canSubmit =
    newQty !== oldQty &&
    (!requiresNewLocation || hasSelectedValidLocation) &&
    !formik.isSubmitting;

  return (
    <>
      <img
        src="/arrow.png"
        alt=""
        aria-hidden="true"
        className="arrow absolute -top-12 left-20 hidden h-6 w-6 opacity-50 md:block"
      />

      <img
        src="/arrow2.png"
        alt=""
        aria-hidden="true"
        className="arrow absolute left-24 top-3 h-6 w-6 opacity-50 md:hidden"
      />

      <form
        onSubmit={formik.handleSubmit}
        className="absolute left-0 top-11 z-50 rounded-md border bg-white p-4 text-sm shadow-lg md:-top-20 md:left-28"
      >
        <h2 className="mb-2 text-lg font-semibold">
          Överblick av saldoändringen
        </h2>

        <p>
          Du vill {isIncrease ? "öka" : "minska"} saldot med{" "}
          <strong>
            {quantityChange} {quantityChange === 1 ? "artikel" : "artiklar"}
          </strong>
          .
        </p>

        <p className="mt-1">
          Från <strong>{oldQty} st</strong> till <strong>{newQty} st</strong>.
        </p>

        {requiresNewLocation && (
          <QtyFromZeroNewLocation
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            article={article}
            setError={setError}
          />
        )}

        {isDecrease && (
          <div className="mt-5">
            <div className="mb-1 font-semibold">Anledning till uttag</div>

            <SelectSimple
              value={selectedScrapCause}
              onChange={(value) => {
                setSelectedScrapCause(value);
                setError("");
              }}
              options={scrapCauses}
            />

            {selectedScrapCause === "sold" && (
              <>
                <Input
                  id="sellPrice"
                  name="sellPrice"
                  label="Försäljningspris per enhet"
                  type="number"
                  min={0}
                  value={formik.values.sellPrice}
                  onBlur={formik.handleBlur}
                  onChange={(event) => {
                    const value = event.target.value;

                    void formik.setFieldValue(
                      "sellPrice",
                      value === "" ? "" : Number(value),
                    );

                    setError("");
                  }}
                  error={
                    formik.touched.sellPrice
                      ? formik.errors.sellPrice
                      : undefined
                  }
                  placeholder="Ange försäljningspris"
                  suffix="kr/st"
                  required
                />

                <p className="mt-2 text-right">
                  Totalt försäljningsvärde:{" "}
                  <strong>
                    {Number(formik.values.sellPrice || 0) * quantityChange} kr
                  </strong>
                </p>
              </>
            )}

            <Input
              id="scrapComment"
              name="scrapComment"
              label="Kommentar"
              type="text"
              value={formik.values.scrapComment}
              onChange={formik.handleChange}
              containerClassName="mt-3"
              placeholder="Ange en kommentar till uttaget"
            />
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        <div className="mt-5 flex w-full flex-col justify-end gap-2 sm:flex-row">
          <Button
            variant="modest"
            type="button"
            className="px-3 py-3 font-semibold"
            onClick={resetQty}
          >
            Avbryt
          </Button>

          <Button
            variant="positive"
            type="submit"
            className="px-3 py-3 text-sm font-semibold"
            disabled={!canSubmit}
          >
            {formik.isSubmitting ? "Uppdaterar..." : "Uppdatera saldo"}
          </Button>
        </div>
      </form>
    </>
  );
};

export default ScrapCause;
