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
interface Props {
  newQty: number;
  oldQty: number;
  article: PopulatedArticleDocument;
  setUpdatedArticle: Dispatch<SetStateAction<PopulatedArticleDocument>>;
}

const schema = Yup.object().shape({
  sellPrice: Yup.number(),
  scrapComment: Yup.string(),
});

const ScrapCause = ({ newQty, oldQty, article, setUpdatedArticle }: Props) => {
  const [error, setError] = useState<string>("");
  const { setCurrentArticles } = useContext(articleContext);
  const [selectedScrapCause, setSelectedScrapCause] = useState<{
    id: string;
    label: string;
  }>({ id: "1", label: "Använd vid reparation" });

  const resetQty = () => {
    article.qty = oldQty;

    console.log(article);
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
        console.log("Submittad!");

        const updated: any = { ...article };
        updated.inventoryLocation = updated.inventoryLocation._id;
        if (newQty != oldQty) {
          if (newQty < oldQty) {
            if (selectedScrapCause.id == "5" && !sellPrice) {
              setError("Fyll i pris per enhet du sålde artiklarna för");
              return;
            }
          }

          console.log(updated);
          const createTransactionHistory = {
            direction: newQty < oldQty ? "-" : "+",
            cause: newQty < oldQty ? selectedScrapCause.label : "",
            pricePerUnit: Number(sellPrice),
            qty: oldQty > newQty ? Math.abs(newQty - oldQty) : newQty - oldQty,
            article: updated,
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

          /*   const response = await fetch("/api/transactionhistory", request);
          const result = await response.json();
          if (!result.success) {
            setError("Problem vid transaktion. Ingen är uppdaterat");
            return;
          } */
        }

        const updateArticle = { ...updated, lastUpdated: todayDate };

        console.log(updateArticle);
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

  const inputClass =
    "bg-dark-50/20 focus:ring-light-300 relative block h-11 w-full rounded-md border-0 py-1.5 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto";
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="text-xs rounded-md p-2  m-3 border"
      >
        <div className="font-medium mb-2">Överblick ändring av antal</div>
        {newQty > oldQty ? (
          <div>
            <div>
              Du vill öka antalet med: {newQty - oldQty}{" "}
              {newQty - oldQty > 1 ? "artiklar" : "artikel"}
            </div>
            <div>
              Från tidigare antal: {oldQty} st till: {newQty} st
            </div>
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
                      <div className="inline-flex items-center rounded border border-gray-200 px-1 font-sans text-xs text-gray-600">
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
