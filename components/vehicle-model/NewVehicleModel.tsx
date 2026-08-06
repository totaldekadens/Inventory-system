import * as Yup from "yup";
import { useFormik } from "formik";
import { IconPigMoney } from "@tabler/icons-react";
import { vehicleApi } from "@/lib/api/vehicles";
import { useRefreshVehicles } from "@/lib/useRefreshVehicles";
import { useState } from "react";

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

  const refreshVehicles = useRefreshVehicles();

  const formik = useFormik({
    initialValues: {
      name: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({ name }) => {
      try {
        setError("");

        await vehicleApi.create({
          name,
        });

        await refreshVehicles();

        formik.resetForm();

        alert("Modellen är skapad.");
      } catch (error) {
        console.error("Create vehicle error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Modellen kunde inte skapas.",
        );
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
              "focus:ring-light-300  ring-1 ring-inset ring-gray-300 bg-transparent relative block w-full rounded-md border-0 py-3 text-gray-900 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset sm:leading-6 h-auto"
            }
            placeholder="Fyll i namn"
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
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="border gap-2 border-gray-300 flex justify-center rounded-md p-3 hover:bg-[#264133] hover:text-white bg-[#264133] sm:bg-white text-white sm:text-[#264133]"
            >
              {formik.isSubmitting ? "Skapar modell..." : "Skapa modell"}
              <IconPigMoney
                height={24}
                width={24}
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
