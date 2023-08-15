import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { InventoryLocationDocument } from "@/models/InventoryLocationModel";
import {
  IconExclamationCircle,
  IconPigMoney,
  IconRefresh,
  IconX,
} from "@tabler/icons-react";
import { inventoryLocationContext } from "../../context/InventoryLocationProvider";
import { articleContext } from "../../context/ArticleProvider";
import HoverInfo from "../../HoverInfo";
import { vehicleContext } from "../../context/VehicleProvider";

// Yup schema to validate the form
export const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Modellen måste ha minst två tecken")
    .max(25, "Modellen får ha max 25 tecken")
    .required(),
  description: Yup.string().max(20, "Beskrivningen får ha max 20 tecken"),
});

export const ErrorMessage = ({ message }: any) => {
  return (
    <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
  );
};

const NewVehicleModel = () => {
  const [error, setError] = useState<string>("");
  const { articles } = useContext(articleContext);
  const { vehicles, setVehicles } = useContext(vehicleContext);

  const formik = useFormik({
    initialValues: {
      name: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({ name }) => {
      try {
        const newVehicleModel = {
          name,
        };
        const request = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newVehicleModel),
        };

        const response = await fetch("/api/vehicle", request);
        const result = await response.json();

        if (result.success) {
          alert("Modellen är skapad"); // Fix a proper pop up later. Ask if you want to continue or close window

          // Updates list
          const response = await fetch("/api/vehicle/");
          const result = await response.json();
          if (result.success) {
            setVehicles(result.data);
            formik.resetForm();
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

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center gap-3">
      <div className="flex gap-2">
        <div className="gap-3 py-2 whitespace-nowrap w-[200px] flex flex-col max-w-[200px] items-center">
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            type="text"
            autoComplete="Namn"
            className={
              "focus:ring-light-300  ring-1 ring-inset ring-gray-300 bg-transparent relative block h-11 w-full rounded-md border-0 py-1.5   text-gray-900 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 md:h-auto"
            }
            placeholder="Namn"
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
          <>
            <button type="submit">
              <IconPigMoney
                height={24}
                width={24}
                color="green"
                className="text-xs cursor-pointer"
              />
            </button>
          </>
        </div>
        {error ? <ErrorMessage message={error} /> : null}
      </div>
    </form>
  );
};

export default NewVehicleModel;
