import * as Yup from "yup";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import UploadForm from "./uploadForm";
import SelectLocation from "./searchbars/SelectLocation";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { IconX } from "@tabler/icons-react";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import { articleContext } from "./context/ArticleProvider";

// Yup schema to validate the form
const schema = Yup.object().shape({
  artno: Yup.string(),
  description: Yup.string().required(),
  qty: Yup.number().required(),
  condition: Yup.string().required(),
  purchaseValue: Yup.number(),
  comment: Yup.string(),
});

const ErrorMessage = ({ message }: any) => {
  return (
    <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
  );
};

const CreateArticle = ({}) => {
  const { setCurrentArticles } = useContext(articleContext);
  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(null);
  const [imageList, setImageList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const formik = useFormik({
    initialValues: {
      artno: "",
      description: "",
      qty: "",
      condition: "",
      purchaseValue: "",
      comment: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({
      artno,
      description,
      qty,
      condition,
      purchaseValue,
      comment,
    }) => {
      try {
        const newArticle = {
          artno,
          description,
          qty,
          condition,
          purchaseValue,
          comment,
          images: imageList,
          inventoryLocation: selectedLocation?._id,
        };
        // Upload images to Cloudinary
        await UploadToImagesToServer(fileList);

        const request = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newArticle),
        };

        const response = await fetch("/api/article", request);
        const result = await response.json();

        if (result.success) {
          alert("Artikeln är inlagd!"); // Fix a proper pop up later. Ask if you want to continue or close window
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
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto";

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className=" w-full bg-white flex sm:items-center justify-center sm:rounded-lg">
      <div className="px-4 py-5 bg-white sm:p-6 max-w-2xl w-full">
        <div className="pb-8 sm:pb-0 w-full flex justify-between">
          <h3 className="text-2xl sm:text-base font-semibold leading-6 text-gray-900">
            Lägg till artikel
          </h3>
          {/* <IconX className="cursor-pointer" /> */}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-7">
          <input
            id="artno"
            name="artno"
            value={values.artno}
            onChange={handleChange}
            type="text"
            autoComplete="Leverantörs artikelnummer"
            className={inputClass}
            placeholder="Leverantörens artikelnummer"
          />

          <label htmlFor="description" className="sr-only">
            Beskrivning
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            autoComplete="description"
            value={values.description}
            onChange={handleChange}
            required
            style={{ height: "100px" }}
            className={inputClass}
            placeholder="Beskrivning*"
          />
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
          <SelectLocation
            setSelectedLocation={setSelectedLocation}
            selectedLocation={selectedLocation}
          />
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
          <input
            id="comment"
            name="comment"
            type="text"
            autoComplete="comment"
            value={values.comment}
            onChange={handleChange}
            className={inputClass}
            placeholder="Kommentar"
          />
          <UploadForm
            setImageList={setImageList}
            setValue={setFileList}
            value={fileList}
          />
          {error ? <ErrorMessage message={error} /> : null}
          <div className="mt-5 w-full flex justify-end">
            <button
              type="submit"
              className="inline-flex w-full sm:w-36 justify-center items-center rounded-md bg-indigo-600 px-3 py-3 text-sm font-semibold text-indigo-50 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-indigo-700"
            >
              Skapa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateArticle;
