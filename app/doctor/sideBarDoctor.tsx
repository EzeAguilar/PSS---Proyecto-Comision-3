'use client'
import { useRouter } from "next/navigation";
import { PATH_OPTIONS } from "@/app/lib/utils";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { useParams } from "next/navigation";
const Sidebar = () => {
  const router = useRouter();
  const params = useParams();
  const id = parseInt(params.id as string, 10); 
  const [activePath, setActivePath] = useState<string | null>(null);

  const handleNavigation = (path: string) => {
    setActivePath(path);
    if (path === PATH_OPTIONS.doctorPatients) {
      router.push(`/doctor/${id}`);
    }
    else if (path === PATH_OPTIONS.doctorCalendar) {
      router.push(`/doctor/${id}/calendar`);
    }
  }

  const getButtonClassName = (path: string) => {
    return activePath === path
        ? "relative text-black font-semibold text-xl hover:no-underline pb-2 before:block before:absolute before:-bottom-1 before:left-[15%] before:h-[3px] before:w-[75%] before:bg-black whitespace-nowrap"
        : "text-black hover:no-underline text-xl whitespace-nowrap";
  };

  return (
    <aside className="bg-gray-100 h-screen p-4 w-64 fixed border border-solid border-black">
      <nav>
        <ul className="items-center justify-center mr-8 mt-9">
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.doctorPatients)}
              onClick={() => handleNavigation(PATH_OPTIONS.doctorPatients)}
            >
              Pacientes
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.doctorCalendar)}
              onClick={() => handleNavigation(PATH_OPTIONS.doctorCalendar)}
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