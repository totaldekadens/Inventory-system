import { IconEdit } from "@tabler/icons-react";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../../context/ArticleProvider";
import ForSaleRadioButton from "@/components/buttons/ForSaleRadioButton";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { useFormik } from "formik";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import SelectLocation from "@/components/searchbars/SelectLocation";
import UploadForm from "@/components/uploadForm";
import Button from "@/components/buttons/Button";
import SelectModels from "@/components/searchbars/SelectModels";
import { ErrorMessage, schema } from "@/components/NewArticle";
import SelectSimple from "@/components/searchbars/SelectSimple";
import { todayDate } from "@/lib/setDate";

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const SidebarEdit = ({ article, className, edit, setEdit }: Props) => {
  const [forSale, setForSale] = useState(article.forSale);
  const [selectedScrapCause, setSelectedScrapCause] = useState<{
    id: string;
    label: string;
  }>({ id: "1", label: "Använd vid reparation" });
  const { setCurrentArticles } = useContext(articleContext);

  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(article.inventoryLocation);

  const initialSelectedModels = article.vehicleModels.map((model, i) =>
    model._id ? model._id.toString() : `${i}`
  );

  const [selectedModels, setSelectedModels] = useState<string[]>(
    initialSelectedModels
  );
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
      sellPrice: "",
      scrapComment: "",
    },

    enableReinitialize: true,

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
      sellPrice,
      scrapComment,
    }) => {
      try {
        if (selectedModels.length < 1) {
          setError("Välj minst en fordonsmodell");
          return;
        }

        if (!selectedLocation) {
          setError("Välj en lagerplats");
          return;
        }

        if (qty != article.qty) {
          if (qty < article.qty) {
            if (selectedScrapCause.id == "5" && !sellPrice) {
              setError("Fyll i pris per enhet du sålde artiklarna för");
              return;
            }
          }

          const createTransactionHistory = {
            direction: qty < article.qty ? "-" : "+",
            cause: qty < article.qty ? selectedScrapCause.label : "",
            pricePerUnit: Number(sellPrice),
            qty:
              article.qty > qty
                ? Math.abs(values.qty - article.qty)
                : values.qty - article.qty,

            article: {
              _id: article._id,
              artno: article.artno,
              supplierArtno,
              vehicleModels: selectedModels,
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
              createdDate: article.createdDate,
            },
            comment: scrapComment,
            createdDate: todayDate,
          };

          const request = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(createTransactionHistory),
          };

          const response = await fetch("/api/transactionhistory", request);
          await response.json();
        }

        const updateArticle = {
          _id: article._id,
          artno: article.artno,
          supplierArtno,
          vehicleModels: selectedModels,
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
    <aside
      className="flex flex-col col-span-1 md:px-6 mx-auto max-w-8xl py-6 w-full h-full"
      style={{ maxWidth: "600px" }}
    >
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
                  min={0}
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
              {article.qty != values.qty ? (
                <div className="text-xs rounded-md p-2  m-3 border">
                  <div className="font-medium mb-2">
                    Överblick ändring av antal
                  </div>
                  {values.qty > article.qty ? (
                    <div>
                      <div>
                        Du vill öka antalet med: {values.qty - article.qty}{" "}
                        {values.qty - article.qty > 1 ? "artiklar" : "artikel"}
                      </div>
                      <div>
                        Från tidigare antal: {article.qty} st till: {values.qty}{" "}
                        st
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        Du vill minska antalet med:{" "}
                        {Math.abs(values.qty - article.qty)}{" "}
                        {Math.abs(values.qty - article.qty) > 1
                          ? "artiklar"
                          : "artikel"}
                      </div>
                      <div>
                        Från tidigare antal: {article.qty} st till: {values.qty}{" "}
                        st
                      </div>
                      <div>
                        <div className="font-medium mt-3 mb-1 ">
                          Anledning till uttag?
                        </div>
                        <SelectSimple
                          selected={selectedScrapCause}
                          setSelected={setSelectedScrapCause}
                        />
                        {selectedScrapCause.id == "5" ? (
                          <div>
                            <div className="relative mb-1 mt-2">
                              <input
                                id="sellPrice"
                                name="sellPrice"
                                min={0}
                                type="number"
                                autoComplete="sellPrice"
                                value={values.sellPrice}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Pris per enhet?"
                              />
                              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                                  Kr
                                </div>
                              </div>
                            </div>
                            <div className="w-full text-right mb-4">
                              Sålt för totalt:{" "}
                              {Number(values.sellPrice) *
                                Math.abs(values.qty - article.qty)}{" "}
                              kr
                            </div>
                          </div>
                        ) : null}
                        <input
                          id="scrapComment"
                          name="scrapComment"
                          type="text"
                          autoComplete="scrapComment"
                          value={values.scrapComment}
                          onChange={handleChange}
                          className={inputClass}
                          placeholder="Kommentar"
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
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
              <SelectLocation
                placeholder="Välj ny lagerplats"
                setSelectedLocation={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
            <div>
              <label>Fordonsmodeller</label>
              <SelectModels
                setSelectedModel={setSelectedModels}
                selectedModel={selectedModels}
              />
            </div>
          </div>
        </div>
        <label>Inköpspris</label>
        <div className="relative mb-4">
          <input
            id="purchaseValue"
            name="purchaseValue"
            min={0}
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
                min={0}
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
          <Button
            title="Avbryt"
            variant="danger"
            className=" px-3 py-3  font-semibold"
            onClick={() => setEdit(false)}
          />
          <Button
            variant="positive"
            title="  Uppdatera artikel"
            type="submit"
            className=" px-3 py-3 text-sm font-semibold "
          />
        </div>
      </form>
    </aside>
  );
};

export default SidebarEdit;
