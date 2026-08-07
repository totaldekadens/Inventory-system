import { articleContext } from "@/components/context/ArticleProvider";
import VehicleModelSelect from "@/components/vehicle-model/VehicleModelSelect";
import { ErrorMessage } from "../articleForm/NewArticle";
import ForSaleField from "../articleForm/ForSaleField";
import { useContext, useEffect, useState } from "react";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import { useFormik } from "formik";
import UploadImagesForm from "../articleForm/UploadImagesForm";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import * as Yup from "yup";
import { useRefreshArticles } from "@/lib/useRefreshArticles";
import { articleApi, UpdateArticleRequest } from "@/lib/api/articles";

export const inputClass =
  "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-3 mt-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset text-base sm:leading-6 md:h-auto";

const articleInfoSchema = Yup.object({
  title: Yup.string().required("Titel måste anges"),
  supplierArtno: Yup.string(),
  description: Yup.string(),
  condition: Yup.string().required("Skick måste anges"),
  purchaseValue: Yup.number()
    .min(0, "Inköpspriset kan inte vara negativt")
    .nullable(),
  price: Yup.number()
    .min(0, "Försäljningspriset kan inte vara negativt")
    .nullable(),
  comment: Yup.string(),
});

const ArticleInfoSection = () => {
  const { currentArticle, setSectionDirty } = useContext(articleContext);
  if (!currentArticle) return;
  const [forSale, setForSale] = useState(currentArticle.forSale);
  const [error, setError] = useState<string>("");
  const refreshArticles = useRefreshArticles();
  const initialSelectedModels = currentArticle.vehicleModels.map((model, i) =>
    model._id ? model._id.toString() : `${i}`,
  );

  const [selectedModels, setSelectedModels] = useState<string[]>(
    initialSelectedModels,
  );
  const [imageList, setImageList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);

  const formik = useFormik({
    initialValues: {
      supplierArtno: currentArticle.supplierArtno ?? "",
      title: currentArticle.title,
      description: currentArticle.description ?? "",
      condition: currentArticle.condition,
      purchaseValue: currentArticle.purchaseValue ?? "",
      price: currentArticle.price ?? "",
      comment: currentArticle.comment ?? "",
    },

    enableReinitialize: true,

    // Pass the Yup schema to validate the form
    validationSchema: articleInfoSchema,

    // Handle form submission
    onSubmit: async ({
      supplierArtno,
      title,
      description,
      condition,
      purchaseValue,
      price,
      comment,
    }) => {
      setError("");

      if (selectedModels.length === 0) {
        setError("Välj minst en fordonsmodell.");
        return;
      }

      try {
        const updateArticle: UpdateArticleRequest = {
          ...currentArticle,
          _id: String(currentArticle._id),
          supplierArtno,
          vehicleModels: selectedModels,
          title,
          description,
          condition,
          purchaseValue:
            purchaseValue === "" ? undefined : Number(purchaseValue),
          forSale,
          price: price === "" ? undefined : Number(price),
          comment,
          images: imageList.length > 0 ? imageList : currentArticle.images,
        };

        // Upload images to Cloudinary
        await UploadToImagesToServer(fileList);

        await articleApi.update(updateArticle);

        setImageList([]);
        setFileList([]);

        await refreshArticles();

        setSectionDirty("info", false);

        alert("Artikeln är uppdaterad!");
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Artikeln kunde inte uppdateras.",
        );
      }
    },
  });

  // Destructure the formik object
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    touched,
    handleBlur,
    dirty,
    isSubmitting,
  } = formik;

  const modelsHaveChanged =
    selectedModels.length !== initialSelectedModels.length ||
    selectedModels.some(
      (modelId, index) => modelId !== initialSelectedModels[index],
    );

  const forSaleHasChanged = forSale !== currentArticle.forSale;

  const imagesHaveChanged = imageList.length > 0 || fileList.length > 0;

  const hasChanges =
    dirty || modelsHaveChanged || forSaleHasChanged || imagesHaveChanged;

  useEffect(() => {
    setSectionDirty("info", hasChanges);

    return () => {
      setSectionDirty("info", false);
    };
  }, [hasChanges]);
  return (
    <div>
      <div className="text-xl font-bold mt-6 mb-2">Redigera artikel</div>
      <form onSubmit={handleSubmit}>
        <div className="w-full flex flex-col gap-3">
          {/* Title */}
          <Input
            id="title"
            name="title"
            label="Titel"
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            type="text"
            required
            containerClassName="sm:mt-0"
            placeholder="Titel"
            error={touched.title ? errors.title : undefined}
          />
          {/* SupplierNo */}
          <Input
            id="supplierArtno"
            name="supplierArtno"
            label="Lev.art. no"
            value={values.supplierArtno}
            onChange={handleChange}
            type="text"
            placeholder="Leverantörens artikelnummer"
          />
          {/* Condition */}
          <Input
            id="condition"
            name="condition"
            label="Skick"
            type="text"
            value={values.condition}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.condition ? errors.condition : undefined}
            required
            placeholder="Beskriv skicket på artikeln"
          />
          {/* Description */}
          <div>
            <label htmlFor="description" className="font-bold">
              Beskrivning
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={values.description}
              onChange={handleChange}
              style={{ height: "100px" }}
              className={inputClass}
              placeholder="Beskrivning"
            />
          </div>
          {/* Models */}
          <div>
            <label className="font-bold">Fordonsmodeller</label>
            <VehicleModelSelect
              setSelectedModel={setSelectedModels}
              selectedModel={selectedModels}
            />
          </div>

          {/* Purchase value */}
          <Input
            id="purchaseValue"
            name="purchaseValue"
            label="Inköpspris"
            min={0}
            type="number"
            value={values.purchaseValue}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.purchaseValue ? errors.purchaseValue : undefined}
            placeholder="Inköpspris"
            suffix="kr/st (inkl. moms)"
          />
          {/* Comment */}
          <Input
            id="comment"
            name="comment"
            label="Övrig kommentar"
            type="text"
            value={values.comment}
            onChange={handleChange}
            placeholder="Fyll i övrig kommentar"
          />
          {/* For sale */}
          <ForSaleField setForSale={setForSale} forSale={forSale} />
          {forSale && (
            <Input
              id="price"
              name="price"
              label="Försäljningspris"
              min={0}
              type="number"
              value={values.price}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.price ? errors.price : undefined}
              placeholder="Till vilket pris?"
              suffix=" kr/st (inkl. moms)"
            />
          )}

          {/* Upload images */}
          <UploadImagesForm
            setImageList={setImageList}
            setValue={setFileList}
            value={fileList}
            title="Byt ut bilder:"
          />

          <div className="mt-5 w-full flex flex-col sm:flex-row gap-2 justify-end">
            <Button
              variant="positive"
              type="submit"
              className=" px-3 py-3 text-sm font-semibold "
              disabled={!hasChanges || isSubmitting}
            >
              Uppdatera information
            </Button>
          </div>
          {error ? <ErrorMessage message={error} /> : null}
        </div>
      </form>
    </div>
  );
};

export default ArticleInfoSection;
