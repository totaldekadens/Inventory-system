import { Dispatch, SetStateAction, useContext, useState } from "react";
import SelectSimple from "./searchbars/SelectSimple";
import * as Yup from "yup";
import { ErrorMessage, useFormik } from "formik";
import {
  PopulatedArticleDocument,
  articleContext,
} from "./context/ArticleProvider";
import { todayDate } from "@/lib/setDate";
import clsx from "clsx";
import Button from "./buttons/Button";
import { IconArrowBearLeft } from "@tabler/icons-react";
import SelectLocation from "./searchbars/SelectLocation";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { Types } from "mongoose";
interface Props {
  newQty: number;
  oldQty: number;
  article: PopulatedArticleDocument;
  setUpdatedArticle: Dispatch<SetStateAction<PopulatedArticleDocument>>;
  setClose: Dispatch<SetStateAction<boolean>>;
}

const schema = Yup.object().shape({
  sellPrice: Yup.number(),
  scrapComment: Yup.string(),
});

const ScrapCause = ({
  newQty,
  oldQty,
  article,
  setUpdatedArticle,
  setClose,
}: Props) => {
  const [selectedLocation, setSelectedLocation] =
    useState<InventoryLocationDocument | null>(article.inventoryLocation);
  const [error, setError] = useState<string>("");
  const { setCurrentArticles } = useContext(articleContext);
  const [selectedScrapCause, setSelectedScrapCause] = useState<{
    id: string;
    label: string;
  }>({ id: "1", label: "Använd vid reparation" });

  const resetQty = () => {
    article.qty = oldQty;
    setUpdatedArticle(article);
  };

  const formik = useFormik({
    initialValues: {
      sellPrice: article.price,
      scrapComment: "",
    },

    enableReinitialize: true,

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({ sellPrice, scrapComment }) => {
      try {
        if (newQty != oldQty) {
          if (oldQty == 0 && !selectedLocation) {
            alert("Välj en lagerplats"); // Check why setError doesnt work
            return;
          }

          if (
            newQty > 0 &&
            selectedLocation?._id ==
              ("64a95847dec1488ee60d10cd" as unknown as Types.ObjectId)
          ) {
            alert(
              "Lagerplats '00' är endast till för artiklar med lagersaldo '0'. Välj ny lagerplats " // Check why setError doesnt work
            );
            return;
          }

          const updated: any = { ...article };

          if (oldQty == 0) {
            updated.inventoryLocation = selectedLocation?._id;
          } else if (newQty == 0) {
            updated.inventoryLocation =
              "64a95847dec1488ee60d10cd" as unknown as Types.ObjectId;
          } else {
            updated.inventoryLocation = updated.inventoryLocation._id;
          }

          if (newQty < oldQty) {
            if (selectedScrapCause.id == "5" && !sellPrice) {
              setError("Fyll i pris per enhet du sålde artiklarna för");
              return;
            }
          }

          // Updates the article
          const updateArticle = { ...updated, lastUpdated: todayDate };

          const request2 = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updateArticle),
          };

          const response2 = await fetch("/api/article", request2);
          const result2 = await response2.json();

          if (result2.success) {
            alert("Artikeln är uppdaterad!"); // Fix a proper pop up later. Ask if you want to continue or close window

            setClose(true);
            // Updates article list
            const response = await fetch("/api/article/");
            const result = await response.json();
            if (result.success) {
              setCurrentArticles(result.data);
              setUpdatedArticle(article);
            }
          } else {
            setError("Något gick fel!");
          }

          // Create Transaction history
          const createTransactionHistory = {
            direction: newQty < oldQty ? "-" : "+",
            cause: newQty < oldQty ? selectedScrapCause.label : "",
            pricePerUnit: Number(sellPrice),
            qty: oldQty > newQty ? Math.abs(newQty - oldQty) : newQty - oldQty,
            article: article,
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
        } else {
          setClose(true);
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  const inputClass =
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-1.5 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto";
  return (
    <>
      <img
        src="/arrow.png"
        alt="picture of an arrow pointing at quantity"
        className="absolute -top-12 left-20 text-gray-400 opacity-50 w-6 h-6 arrow hidden md:block"
      />
      <img
        src="/arrow2.png"
        alt="picture of an arrow pointing at quantity"
        className="absolute top-3 left-24 text-gray-400 opacity-50 w-6 h-6 arrow md:hidden"
      />
      <form
        onSubmit={handleSubmit}
        className="text-sm rounded-md p-4  border absolute top-11 md:-top-20 left-0 md:left-28 bg-white z-50 shadow-lg"
      >
        <div className="font-medium mb-2">Överblick ändring av antal</div>
        {newQty > oldQty && oldQty != 0 ? (
          <div>
            <div>
              Du vill öka antalet med: {newQty - oldQty}{" "}
              {newQty - oldQty > 1 ? "artiklar" : "artikel"}
            </div>
            <div>
              Från tidigare antal: {oldQty} st till: {newQty} st
            </div>
          </div>
        ) : oldQty == 0 && newQty > oldQty ? (
          <div>
            <div>
              Du vill öka antalet med: {newQty - oldQty}{" "}
              {newQty - oldQty > 1 ? "artiklar" : "artikel"}
            </div>
            <div className="mb-4">
              Från tidigare antal: {oldQty} st till: {newQty} st
            </div>
            <div>
              <label className="mb-2">Välj ny lagerplats</label>
              <SelectLocation
                placeholder="Välj ny lagerplats"
                setSelectedLocation={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
            </div>
            {error ? <ErrorMessage message={error} /> : null}
          </div>
        ) : (
          <div>
            <div>
              Du vill minska antalet med: {Math.abs(newQty - oldQty)}{" "}
              {Math.abs(newQty - oldQty) > 1 ? "artiklar" : "artikel"}
            </div>
            <div>
              Från tidigare antal: {oldQty} st till: {newQty} st
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
                      className={clsx(`pr-20`, inputClass)}
                      placeholder={"Såld för?"}
                    />
                    <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                      <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-sm text-gray-600">
                        Kr / enhet
                      </div>
                    </div>
                  </div>
                  <div className="w-full text-right mb-4">
                    Sålt för totalt:{" "}
                    {Number(values.sellPrice) * Math.abs(newQty - oldQty)} kr
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
        {error ? <ErrorMessage message={error} /> : null}
        <div className="mt-5 w-full flex flex-col sm:flex-row gap-2 justify-end">
          <Button
            title="Avbryt"
            variant="danger"
            className=" px-3 py-3  font-semibold"
            onClick={() => {
              resetQty();
            }}
          />
          <Button
            variant="positive"
            title="  Uppdatera antal"
            type="submit"
            className=" px-3 py-3 text-sm font-semibold "
          />
        </div>
      </form>
    </>
  );
};

export default ScrapCause;
