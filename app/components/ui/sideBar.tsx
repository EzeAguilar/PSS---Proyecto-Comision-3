'use client';
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { PATH_OPTIONS } from "@/app/lib/utils";
import { useState } from "react";

const Sidebar = () => {
  const router = useRouter();
  const [activePath, setActivePath] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    setActivePath(path);
    router.push(path);
  };

  const getButtonClassName = (path: string) => {
    return activePath === path
      ? "relative text-black font-semibold text-[1.7em] hover:no-underline pb-2 before:block before:absolute before:-bottom-1 before:left-[15%] before:h-[3px] before:w-[75%] before:bg-black"
      : "text-black hover:no-underline text-[1.7rem]";
  };

  return (
    <aside className="bg-gray-100 w-full sm:w-64 sm:h-screen p-4 fixed sm:border sm:border-solid sm:border-black sm:flex sm:flex-col sm:justify-start sm:p-8 sm:left-0 bottom-0 md:bottom-auto flex justify-around">
      <nav>
        <ul className="flex justify-around sm:flex-col sm:items-start sm:space-y-4">
          <li>
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.patients)}
              onClick={() => handleNavigation(PATH_OPTIONS.patients)}
            >
              Pacientes
            </Button>
          </li>
          <li>
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.doctors)}
              onClick={() => handleNavigation(PATH_OPTIONS.doctors)}
            >
              Médicos
            </Button>
          </li>
          <li>
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.calendar)}
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
