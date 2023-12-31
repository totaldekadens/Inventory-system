import * as Yup from "yup";
import { useFormik } from "formik";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import UploadForm from "./uploadForm";
import SelectLocation from "./searchbars/SelectLocation";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import { articleContext } from "./context/ArticleProvider";
import ForSaleRadioButton from "./buttons/ForSaleRadioButton";
import Button from "./buttons/Button";
import SelectModels from "./searchbars/SelectModels";
import { Types } from "mongoose";
import { IconX } from "@tabler/icons-react";
import clsx from "clsx";

// Yup schema to validate the form
export const schema = Yup.object().shape({
  supplierArtno: Yup.string(),
  title: Yup.string().max(37, "Max 37 tecken!").required(),
  description: Yup.string(),
  qty: Yup.number().required("Fyll i antal!"),
  condition: Yup.string()
    .max(25, "Max 25 tecken!")
    .required("Fyll i skicket på din artikel!"),
  purchaseValue: Yup.number(),
  price: Yup.number(),
  comment: Yup.string(),
});

export const ErrorMessage = ({ message }: any) => {
  return (
    <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
  );
};

interface Props {
  setCreateArticle: Dispatch<SetStateAction<boolean>>;
}

const NewArticle = ({ setCreateArticle }: Props) => {
  const [forSale, setForSale] = useState(false);
  const { setCurrentArticles } = useContext(articleContext);

  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const [imageList, setImageList] = useState<string[]>([]);
  const [fileList, setFileList] = useState<File[]>([]);
  const [error, setError] = useState<string>("");
  const formik = useFormik({
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
        if (imageList.length < 1) {
          setError("Lägg till minst en bild");
          return;
        }

        if (selectedModels.length < 1) {
          setError("Välj minst en fordonsmodell");
          return;
        }

        if (!selectedLocation) {
          setError("Välj en lagerplats");
          return;
        }

        if (
          Number(qty) > 0 &&
          selectedLocation?._id ==
            ("64a95847dec1488ee60d10cd" as unknown as Types.ObjectId)
        ) {
          setError(
            "Lagerplats '00' är endast till för artiklar med lagersaldo '0'. Välj ny lagerplats "
          );
          return;
        }

        const newArticle = {
          supplierArtno,
          vehicleModels: selectedModels as unknown as Types.ObjectId[],
          title,
          description,
          qty: Number(qty),
          condition,
          purchaseValue: Number(purchaseValue),
          forSale,
          price: Number(price),
          comment,
          images: imageList,
          inventoryLocation: selectedLocation?._id as unknown as Types.ObjectId,
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

  // Sets negative numbers to positive
  const newQty =
    Number(values.qty) < 0 ? Math.abs(Number(values.qty)) : values.qty;
  const newPrice = values?.price
    ? Number(values?.price) < 0
      ? Math.abs(Number(values.price))
      : values.price
    : values.price;
  const newPurchaseValue = values?.purchaseValue
    ? Number(values?.purchaseValue) < 0
      ? Math.abs(Number(values.purchaseValue))
      : values.purchaseValue
    : values.purchaseValue;

  return (
    <div className="pt-10 sm:pt-0 z-20 fixed inset-0 bg-black/20 flex justify-center ">
      <div className="pt-5 sm:pt-0 pb-10  sm:px-2 sm:pb-16 shadow-lg rounded-lg absolute top-0 bottom-0 my-0 sm:my-10 md:my-20 w-full  sm:w-auto  bg-white overflow-y-auto">
        <div className="flex sm:hidden  w-full justify-end px-5 ">
          <IconX
            className="cursor-pointer"
            width={32}
            height={32}
            onClick={() => {
              setCreateArticle(false);
            }}
          />
        </div>
        <div className="pt-5 sm:pt-0 w-full flex sm:items-center justify-center sm:rounded-lg">
          <div className="px-4 py-5 bg-white max-w-2xl w-full">
            <div className=" w-full flex justify-between">
              <h3 className="text-xl font-medium leading-6 text-gray-900">
                Lägg till artikel
              </h3>
              <IconX
                className="cursor-pointer hidden sm:block"
                onClick={() => {
                  setCreateArticle(false);
                }}
              />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-7">
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
              {errors.supplierArtno && touched.supplierArtno ? (
                <div className="text-red-600 pl-3 -mt-3 text-xs">
                  {errors.supplierArtno}
                </div>
              ) : null}
              <input
                id="title"
                name="title"
                value={values.title}
                onChange={handleChange}
                type="text"
                autoComplete="Titel"
                className={inputClass}
                placeholder="Titel*"
              />
              {errors.title && touched.title ? (
                <div className="text-red-600 pl-3 -mt-3 text-xs">
                  {errors.title}
                </div>
              ) : null}

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
                style={{ height: "100px" }}
                className={inputClass}
                placeholder="Beskrivning"
              />
              {errors.description && touched.description ? (
                <div className="text-red-600 pl-3 -mt-3 text-xs">
                  {errors.description}
                </div>
              ) : null}

              <div className="relative">
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  min={0}
                  autoComplete="qty"
                  value={newQty}
                  onChange={handleChange}
                  className={clsx(`pr-8`, inputClass)}
                  placeholder="Antal"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                    st
                  </div>
                </div>
                {errors.qty && touched.qty ? (
                  <div className="text-red-600 pl-3 -mt-3 text-xs">
                    {errors.qty}
                  </div>
                ) : null}
              </div>
              <input
                id="condition"
                name="condition"
                type="text"
                autoComplete="condition"
                value={values.condition}
                onChange={handleChange}
                className={inputClass}
                placeholder="Beskriv skicket på artikeln*"
              />
              {errors.condition && touched.condition ? (
                <div className="text-red-600 pl-3 -mt-3 text-xs">
                  {errors.condition}
                </div>
              ) : null}
              <div className="flex flex-col sm:flex-row gap-2">
                <SelectModels
                  setSelectedModel={setSelectedModels}
                  selectedModel={selectedModels}
                />
                <SelectLocation
                  setSelectedLocation={setSelectedLocation}
                  selectedLocation={selectedLocation}
                />
              </div>

              <div className="relative">
                <input
                  id="purchaseValue"
                  name="purchaseValue"
                  type="number"
                  min={0}
                  autoComplete="purchaseValue"
                  value={newPurchaseValue}
                  onChange={handleChange}
                  className={clsx(`pr-8`, inputClass)}
                  placeholder="Inköpspris"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                    Kr
                  </div>
                </div>
                {errors.purchaseValue && touched.purchaseValue ? (
                  <div className="text-red-600 pl-3 -mt-3 text-xs">
                    {errors.purchaseValue}
                  </div>
                ) : null}
              </div>

              <input
                id="comment"
                name="comment"
                type="text"
                autoComplete="comment"
                value={values.comment}
                onChange={handleChange}
                className={inputClass}
                placeholder="Övrig kommentar"
              />
              <ForSaleRadioButton forSale={forSale} setForSale={setForSale} />
              {forSale ? (
                <div className="relative">
                  <input
                    id="price"
                    name="price"
                    type="number"
                    min={0}
                    autoComplete="price"
                    value={newPrice}
                    onChange={handleChange}
                    className={clsx(`pr-8`, inputClass)}
                    placeholder="Till vilket pris?"
                  />
                  <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                    <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                      Kr
                    </div>
                  </div>
                </div>
              ) : null}
              <UploadForm
                setImageList={setImageList}
                setValue={setFileList}
                value={fileList}
              />
              {error ? <ErrorMessage message={error} /> : null}
              <div className="mt-5 w-full flex justify-end">
                <Button
                  title="Skapa"
                  type="submit"
                  variant="positive"
                  className=" w-full sm:w-36 px-3 py-3"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewArticle;
