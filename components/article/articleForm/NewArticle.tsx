import * as Yup from "yup";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import ForSaleField from "./ForSaleField";
import Button from "../../ui/Button";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";
import UploadImagesForm from "./UploadImagesForm";
import VehicleModelSelect from "@/components/vehicle-model/VehicleModelSelect";
import SearchSelect from "../../ui/SearchSelect";
import { inventoryLocationContext } from "../../context/InventoryLocationProvider";
import { articleApi } from "@/lib/api/articles";
import { useRefreshArticles } from "@/lib/useRefreshArticles";
import Input from "@/components/ui/Input";

const VIRTUAL_LOCATION_ID = "64a95847dec1488ee60d10cd";

export const schema = Yup.object({
  supplierArtno: Yup.string(),

  title: Yup.string().max(37, "Max 37 tecken!").required("Titel måste anges"),

  description: Yup.string(),

  qty: Yup.number()
    .typeError("Ange ett giltigt antal")
    .integer("Antalet måste vara ett heltal")
    .min(0, "Antalet kan inte vara negativt")
    .required("Fyll i antal!"),

  condition: Yup.string()
    .max(25, "Max 25 tecken!")
    .required("Fyll i skicket på din artikel!"),

  purchaseValue: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(0, "Inköpspriset kan inte vara negativt")
    .optional(),

  price: Yup.number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value,
    )
    .min(0, "Försäljningspriset kan inte vara negativt")
    .optional(),

  comment: Yup.string(),
});

export const ErrorMessage = ({ message }: { message: string }) => (
  <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
);

interface Props {
  setCreateArticle: Dispatch<SetStateAction<boolean>>;
}

interface FormValues {
  supplierArtno: string;
  title: string;
  description: string;
  qty: number | "";
  condition: string;
  purchaseValue: number | "";
  price: number | "";
  comment: string;
}

