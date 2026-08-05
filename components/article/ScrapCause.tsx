import { Dispatch, SetStateAction, useContext, useState } from "react";
import SelectSimple from "../ui/SelectSimple";
import * as Yup from "yup";
import { ErrorMessage, useFormik } from "formik";
import {
  PopulatedArticleDocument,
  articleContext,
} from "../context/ArticleProvider";
import { getTodayDate } from "@/lib/setDate";
import clsx from "clsx";
import Button from "../ui/Button";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { Types } from "mongoose";
import SearchBarKombo from "../ui/SearchBarKombo";
import { scrapCauses } from "@/lib/config";
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
  const [selectedScrapCause, setSelectedScrapCause] =
    useState<string>("repair");

  const resetQty = () => {
    setUpdatedArticle((previousArticle) => ({
      ...previousArticle,
      qty: oldQty,
    }));

    setClose(true);
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

          const virtualLocationId =
            "64a95847dec1488ee60d10cd" as unknown as Types.ObjectId;

          if (
            newQty > 0 &&
            selectedLocation?._id.toString() === virtualLocationId.toString()
          ) {
            setError(
              "Lagerplats '00' är endast till för artiklar med lagersaldo 0. Välj en annan lagerplats.",
            );
            return;
          }

          const updatedArticle = {
            ...article,
            qty: newQty,
            price:
              sellPrice !== undefined && sellPrice !== article.price
                ? sellPrice
                : article.price,
            lastUpdated: getTodayDate(),
            inventoryLocation:
              newQty === 0
                ? ("64a95847dec1488ee60d10cd" as unknown as Types.ObjectId)
                : selectedLocation?._id,
          };

          const request2 = {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedArticle),
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
          const scrapCause = scrapCauses.find(
            (cause) => cause.value === selectedScrapCause,
          );
          // Create Transaction history
          const createTransactionHistory = {
            direction: newQty < oldQty ? "-" : "+",
            cause: newQty < oldQty ? scrapCause?.label : "",
            pricePerUnit:
              selectedScrapCause == "sold" &&
              sellPrice !== undefined &&
              Number(sellPrice),
            qty: Math.abs(newQty - oldQty),
            article: updatedArticle,
            comment: scrapComment,
            createdDate: getTodayDate(),
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
            setError(
              "Artikelns antal uppdaterades, men transaktionshistoriken kunde inte sparas.",
            );
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
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-3 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset text-base sm:leading-6 md:h-auto";
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
        <div className="font-semibold text-lg mb-2">
          Överblick ändring av antal
        </div>
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
              <SearchBarKombo
                property="inventoryLocation"
                placeholder="Välj ny lagerplats"
                selectedObject={selectedLocation}
                setSelectedObject={setSelectedLocation}
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
              <div className="font-semibold text-base mt-6 mb-1 ">
                Anledning till uttag?
              </div>
              <SelectSimple
                value={selectedScrapCause}
                onChange={setSelectedScrapCause}
                options={scrapCauses}
              />
              {selectedScrapCause == "sold" ? (
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
                      <div className="inline-flex items-center z-10 rounded border border-gray-200 px-1 font-sans text-sm text-gray-600">
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
                className={clsx(`mt-2`, inputClass)}
                placeholder="Kommentar..."
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
