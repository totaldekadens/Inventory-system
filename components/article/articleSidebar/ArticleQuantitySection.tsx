import {
  articleContext,
  PopulatedArticleDocument,
} from "@/components/context/ArticleProvider";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SelectSimple from "@/components/ui/SelectSimple";
import { scrapCauses } from "@/lib/config";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { useFormik } from "formik";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import * as Yup from "yup";
import { ErrorMessage } from "../articleForm/NewArticle";
import QuantityModeField, {
  UpdateMode,
} from "../articleForm/QuantityModeField";
import { inventoryLocationContext } from "@/components/context/InventoryLocationProvider";
import SearchSelect from "@/components/ui/SearchSelect";
import { useRefreshArticles } from "@/lib/useRefreshArticles";

interface Props {
  selectedLocation: InventoryLocationDocument | null;
  setSelectedLocation: Dispatch<
    SetStateAction<InventoryLocationDocument | null>
  >;
}

interface QuantityFormValues {
  qty: number | "";
  sellPrice: number | "";
  transactionComment: string;
}

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

const quantitySchema = Yup.object({
  qty: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Ange ett giltigt antal")
    .integer("Antalet måste vara ett heltal")
    .min(0, "Antalet kan inte vara negativt")
    .required("Ange antal"),

  sellPrice: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .typeError("Ange ett giltigt pris")
    .min(0, "Försäljningspriset kan inte vara negativt")
    .optional(),

  transactionComment: Yup.string(),
});

const calculateResultingQty = (
  currentQty: number,
  enteredQty: number,
  updateMode: UpdateMode,
): number => {
  if (updateMode === "set") {
    return enteredQty;
  }

  if (updateMode === "add") {
    return currentQty + enteredQty;
  }

  return currentQty - enteredQty;
};

