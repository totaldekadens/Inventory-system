import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import { IconPigMoney, IconRefresh, IconX } from "@tabler/icons-react";
import { inventoryLocationContext } from "../context/InventoryLocationProvider";
import { articleContext } from "../context/ArticleProvider";
import HoverInfo from "../HoverInfo";
import { VehicleDocument } from "@/models/VehicleModel";
import { vehicleContext } from "../context/VehicleProvider";

// Yup schema to validate the form
export const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Modellen måste ha minst två tecken")
    .max(25, "Modellen får ha max 25 tecken")
    .required(),
});

export const ErrorMessage = ({ message }: any) => {
  return (
    <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
  );
};

interface Props {
  model: VehicleDocument;
}

const HandleVehicleModel = ({ model }: Props) => {
  const [error, setError] = useState<string>("");
  const { articles } = useContext(articleContext);
  const { vehicles, setVehicles } = useContext(vehicleContext);

  const hasArticles = articles.some(
    (article) => article.inventoryLocation._id == model._id
  );

  const formik = useFormik({
    initialValues: {
      name: model.name,
    },

    // Makes it possible to change initial values
    enableReinitialize: true,
    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({ name }) => {
      try {
        const updateVehicleModel = {
          _id: model._id,
          name,
        };

        const request = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateVehicleModel),
        };

        const response = await fetch("/api/vehicle", request);
        const result = await response.json();

        if (result.success) {
          alert("Modellen är uppdaterad"); // Fix a proper pop up later. Ask if you want to continue or close window

          // Updates list
          const response = await fetch("/api/vehicle/");
          const result = await response.json();
          if (result.success) {
            setVehicles(result.data);
            setError("");
          }
        } else {
          setError(result.data);
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex items-center justify-between"
    >
      <div className="flex">
        <div className="gap-3 py-2 whitespace-nowrap w-[200px] flex flex-col max-w-[200px] items-center">
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            type="text"
            autoComplete="Namn"
            className={
              "focus:ring-light-300 bg-transparent relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 placeholder:text-gray-500 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto"
            }
            placeholder={"Namn"}
          />
          {errors.name && touched.name ? (
            <div className="text-red-600 pl-3 ml-[52px] -mt-3 text-xs">
              {errors.name}
            </div>
          ) : null}
        </div>
      </div>
      <div className="gap-3 whitespace-nowrap  ">
        <div className=" flex justify-end pr-3">
          {model.name != values.name ? (
            <>
              <button type="submit">
                <IconPigMoney
                  height={24}
                  width={24}
                  color="green"
                  className="text-xs cursor-pointer"
                />
              </button>

              <IconRefresh
                height={24}
                width={24}
                onClick={() => formik.resetForm()}
                className="text-xs cursor-pointer ml-2 text-slate-400"
              />
            </>
          ) : (
            <>
              {!hasArticles ? (
                <IconX
                  height={24}
                  width={24}
                  className="text-xs cursor-pointer text-red-500"
                  onClick={async () => {
                    const test = confirm("Är du säker?");
                    // Todo: Update this one later
                    if (test) {
                      await fetch(`api/vehicle/${model._id}`, {
                        method: "DELETE",
                      });

                      const response = await fetch("/api/vehicle/");
                      const result = await response.json();
                      if (result.success) {
                        setVehicles(result.data);
                      }
                    }
                  }}
                />
              ) : (
                <HoverInfo />
              )}
            </>
          )}
        </div>
        {error ? <ErrorMessage message={error} /> : null}
      </div>
    </form>
  );
};

export default HandleVehicleModel;
