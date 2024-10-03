'use client'
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { PATH_OPTIONS } from "@/app/lib/utils";
import { useState } from "react";

const Sidebar = () => {
  const router = useRouter();

  const [activePath, setActivePath] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    setActivePath(path);
    if (path === PATH_OPTIONS.patients) {
      router.push(`${PATH_OPTIONS.patients}`);
    }
    else if (path === PATH_OPTIONS.doctors) {
      router.push(`${PATH_OPTIONS.doctors}`);
    }
    else if (path === PATH_OPTIONS.calendar) {
      router.push(`${PATH_OPTIONS.calendar}`);
    }
  }

  const getButtonClassName = (path: string) => {
    return activePath === path
        ? "relative text-black font-semibold text-[1.7em] hover:no-underline pb-2 before:block before:absolute before:-bottom-1 before:left-[15%] before:h-[3px] before:w-[75%] before:bg-black"
        : "text-black hover:no-underline text-[1.7rem]";
  };


  return (
    <aside className="bg-gray-100 h-screen p-4 w-64 fixed border border-solid border-black">
      <nav>
        <ul className="items-center justify-center mr-8 mt-9">
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              //className="text-black font-semibold"
              className={getButtonClassName(PATH_OPTIONS.patients)}  // Aplica la clase basada en el estado
              onClick={() => handleNavigation(PATH_OPTIONS.patients)}
            >
              Pacientes
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              //className="text-gray-700 hover:text-black"
              className={getButtonClassName(PATH_OPTIONS.doctors)}  // Aplica la clase basada en el estado
              onClick={() => handleNavigation(PATH_OPTIONS.doctors)}
            >
              Médicos
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              //className="text-gray-700 hover:text-black"
              className={getButtonClassName(PATH_OPTIONS.calendar)}  // Aplica la clase basada en el estado
              onClick={() => handleNavigation(PATH_OPTIONS.calendar)}
            >
              Calendario
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