const ArticleQuantitySection = ({
  selectedLocation,
  setSelectedLocation,
}: Props) => {
  const { currentArticle, setSectionDirty } = useContext(articleContext);
  const { inventoryLocations } = useContext(inventoryLocationContext);
  const [updateMode, setUpdateMode] = useState<UpdateMode>("set");
  const [selectedCause, setSelectedCause] = useState("repair");
  const [error, setError] = useState("");
  const refreshArticles = useRefreshArticles();
  const inventoryLocationOptions = inventoryLocations
    .filter((location) => String(location._id) !== VIRTUAL_LOCATION_ID)
    .map((location) => ({
      key: String(location._id),
      value: location,
      label: location.name,
    }));

  const selectedLocationOption =
    selectedLocation && String(selectedLocation._id) !== VIRTUAL_LOCATION_ID
      ? {
          key: String(selectedLocation._id),
          value: selectedLocation,
          label: selectedLocation.name,
        }
      : null;

  const formik = useFormik<QuantityFormValues>({
    initialValues: {
      qty: currentArticle?.qty ?? "",
      sellPrice: currentArticle?.price ?? "",
      transactionComment: "",
    },

    enableReinitialize: true,
    validationSchema: quantitySchema,

    onSubmit: async (values) => {
      if (!currentArticle) return;
      setError("");

      const enteredQty = Number(values.qty);

      const resultingQty = calculateResultingQty(
        currentArticle.qty,
        enteredQty,
        updateMode,
      );

      const isDecrease = resultingQty < currentArticle.qty;

      const articleIsOnVirtualLocation =
        String(currentArticle.inventoryLocation._id) === VIRTUAL_LOCATION_ID;

      const requiresNewLocation =
        articleIsOnVirtualLocation && resultingQty > 0;

      const hasSelectedValidLocation =
        selectedLocation !== null &&
        String(selectedLocation._id) !== VIRTUAL_LOCATION_ID;

      if (resultingQty < 0) {
        setError("Du kan inte ta bort mer än vad som finns tillgängligt.");
        return;
      }

      if (resultingQty === currentArticle.qty) {
        return;
      }

      if (isDecrease && selectedCause === "sold" && values.sellPrice === "") {
        setError("Fyll i pris per enhet för de sålda artiklarna.");
        return;
      }

      if (requiresNewLocation && !hasSelectedValidLocation) {
        setError(
          "Välj en lagerplats innan du höjer saldot för en artikel som ligger på plats 00.",
        );
        return;
      }

      try {
        const response = await fetch("/api/article/quantity", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleId: currentArticle._id,
            updateMode,
            enteredQty,

            newLocationId: requiresNewLocation
              ? selectedLocation?._id
              : undefined,

            cause: isDecrease ? selectedCause : undefined,

            pricePerUnit:
              isDecrease && selectedCause === "sold"
                ? Number(values.sellPrice)
                : undefined,

            comment: values.transactionComment.trim() || undefined,
          }),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          setError(result.data ?? "Lagersaldot kunde inte uppdateras.");
          return;
        }

        /*
         * Endpointen returnerar den nya lagerplatsen,
         * oavsett om den blev 00 eller en riktig plats.
         */
        if (result.data.inventoryLocation) {
          setSelectedLocation(result.data.inventoryLocation);
        }

        await refreshArticles();

        setUpdateMode("set");
        setSelectedCause("repair");

        formik.resetForm({
          values: {
            qty: result.data.qty,
            sellPrice: result.data.price ?? "",
            transactionComment: "",
          },
        });
        setSectionDirty("quantity", false);
        alert("Lagersaldot är uppdaterat!");
      } catch (error) {
        console.error(error);
        setError("Ett oväntat fel inträffade.");
      }
    },
  });
  if (!currentArticle) return;
  const {
    values,
    errors,
    touched,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
    dirty,
  } = formik;

  /*
   * Dessa värden behöver ligga på komponentnivå eftersom
   * de används både i UI:t och för att styra knappen.
   */
  const enteredQty = Number(values.qty) || 0;

  const resultingQty = calculateResultingQty(
    currentArticle.qty,
    enteredQty,
    updateMode,
  );

  const quantityChange = resultingQty - currentArticle.qty;

  const isIncrease = quantityChange > 0;
  const isDecrease = quantityChange < 0;
  const hasQuantityChanged = quantityChange !== 0;
  const hasInvalidQuantity = resultingQty < 0;

  const articleIsOnVirtualLocation =
    String(currentArticle.inventoryLocation._id) === VIRTUAL_LOCATION_ID;

  const requiresNewLocation = articleIsOnVirtualLocation && resultingQty > 0;

  const hasSelectedValidLocation =
    selectedLocation !== null &&
    String(selectedLocation._id) !== VIRTUAL_LOCATION_ID;

  const requiresSellPrice = isDecrease && selectedCause === "sold";

  const hasValidSellPrice =
    !requiresSellPrice ||
    (values.sellPrice !== "" && Number(values.sellPrice) >= 0);

  const canSubmit =
    hasQuantityChanged &&
    !hasInvalidQuantity &&
    hasValidSellPrice &&
    (!requiresNewLocation || hasSelectedValidLocation) &&
    !isSubmitting;

  useEffect(() => {
    setSectionDirty("quantity", hasQuantityChanged);

    return () => {
      setSectionDirty("quantity", false);
    };
  }, [hasQuantityChanged, setSectionDirty]);

  useEffect(() => {
    if (!currentArticle) return;
    void setFieldValue("qty", updateMode === "set" ? currentArticle.qty : 1);

    void setFieldValue("transactionComment", "");
    void setFieldValue("sellPrice", currentArticle.price ?? "");

    setSelectedCause("repair");
    setError("");
  }, [updateMode, currentArticle?.qty, currentArticle?.price, setFieldValue]);

  return (
    <section>
      <h2 className="mb-2 mt-6 text-xl font-bold">Lagersaldo</h2>

      <form onSubmit={handleSubmit}>
        <p className="mt-3 text-right">
          Tillgängligt antal: <strong>{currentArticle.qty} st</strong>
        </p>

        <QuantityModeField id={updateMode} setId={setUpdateMode} />

        <Input
          id="qty"
          name="qty"
          label={
            updateMode === "set"
              ? "Nytt lagersaldo"
              : updateMode === "add"
                ? "Antal att lägga till"
                : "Antal att ta bort"
          }
          type="number"
          min={0}
          step={1}
          value={values.qty}
          onBlur={handleBlur}
          onChange={(event) => {
            const value = event.target.value;

            void setFieldValue("qty", value === "" ? "" : Number(value));

            setError("");
          }}
          error={touched.qty ? errors.qty : undefined}
          placeholder={
            updateMode === "set"
              ? "Ange nytt lagersaldo"
              : updateMode === "add"
                ? "Ange antal att lägga till"
                : "Ange antal att ta bort"
          }
          suffix="st"
          required
        />

        {hasQuantityChanged && (
          <div className="mt-4 rounded-md border p-3 text-sm">
            <p className="font-medium">Överblick av ändringen</p>

            {!hasInvalidQuantity && (
              <>
                <p className="mt-2">
                  Du vill {isIncrease ? "öka" : "minska"} saldot med{" "}
                  <strong>{Math.abs(quantityChange)} st</strong>.
                </p>

                <p className="mt-1">
                  Från <strong>{currentArticle.qty} st</strong> till{" "}
                  <strong>{resultingQty} st</strong>.
                </p>
              </>
            )}

            {hasInvalidQuantity && (
              <ErrorMessage message="Du kan inte ta bort mer än vad som finns tillgängligt." />
            )}

            {isDecrease && !hasInvalidQuantity && (
              <div className="mt-4">
                <div className="mb-2 font-medium">Anledning till uttag</div>

                <SelectSimple
                  value={selectedCause}
                  onChange={(value) => {
                    setSelectedCause(value);
                    setError("");
                  }}
                  options={scrapCauses}
                />

                {selectedCause === "sold" && (
                  <>
                    <Input
                      id="sellPrice"
                      name="sellPrice"
                      label="Försäljningspris per enhet"
                      type="number"
                      min={0}
                      value={values.sellPrice}
                      onBlur={handleBlur}
                      onChange={(event) => {
                        const value = event.target.value;

                        void setFieldValue(
                          "sellPrice",
                          value === "" ? "" : Number(value),
                        );

                        setError("");
                      }}
                      error={touched.sellPrice ? errors.sellPrice : undefined}
                      placeholder="Ange försäljningspris"
                      suffix="kr/st (inkl. moms)"
                      required
                    />

                    <p className="mt-2 text-right text-sm">
                      Totalt försäljningsvärde:{" "}
                      <strong>
                        {Number(values.sellPrice || 0) *
                          Math.abs(quantityChange)}{" "}
                        kr
                      </strong>
                    </p>
                  </>
                )}

                <Input
                  id="transactionComment"
                  name="transactionComment"
                  label="Kommentar"
                  type="text"
                  value={values.transactionComment}
                  containerClassName="mt-2"
                  onChange={(event) => {
                    void setFieldValue(
                      "transactionComment",
                      event.target.value,
                    );
                  }}
                  placeholder="Ange en kommentar till uttaget"
                />
              </div>
            )}

            {requiresNewLocation && (
              <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3">
                <p className="font-medium">Välj lagerplats</p>

                <p className="mt-1 text-sm text-gray-700">
                  Artikeln ligger på den virtuella lagerplatsen 00. För att höja
                  lagersaldot behöver du välja var artikeln ska placeras.
                </p>

                <div className="mt-3">
                  <SearchSelect
                    options={inventoryLocationOptions}
                    selectedOption={selectedLocationOption}
                    onChange={(option) => {
                      setSelectedLocation(option?.value ?? null);
                      setError("");
                    }}
                    placeholder="Välj lagerplats"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {error && <ErrorMessage message={error} />}

        <div className="mt-5 flex justify-end">
          <Button
            variant="positive"
            type="submit"
            className="px-3 py-3 text-sm font-semibold"
            disabled={!canSubmit}
          >
            {isSubmitting ? "Uppdaterar lagersaldo..." : "Uppdatera lagersaldo"}
          </Button>
        </div>
      </form>
    </section>
  );
};

export default ArticleQuantitySection;
