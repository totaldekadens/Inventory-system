import {
  PopulatedArticleDocument,
  articleContext,
} from "../../context/ArticleProvider";
import ForSaleRadioButton from "@/components/buttons/ForSaleRadioButton";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useFormik } from "formik";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import UploadToImagesToServer from "@/lib/useUploadImagesToServer";
import UploadForm from "@/components/uploadForm";
import Button from "@/components/buttons/Button";
import SelectModels from "@/components/searchbars/SelectModels";
import { ErrorMessage, schema } from "@/components/NewArticle";
import SelectSimple from "@/components/searchbars/SelectSimple";
import { todayDate } from "@/lib/setDate";
import clsx from "clsx";
import RadioButtonsQuantity, {
  UpdateMode,
} from "@/components/buttons/RadioButtonsQuantity";
import { Types } from "mongoose";
import SearchBarKombo from "@/components/searchbars/SearchBarKombo";
import { scrapCauses } from "@/lib/config";

interface Props {
  article: PopulatedArticleDocument;
  setEdit: Dispatch<SetStateAction<boolean>>;
}

const SidebarEdit = ({ article, setEdit }: Props) => {
  const [id, setId] = useState<UpdateMode>("set");
  const [forSale, setForSale] = useState(article.forSale);
  const [selectedScrapCause, setSelectedScrapCause] =
    useState<string>("repair");
  const { setCurrentArticles } = useContext(articleContext);

  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(article.inventoryLocation);

  const initialSelectedModels = article.vehicleModels.map((model, i) =>
    model._id ? model._id.toString() : `${i}`,
  );

  const [selectedModels, setSelectedModels] = useState<string[]>(
    initialSelectedModels,
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
        const enteredQty = Math.abs(Number(qty) || 0);

        const newQty =
          id === "set"
            ? enteredQty
            : id === "add"
              ? article.qty + enteredQty
              : article.qty - enteredQty;

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

        if (
          newQty > 0 &&
          selectedLocation._id ==
            ("64a95847dec1488ee60d10cd" as unknown as Types.ObjectId)
        ) {
          setError(
            "Lagerplats '00' är endast till för artiklar med lagersaldo '0'. Välj ny lagerplats ",
          );
          return;
        }
        if (newQty != article.qty) {
          if (newQty < article.qty) {
            if (selectedScrapCause == "sold" && !sellPrice) {
              setError("Fyll i pris per enhet du sålde artiklarna för");
              return;
            }
          }

          const scrapCause = scrapCauses.find(
            (cause) => cause.value === selectedScrapCause,
          );

          const createTransactionHistory = {
            direction: newQty < article.qty ? "-" : "+",
            cause: newQty < article.qty ? scrapCause?.label : "",
            pricePerUnit: Number(selectedScrapCause == "sold" && sellPrice),
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
          inventoryLocation:
            newQty == 0 ? "64a95847dec1488ee60d10cd" : selectedLocation?._id,
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
          setId("set");

          // If new quantity = 0 the article will be moved to a virtual location
          newQty == 0
            ? setSelectedLocation({
                description: "Virtuell plats",
                name: "00",
                _id: "64a95847dec1488ee60d10cd" as unknown as Types.ObjectId,
              })
            : null;

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
  const { errors, touched, values, handleChange, handleSubmit, setFieldValue } =
    formik;

  // Sets negative numbers to positive
  const enteredQty = Math.abs(Number(values.qty) || 0);

  const resultingQty =
    id === "set"
      ? enteredQty
      : id === "add"
        ? article.qty + enteredQty
        : article.qty - enteredQty;

  const quantityChange = resultingQty - article.qty;

  const isIncrease = quantityChange > 0;
  const isDecrease = quantityChange < 0;
  const hasQuantityChanged = quantityChange !== 0;
  const hasInvalidQuantity = resultingQty < 0;

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
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-3 mt-2 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset text-base sm:leading-6 md:h-auto";

  useEffect(() => {
    setFieldValue("qty", id === "set" ? article.qty : 1);
    setError("");
  }, [id, article.qty, setFieldValue]);

  useEffect(() => {
    setFieldValue("qty", id === "set" ? article.qty : 1);

    setSelectedScrapCause("repair");
    setFieldValue("scrapComment", "");
    setFieldValue("sellPrice", article.price);

    setError("");
  }, [id]);
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
              <label className="font-bold">Titel</label>
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
              <label className="font-bold">Lev.art. no</label>
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
              <label className="font-bold">Skick</label>
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
              <label className="font-bold">Antal</label>

              <p className="mt-3 w-full text-right">
                Tillgängligt antal: {article.qty} st
              </p>

              <RadioButtonsQuantity id={id} setId={setId} />

              <div className="relative">
                <input
                  id="qty"
                  name="qty"
                  type="number"
                  min={0}
                  autoComplete="off"
                  value={values.qty}
                  onChange={(event) => {
                    const value = Math.abs(Number(event.target.value));

                    setFieldValue("qty", Number.isNaN(value) ? 0 : value);

                    setError("");
                  }}
                  required
                  className={clsx("pr-8", inputClass)}
                  placeholder={
                    id === "set"
                      ? "Ange nytt antal"
                      : id === "add"
                        ? "Antal att lägga till"
                        : "Antal att ta bort"
                  }
                />

                <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                  <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                    st
                  </div>
                </div>
              </div>

              {hasQuantityChanged && enteredQty > 0 && (
                <div className="m-3 rounded-md border p-3 text-sm">
                  <div className="mb-2 font-medium">
                    Överblick ändring av antal
                  </div>

                  <div>
                    Du vill {isIncrease ? "öka" : "minska"} antalet med{" "}
                    <strong>
                      {Math.abs(quantityChange)}{" "}
                      {Math.abs(quantityChange) === 1 ? "artikel" : "artiklar"}
                    </strong>
                    .
                  </div>

                  <div className="mt-1">
                    Från tidigare antal: <strong>{article.qty} st</strong> till:{" "}
                    <strong>{resultingQty} st</strong>
                  </div>

                  {hasInvalidQuantity && (
                    <ErrorMessage message="Du kan inte ta bort mer än vad som finns tillgängligt" />
                  )}

                  {isDecrease && !hasInvalidQuantity && (
                    <div className="mt-3">
                      <div className="mb-1 font-medium">
                        Anledning till uttag?
                      </div>

                      <SelectSimple
                        value={selectedScrapCause}
                        onChange={setSelectedScrapCause}
                        options={scrapCauses}
                      />

                      {selectedScrapCause === "sold" && (
                        <div>
                          <div className="relative mb-1 mt-2">
                            <input
                              id="sellPrice"
                              name="sellPrice"
                              min={0}
                              type="number"
                              autoComplete="off"
                              value={newSellPrice}
                              onChange={handleChange}
                              className={clsx("pr-20", inputClass)}
                              placeholder="Pris per enhet?"
                            />

                            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                              <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-sm text-gray-600">
                                Kr / enhet
                              </div>
                            </div>
                          </div>

                          <div className="mb-4 w-full text-right">
                            Sålt för totalt:{" "}
                            {Number(values.sellPrice) *
                              Math.abs(quantityChange)}{" "}
                            kr
                          </div>
                        </div>
                      )}

                      <input
                        id="scrapComment"
                        name="scrapComment"
                        type="text"
                        autoComplete="off"
                        value={values.scrapComment}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Kommentar"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="font-bold">Beskrivning</label>
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
              <label className="font-bold">Lagerplats</label>
              <SearchBarKombo
                property="inventoryLocation"
                placeholder="Välj ny lagerplats"
                selectedObject={selectedLocation}
                setSelectedObject={setSelectedLocation}
              />
            </div>
            {/* Models */}
            <div>
              <label className="font-bold">Fordonsmodeller</label>
              <SelectModels
                setSelectedModel={setSelectedModels}
                selectedModel={selectedModels}
              />
            </div>
          </div>
        </div>
        {/* Purchase price */}
        <label className="font-bold">Inköpspris</label>
        <div className="relative mb-4">
          <input
            id="purchaseValue"
            name="purchaseValue"
            min={0}
            type="number"
            autoComplete="purchaseValue"
            value={newPurchaseValue}
            onChange={handleChange}
            className={clsx(`pr-[120px]`, inputClass)}
            placeholder="Inköpspris"
          />
          <div className="z-10 absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
            <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
              kr/st (inkl. moms)
            </div>
          </div>
        </div>

        {/* Comment */}
        <div className="mb-4">
          <label className="font-bold">Övrig kommentar</label>
          <input
            id="comment"
            name="comment"
            type="text"
            autoComplete="comment"
            value={values.comment}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="Fyll i övrig kommentar"
          />
        </div>

        {/* For sale */}
        <ForSaleRadioButton
          article={article}
          forSale={forSale}
          setForSale={setForSale}
        />
        {forSale ? (
          <div className="mt-5">
            <label className="font-bold">Försäljningspris</label>
            <div className="relative">
              <input
                id="price"
                name="price"
                min={0}
                type="number"
                autoComplete="price"
                value={newPrice}
                onChange={handleChange}
                className={clsx(`pr-[120px]`, inputClass)}
                placeholder="Till vilket pris?"
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
                  kr/st (inkl. moms)
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
