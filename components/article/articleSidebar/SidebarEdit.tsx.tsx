import {
  PopulatedArticleDocument,
  articleContext,
} from "../../context/ArticleProvider";
import ForSaleRadioButton from "@/components/buttons/ForSaleRadioButton";
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
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
import clsx from "clsx";
import RadioButtonsQuantity from "@/components/buttons/RadioButtonsQuantity";

interface Props {
  article: PopulatedArticleDocument;
  className?: string;
  edit: boolean;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const SidebarEdit = ({ article, className, edit, setEdit }: Props) => {
  const [id, setId] = useState("1");
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
      sellPrice: article.price,
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
        // Todo: Make this part shorter.

        //console.log(qty);

        let newQty =
          id == "1"
            ? qty
            : id == "2"
            ? article.qty + qty
            : id == "3"
            ? article.qty - qty
            : qty;

        console.log(newQty);
        console.log(article.qty);
        console.log(qty);

        if (newQty < 0) {
          setError("Du kan inte ta bort mer än vad som finns tillgängligt");
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

        if (newQty != article.qty) {
          if (newQty < article.qty) {
            if (selectedScrapCause.id == "5" && !sellPrice) {
              setError("Fyll i pris per enhet du sålde artiklarna för");
              return;
            }
          }

          const createTransactionHistory = {
            direction: newQty < article.qty ? "-" : "+",
            cause: newQty < article.qty ? selectedScrapCause.label : "",
            pricePerUnit: Number(sellPrice),
            qty:
              article.qty > newQty
                ? Math.abs(newQty - article.qty)
                : newQty - article.qty,

            article: {
              _id: article._id,
              artno: article.artno,
              supplierArtno,
              vehicleModels: selectedModels,
              title,
              description,
              qty: newQty,
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
          const result = await response.json();
          if (!result.success) {
            setError("Problem vid transaktion. Ingen är uppdaterat");
            return;
          }
        }

        const updateArticle = {
          _id: article._id,
          artno: article.artno,
          supplierArtno,
          vehicleModels: selectedModels,
          title,
          description,
          qty: newQty,
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

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  // Sets negative numbers to positive
  const newQty = values.qty < 0 ? Math.abs(values.qty) : values.qty;
  const newPrice = values?.price
    ? values?.price < 0
      ? Math.abs(values.price)
      : values.price
    : values.price;
  const newPurchaseValue = values?.purchaseValue
    ? values?.purchaseValue < 0
      ? Math.abs(values.purchaseValue)
      : values.purchaseValue
    : values.purchaseValue;

  const newSellPrice = values?.sellPrice
    ? values?.sellPrice < 0
      ? Math.abs(values.sellPrice)
      : values.sellPrice
    : values.sellPrice;

  const inputClass =
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-1.5 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto";

  return (
    <aside
      className="flex flex-col col-span-1 md:px-6 mx-auto max-w-8xl py-6 w-full h-full"
      style={{ maxWidth: "600px" }}
    >
      <form onSubmit={handleSubmit} className="">
        <div className="flex justify-between w-full mb-4">
          <div className="w-full flex flex-col gap-3">
            {/* Title */}
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
            {/* SupplierNo */}
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
            {/* Condition */}
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

            {/* Quantity */}
            <div>
              <label>Antal</label>
              <p className="mt-3 text-right w-full">
                Tillgängligt antal: {article.qty} st
              </p>
              <RadioButtonsQuantity id={id} setId={setId} />
              <div className="relative">
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  min={0}
                  autoComplete="qty"
                  value={newQty}
                  onChange={handleChange}
                  required
                  className={clsx(`pr-8`, inputClass)}
                  placeholder="Antal*"
                />
                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                    st
                  </div>
                </div>
              </div>

              {/* Special with quantity if it changes */}
              {article.qty != newQty && id == "1" ? (
                <div className="text-sm rounded-md p-2  m-3 border">
                  <div className="font-medium mb-2">
                    Överblick ändring av antal
                  </div>

                  {newQty > article.qty ? (
                    <div>
                      <div>
                        Du vill öka antalet med: {newQty - article.qty}{" "}
                        {newQty - article.qty > 1 ? "artiklar" : "artikel"}
                      </div>
                      <div>
                        Från tidigare antal: {article.qty} st till: {newQty} st
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div>
                        Du vill minska antalet med:{" "}
                        {Math.abs(newQty - article.qty)}{" "}
                        {Math.abs(newQty - article.qty) > 1
                          ? "artiklar"
                          : "artikel"}
                      </div>
                      <div>
                        Från tidigare antal: {article.qty} st till: {newQty} st
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
                                value={newSellPrice}
                                onChange={handleChange}
                                className={clsx(`pr-20`, inputClass)}
                                placeholder="Pris per enhet?"
                              />
                              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-sm text-gray-600">
                                  Kr / enhet
                                </div>
                              </div>
                            </div>
                            <div className="w-full text-right mb-4">
                              Sålt för totalt:{" "}
                              {Number(values.sellPrice) *
                                Math.abs(newQty - article.qty)}{" "}
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
              ) : (
                <>
                  {id == "2" && newQty > 0 ? (
                    /* Här lägger vi till antal */
                    <div className="text-sm rounded-md p-2  m-3 border">
                      <div className="font-medium mb-2">
                        Överblick ändring av antal
                      </div>
                      <div>
                        <div>
                          Du vill öka antalet med: {newQty}{" "}
                          {newQty > 1 ? "artiklar" : "artikel"}
                        </div>
                        <div>
                          Från tidigare antal: {article.qty} st till:{" "}
                          {newQty + article.qty} st
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {id == "3" && newQty > 0 ? (
                        /* Här tar vi bort antal */
                        <div className="text-sm rounded-md p-2  m-3 border">
                          <div className="font-medium mb-2">
                            Överblick ändring av antal
                          </div>
                          <div>
                            <div>
                              Du vill minska antalet med: {newQty}
                              {newQty > 1 ? " artiklar" : " artikel"}
                            </div>
                            <div>
                              Från tidigare antal: {article.qty} st till:{" "}
                              {article.qty - newQty} st
                            </div>
                            {article.qty - newQty < 0 ? (
                              <ErrorMessage
                                message={
                                  "Du kan inte ta ut mer än vad du har tillgängligt"
                                }
                              />
                            ) : null}
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
                                      value={newSellPrice}
                                      onChange={handleChange}
                                      className={clsx(`pr-20`, inputClass)}
                                      placeholder="Pris per enhet?"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                                      <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-sm text-gray-600">
                                        Kr / enhet
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w-full text-right mb-4">
                                    Sålt för totalt:{" "}
                                    {Number(values.sellPrice) *
                                      Math.abs(newQty - article.qty)}{" "}
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
                        </div>
                      ) : null}
                    </>
                  )}
                </>
              )}
            </div>

            {/* Description */}
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
            {/* Inventory location */}
            <div>
              <label>Lagerplats</label>
              <SelectLocation
                placeholder="Välj ny lagerplats"
                setSelectedLocation={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
            {/* Models */}
            <div>
              <label>Fordonsmodeller</label>
              <SelectModels
                setSelectedModel={setSelectedModels}
                selectedModel={selectedModels}
              />
            </div>
          </div>
        </div>
        {/* Purchase price */}
        <label>Inköpspris</label>
        <div className="relative mb-4">
          <input
            id="purchaseValue"
            name="purchaseValue"
            min={0}
            type="number"
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
                value={newPrice}
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

        {/* Upload images */}
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
