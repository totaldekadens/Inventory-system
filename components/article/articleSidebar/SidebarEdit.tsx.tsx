import { IconEdit } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../../context/ArticleProvider";
import ForSaleRadioButton from "@/components/buttons/ForSaleRadioButton";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { ErrorMessage, schema } from "@/components/CreateArticle";
import { useFormik } from "formik";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import SelectLocation from "@/components/searchbars/SelectLocation";
import UploadForm from "@/components/uploadForm";

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const SidebarEdit = ({ article, className, edit, setEdit }: Props) => {
  const [forSale, setForSale] = useState(article.forSale);
  const { setCurrentArticles } = useContext(articleContext);
  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      supplierArtno: article.supplierArtno,
      title: article.title,
      description: article.description,
      qty: article.qty,
      condition: article.condition,
      purchaseValue: article.purchaseValue,
      price: article.price,
      comment: article.comment,
    },

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
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
      try {
        const updateArticle = {
          _id: article._id,
          artno: article.artno,
          supplierArtno,
          title,
          description,
          qty,
          condition,
          purchaseValue,
          forSale,
          price,
          comment,
          images: imageList.length > 0 ? imageList : article.images,
          inventoryLocation: selectedLocation?._id,
        };
        // Upload images to Cloudinary
        await UploadToImagesToServer(fileList);

        const request = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateArticle),
        };

        const response = await fetch("/api/article", request);
        const result = await response.json();

        if (result.success) {
          alert("Artikeln är uppdaterad!"); // Fix a proper pop up later. Ask if you want to continue or close window
          formik.resetForm();
          setImageList([]);
          setFileList([]);

          // Updates list
          const response = await fetch("/api/article/");
          const result = await response.json();
          if (result.success) {
            setCurrentArticles(result.data);
          }
        } else {
          setError("Något gick fel!");
        }
      } catch (err) {
        console.error(err);
      }
    },
  });
  const inputClass =
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-1.5 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto";

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <aside className="col-span-4">
      <form onSubmit={handleSubmit} className="">
        <div className="flex justify-between w-full mb-4">
          <div className="w-full flex flex-col gap-3">
            <div className="mt-5 sm:mt-0">
              <label>Titel</label>
              <input
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                type="text"
                required
                autoComplete="Titel"
                className={inputClass}
                placeholder="Titel*"
              />
            </div>
            <div>
              <label>Lev.art. no</label>
              <input
                id="supplierArtno"
                name="supplierArtno"
                value={values.supplierArtno}
                onChange={handleChange}
                type="text"
                autoComplete="Leverantörens artikelnummer"
                className={inputClass}
                placeholder="Leverantörens artikelnummer"
              />
            </div>
            <div>
              <label>Skick</label>
              <input
                id="condition"
                name="condition"
                type="text"
                autoComplete="condition"
                value={values.condition}
                onChange={handleChange}
                required
                className={inputClass}
                placeholder="Beskriv skicket på artikeln*"
              />
            </div>
            <div>
              <label>Antal</label>
              <div className="relative">
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  autoComplete="qty"
                  value={values.qty}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Antal*"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                    st
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label>Beskrivning</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                autoComplete="description"
                value={values.description}
                onChange={handleChange}
                style={{ height: "100px" }}
                className={inputClass}
                placeholder="Beskrivning"
              />
            </div>
            <div>
              <label>Lagerplats</label>
              <p>Nuvarande lagerplats: {article.inventoryLocation.name}</p>
              <SelectLocation
                placeholder="Välj ny lagerplats"
                setSelectedLocation={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
          </div>
        </div>
        <label>Inköpspris</label>
        <div className="relative">
          <input
            id="purchaseValue"
            name="purchaseValue"
            type="number"
            autoComplete="purchaseValue"
            value={values.purchaseValue}
            onChange={handleChange}
            className={inputClass}
            placeholder="Inköpspris"
          />
          <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
              Kr
            </div>
          </div>
        </div>

        {/* For sale */}
        <ForSaleRadioButton
          article={article}
          forSale={forSale}
          setForSale={setForSale}
        />
        {forSale ? (
          <div className="mt-5">
            <label>Pris</label>
            <div className="relative">
              <input
                id="price"
                name="price"
                type="number"
                autoComplete="price"
                value={values.price}
                onChange={handleChange}
                className={inputClass}
                placeholder="Till vilket pris?"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                  Kr
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <UploadForm
          setImageList={setImageList}
          setValue={setFileList}
          value={fileList}
          title="Byt ut bilder:"
        />
        {error ? <ErrorMessage message={error} /> : null}
        <div className="mt-5 w-full flex flex-col sm:flex-row gap-2 justify-end">
          <button className="inline-flex w-full sm:w-36 justify-center items-center rounded-md bg-red-600 px-3 py-3 text-sm font-semibold text-indigo-50 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-700">
            Avbryt
          </button>
          <button
            type="submit"
            className="inline-flex w-full sm:w-36 justify-center items-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-indigo-50 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-700"
          >
            Uppdatera artikel
          </button>
        </div>
      </form>
    </aside>
  );
};

export default SidebarEdit;
