import Head from "next/head";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "@/components/buttons/Button";
import Image from "next/image";
// Yup schema to validate the form
const schema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

const ErrorMessage = ({ message }: any) => {
  return (
    <span className="text-xs text-red-600 dark:text-red-500">{message}</span>
  );
};

export default function SignIn() {
  const [error, setError] = useState<string>("");
  const session = useSession();

  const router = useRouter();
  // Redirect user to admin panel when logged in
  useEffect(() => {
    if (session.data) {
      router.push("/");
    }
  }, [router, session.data]);

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },

    // Pass the Yup schema to validate the form
    validationSchema: schema,

    // Handle form submission
    onSubmit: async ({ username, password }) => {
      // Make a request to your backend to store the data
      const res = await signIn("credentials", {
        inputValue: username,
        password: password,
        redirect: false,
        callbackUrl: "/",
      });
      console.log(res);
      if (res?.error) {
        setError("Username or password not valid");
      }
    },
  });

  // Destructure the formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  return (
    <>
      <Head>
        <title>Logga in</title>
      </Head>
      <div className="flex min-h-full flex-1 items-center  justify-center px-4  sm:px-6 lg:px-8">
        {" "}
        <div className="w-full max-w-sm space-y-10 h-screen flex flex-col justify-center">
          {session.data ? null : (
            <>
              <div className="flex w-full justify-center ">
                <Image
                  src={"/logo_black.png"}
                  width={300}
                  height={100}
                  alt="Bild på logga"
                  className="contain"
                />
              </div>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative -space-y-px rounded-md ">
                  <div className="pointer-events-none absolute inset-0 z-10 rounded-md  ring-0 ring-inset " />
                  <div>
                    <label htmlFor="username" className="sr-only">
                      Användarnamn
                    </label>
                    <input
                      id="username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      type="text"
                      autoComplete="username"
                      required
                      className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative mb-2 block h-11 w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
                      placeholder="Användarnamn"
                    />
                  </div>
                  <div>
                    <label htmlFor="password" className="sr-only">
                      Lösenord
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={values.password}
                      onChange={handleChange}
                      required
                      className="bg-dark-50/20 focus:ring-light-300 dark:text-light-50 relative block h-11 w-full rounded-md border-0 py-1.5  text-gray-900 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:z-10  focus:ring-2 focus:ring-inset dark:placeholder:text-gray-600 sm:text-sm sm:leading-6 md:h-auto"
                      placeholder="Lösenord"
                    />
                    {error ? <ErrorMessage message={error} /> : null}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="text-light-300 focus:ring-light-300 h-4 w-4 rounded border-gray-300"
                    />
                    <label
                      htmlFor="remember-me"
                      className="text-dark-200 dark:text-light-100 ml-3 block text-sm leading-6"
                    >
                      Kom ihåg mig
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="text-dark-50 font-semibold hover:text-indigo-500"
                    >
                      Glömt ditt lösenord?
                    </a>
                  </div>
                </div>

                <div>
                  <Button
                    variant="positive"
                    title="Logga in"
                    className="flex w-full justify-center"
                    type="submit"
                  />
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
