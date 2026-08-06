import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { IconPigMoney } from "@tabler/icons-react";
import { inventoryLocationContext } from "../context/InventoryLocationProvider";
import { inventoryLocationApi } from "@/lib/api/inventoryLocations";
import { useRefreshInventoryLocations } from "@/lib/api/useRefreshInventoryLocations";

// Yup schema to validate the form
export const schema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Lagerplatsen måste ha minst två tecken")
    .max(10, "Lagerplatsen får ha max 10 tecken")
    .required(),
  description: Yup.string().max(20, "Beskrivningen får ha max 20 tecken"),
});

export const ErrorMessage = ({ message }: any) => {
  return (
    <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
  );
};

const NewInventoryLocation = () => {
  const [error, setError] = useState<string>("");

  const refreshInventoryLocations = useRefreshInventoryLocations();

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({ name, description }) => {
      try {
        setError("");

        await inventoryLocationApi.create({
          name,
          description,
        });

        await refreshInventoryLocations();

        formik.resetForm();

        alert("Lagerplatsen är skapad.");
      } catch (error) {
        console.error("Create inventory location error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Lagerplatsen kunde inte skapas.",
        );
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col sm:flex-row items-center gap-3"
    >
      <div className="flex flex-col sm:flex-row sm:gap-2 w-full">
        <div className="gap-3 py-2 whitespace-nowrap min-w-[150px] sm:max-w-[200px] flex flex-col items-center">
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={handleChange}
            type="text"
            className={
              "focus:ring-light-300 ring-1 ring-inset ring-gray-300 bg-transparent relative block h-11 w-full rounded-md border-0 py-3 text-gray-900 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset sm:leading-6 md:h-auto"
            }
            placeholder="Fyll i namn..."
          />
          {errors.name && touched.name ? (
            <div className="text-red-600 pl-3 ml-[52px] -mt-3 text-xs">
              {errors.name}
            </div>
          ) : null}
        </div>
        <div className="gap-3 whitespace-nowrap flex flex-col py-2 items-center w-full">
          <input
            id="description"
            name="description"
            value={values.description}
            onChange={handleChange}
            type="text"
            autoComplete="Beskrivning"
            className="focus:ring-light-300  ring-1 ring-inset ring-gray-300  bg-transparent relative block h-11 w-full rounded-md border-0 py-3 text-gray-600 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset sm:leading-6 md:h-auto"
            placeholder="Fyll i beskrivning.."
          />
          {errors.description && touched.description ? (
            <div className="text-red-600 pl-3 ml-[52px] -mt-3 text-xs">
              {errors.description}
            </div>
          ) : null}
        </div>
      </div>
      <div className="gap-3 whitespace-nowrap  w-full sm:w-auto">
        <div className=" flex justify-end w-full sm:pr-3">
          <>
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="border gap-2 border-gray-300 flex justify-center rounded-md p-3 hover:bg-[#264133] hover:text-white bg-[#264133] sm:bg-white text-white sm:text-[#264133] w-full sm:w-auto"
            >
              {formik.isSubmitting
                ? "Skapar lagerplats..."
                : "Skapa lagerplats"}
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

export default NewInventoryLocation;
