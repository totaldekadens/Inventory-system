import * as Yup from "yup";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useState } from "react";
import UploadForm from "./uploadForm";
import SelectLocation from "./SelectLocation";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { IconX } from "@tabler/icons-react";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";

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

interface Props {
  setHidden: Dispatch<SetStateAction<boolean>>;
}

const CreateArticle = ({ setHidden }: Props) => {
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
          alert("Artikeln är inlagd!"); // Fix a proper pop up later
          formik.resetForm();
          setImageList([]);
        } else {
          setError("Något gick fel!");
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;
  return (
    <div className="absolute inset-0 flex items-center justify-center sm:rounded-lg">
      <div className="px-4 py-5 bg-slate-200 sm:p-6 max-w-2xl w-full">
        <div className="w-full flex justify-between">
          <h3 className="text-base font-semibold leading-6 text-gray-900">
            Lägg till artikel
          </h3>
          <IconX
            className="cursor-pointer"
            onClick={() => {
              setHidden(true);
            }}
          />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-7">
          <input
            id="artno"
            name="artno"
            value={values.artno}
            onChange={handleChange}
            type="text"
            autoComplete="Leverantörs artikelnummer"
            className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative mb-2 block h-11 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
            placeholder="Leverantörens artikelnummer"
          />

          <label htmlFor="description" className="sr-only">
            Beskrivning
          </label>
          <input
            id="description"
            name="description"
            type="text"
            autoComplete="description"
            value={values.description}
            onChange={handleChange}
            required
            className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
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
            className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
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
            className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
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
            className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
            placeholder="Inköpspris"
          />
          <input
            id="comment"
            name="comment"
            type="text"
            autoComplete="comment"
            value={values.comment}
            onChange={handleChange}
            className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
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
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
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