const NewArticle = ({ setCreateArticle }: Props) => {
  const { inventoryLocations } = useContext(inventoryLocationContext);

  const refreshArticles = useRefreshArticles();

  const [forSale, setForSale] = useState(false);

  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(null);

  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [imageList, setImageList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState("");

  const inventoryLocationOptions = inventoryLocations.map((location) => ({
    key: String(location._id),
    value: location,
    label: location.name,
  }));

  const selectedLocationOption = selectedLocation
    ? {
        key: String(selectedLocation._id),
        value: selectedLocation,
        label: selectedLocation.name,
      }
    : null;

  const formik = useFormik<FormValues>({
    initialValues: {
      supplierArtno: "",
      title: "",
      description: "",
      qty: "",
      condition: "",
      purchaseValue: "",
      price: "",
      comment: "",
    },

    validationSchema: schema,

    onSubmit: async ({
      supplierArtno,
      title,
      description,
      qty,
      condition,
      purchaseValue,
      price,
      comment,
    }) => {
      setError("");

      if (imageList.length < 1) {
        setError("Lägg till minst en bild.");
        return;
      }

      if (selectedModels.length < 1) {
        setError("Välj minst en fordonsmodell.");
        return;
      }

      if (!selectedLocation) {
        setError("Välj en lagerplats.");
        return;
      }

      const numericQty = Number(qty);

      if (
        numericQty > 0 &&
        String(selectedLocation._id) === VIRTUAL_LOCATION_ID
      ) {
        setError(
          "Lagerplats 00 är endast till för artiklar med lagersaldo 0. Välj en annan lagerplats.",
        );
        return;
      }

      // Fixa i backend senare
      const isVirtualLocation =
        String(selectedLocation._id) === VIRTUAL_LOCATION_ID;

      if (numericQty === 0 && !isVirtualLocation) {
        setError(
          "Artiklar med lagersaldo 0 måste placeras på lagerplats 00. Välj lagerplats 00 innan du sparar.",
        );
        return;
      }

      if (numericQty > 0 && isVirtualLocation) {
        setError(
          "Lagerplats 00 är endast till för artiklar med lagersaldo 0. Välj en annan lagerplats innan du sparar.",
        );
        return;
      }

      try {
        /*
         * Ladda upp bilderna innan artikeln skapas.
         * Om funktionen returnerar URL:er bör de användas här i stället
         * för imageList, beroende på hur din upload-funktion fungerar.
         */
        await UploadToImagesToServer(fileList);

        await articleApi.create({
          supplierArtno: supplierArtno.trim() || undefined,
          vehicleModels: selectedModels,
          title: title.trim(),
          description: description.trim() || undefined,
          qty: numericQty,
          condition: condition.trim(),

          purchaseValue:
            purchaseValue === "" ? undefined : Number(purchaseValue),

          forSale,

          price: forSale && price !== "" ? Number(price) : undefined,

          comment: comment.trim() || undefined,
          images: imageList,
          inventoryLocation: String(selectedLocation._id),
        });

        await refreshArticles();

        formik.resetForm();
        setForSale(false);
        setSelectedLocation(null);
        setSelectedModels([]);
        setImageList([]);
        setFileList([]);

        alert("Artikeln är inlagd!");
      } catch (error) {
        console.error("Create article error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Artikeln kunde inte skapas.",
        );
      }
    },
  });

  const {
    errors,
    touched,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    isSubmitting,
  } = formik;

  const inputClass =
    "relative block h-11 w-full rounded-md border-0 bg-dark-50/20 py-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-light-300 sm:leading-6 md:h-auto";

  return (
    <div className="fixed inset-0 z-20 flex justify-center bg-black/20 pt-10 sm:pt-0">
      <div className="absolute bottom-0 top-0 my-0 w-full overflow-y-auto rounded-lg bg-white pb-10 pt-5 shadow-lg sm:my-10 sm:w-auto sm:px-2 sm:pb-16 sm:pt-0 md:my-20">
        <div className="flex w-full justify-end px-5 sm:hidden">
          <button
            type="button"
            aria-label="Stäng"
            onClick={() => setCreateArticle(false)}
          >
            <IconX width={32} height={32} aria-hidden="true" />
          </button>
        </div>

        <div className="flex w-full justify-center pt-5 sm:items-center sm:rounded-lg sm:pt-0">
          <div className="w-full max-w-2xl bg-white px-4 py-5">
            <div className="flex w-full justify-between">
              <h2 className="text-2xl font-medium leading-6 text-gray-900">
                Lägg till artikel
              </h2>

              <button
                type="button"
                aria-label="Stäng"
                className="hidden sm:block"
                onClick={() => setCreateArticle(false)}
              >
                <IconX aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-3">
              <Input
                id="supplierArtno"
                name="supplierArtno"
                label="Leverantörens artikelnummer"
                value={values.supplierArtno}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                autoComplete="off"
                className={inputClass}
                placeholder="Ange leverantörens artikelnummer"
              />

              <Input
                id="title"
                name="title"
                label="Titel"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                className={inputClass}
                placeholder="Ange artikelns titel"
                required
                error={touched.title && errors.title ? errors.title : ""}
              />

              <div>
                <label htmlFor="description" className="font-semibold">
                  Beskrivning
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={values.description}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={inputClass}
                  placeholder="Beskriv artikeln"
                />
              </div>

              <Input
                id="qty"
                name="qty"
                label="Antal"
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
                className={clsx("pr-8", inputClass)}
                placeholder="Ange antal"
                required
                suffix="st"
                error={touched.qty && errors.qty ? errors.qty : ""}
              />

              <Input
                id="condition"
                name="condition"
                label="Skick"
                type="text"
                value={values.condition}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass}
                placeholder="Beskriv artikelns skick"
                error={
                  touched.condition && errors.condition ? errors.condition : ""
                }
                required
              />

              <div>
                <div className="mb-2 font-semibold">Fordonsmodeller *</div>
                <VehicleModelSelect
                  setSelectedModel={setSelectedModels}
                  selectedModel={selectedModels}
                />
              </div>

              <div>
                <div className="mb-2 font-semibold">Lagerplats *</div>

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

              <Input
                id="purchaseValue"
                name="purchaseValue"
                label="Inköpspris"
                type="number"
                min={0}
                value={values.purchaseValue}
                onBlur={handleBlur}
                onChange={(event) => {
                  const value = event.target.value;

                  void setFieldValue(
                    "purchaseValue",
                    value === "" ? "" : Number(value),
                  );
                }}
                className={inputClass}
                placeholder="Ange inköpspris"
                suffix="kr/st (inkl. moms)"
              />

              <Input
                id="comment"
                name="comment"
                label="Övrig kommentar"
                type="text"
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                className={inputClass}
                placeholder="Skriv en kommentar"
              />

              <ForSaleField setForSale={setForSale} forSale={forSale} />

              {forSale && (
                <Input
                  id="price"
                  name="price"
                  type="number"
                  label="Försäljningspris"
                  min={0}
                  value={values.price}
                  onBlur={handleBlur}
                  onChange={(event) => {
                    const value = event.target.value;

                    void setFieldValue(
                      "price",
                      value === "" ? "" : Number(value),
                    );
                  }}
                  className={clsx("pr-[120px]", inputClass)}
                  placeholder="Ange försäljningspris"
                  suffix=" kr/st (inkl. moms)"
                />
              )}

              <UploadImagesForm
                setImageList={setImageList}
                setValue={setFileList}
                value={fileList}
              />

              {error && <ErrorMessage message={error} />}

              <div className="mt-5 flex w-full justify-end">
                <Button
                  type="submit"
                  variant="positive"
                  className="w-full px-3 py-3 sm:w-36"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Skapar artikel..." : "Lägg till artikel"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArticle;
