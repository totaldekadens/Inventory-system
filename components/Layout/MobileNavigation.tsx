import { Dispatch, Fragment, SetStateAction } from "react";
import { Popover, Transition } from "@headlessui/react";
import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

interface PropsMobileNavItemLink
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  href?: string;
}

interface PropsMobileNavItemButton
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function MobileNavItem({
  href,
  children,
  ...props
}: PropsMobileNavItemLink & PropsMobileNavItemButton) {
  return (
    <>
      {href ? (
        <li className="flex justify-center w-full">
          <Popover.Button
            as={Link}
            href={href}
            {...props}
            className="block w-full py-5 text-center "
          >
            {children}
          </Popover.Button>
        </li>
      ) : (
        <li>
          <Popover.Button {...props} className="block w-full py-5 ">
            {children}
          </Popover.Button>
        </li>
      )}
    </>
  );
}

interface Props {
  setCreateArticle: Dispatch<SetStateAction<boolean>>;
  setHandleLocations: Dispatch<SetStateAction<boolean>>;
  setHandleVehicleModels: Dispatch<SetStateAction<boolean>>;
}

function MobileNavigation({
  setCreateArticle,
  setHandleLocations,
  setHandleVehicleModels,
}: Props) {
  return (
    <Popover>
      <Popover.Button
        aria-label="Go to mobile menu"
        className="group flex items-center rounded-full px-2 py-2 text-sm font-medium text-zinc-800   backdrop-blur"
      >
        <div className="space-y-2">
          <span className="bg-gray-800 block h-0.5 w-8 animate-pulse"></span>
          <span className="bg-gray-800 block h-0.5 w-4 animate-pulse"></span>
          <span className="bg-gray-800 block h-0.5 w-2 animate-pulse"></span>
        </div>
      </Popover.Button>
      <Transition.Root>
        <Transition.Child
          enter="duration-150 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-150 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Popover.Overlay className="fixed inset-0 right-0 z-50 bg-zinc-800/40 backdrop-blur-sm " />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="transform transition ease-in-out duration-500 sm:duration-700"
          enterFrom="translate-x-full"
          enterTo="translate-x-0"
          leave="transform transition ease-in-out duration-500 sm:duration-700"
          leaveFrom="translate-x-0"
          leaveTo="translate-x-full"
        >
          <Popover.Panel
            focus
            className="bg-white fixed inset-x-4 bottom-0 left-[80px] sm:left-[350px] md:left-[400px]  right-0 top-0  z-50 origin-top px-8 py-5 "
          >
            <div className="flex flex-row-reverse items-center justify-between">
              <Popover.Button aria-label="Close menu" className="-m-1 p-1">
                <IconX className="text-light-300 h-10 w-10" />
              </Popover.Button>
              <div className=" flex  md:hidden "></div>
            </div>

            <nav className="relative  mt-10 flex h-full w-full justify-center ">
              <div className="w-[400px]">
                <ul className="text-light-300  -my-2  flex w-full flex-col divide-y text-2xl md:text-3xl ">
                  <MobileNavItem
                    onClick={() => {
                      setCreateArticle(true);
                    }}
                  >
                    Lägg till artikel
                  </MobileNavItem>
                  <MobileNavItem
                    onClick={() => {
                      setHandleLocations(true);
                    }}
                  >
                    Hantera lagerplatser
                  </MobileNavItem>
                  <MobileNavItem
                    onClick={() => {
                      setHandleVehicleModels(true);
                    }}
                  >
                    Hantera modeller
                  </MobileNavItem>
                  <MobileNavItem href="/history">
                    Transaktionshistorik
                  </MobileNavItem>
                </ul>
              </div>
              <div className="fixed bottom-0 right-0 left-0 h-[200px] flex  items-center justify-center">
                <Popover.Button>
                  <div
                    className="text-red-500 text-2xl md:text-3xl cursor-pointer"
                    onClick={() => signOut()}
                  >
                    Logga ut
                  </div>
                </Popover.Button>
              </div>
            </nav>
          </Popover.Panel>
        </Transition.Child>
      </Transition.Root>
    </Popover>
  );
}

export default MobileNavigation;
