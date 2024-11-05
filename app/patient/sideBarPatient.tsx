'use client'
import {useParams, useRouter} from "next/navigation";
import { PATH_OPTIONS } from "@/app/lib/utils";
import { useState } from "react";
import { Button } from "../components/ui/button";
import { IconButton } from "@mui/material";
import { SettingsIcon } from "lucide-react";

const Sidebar = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [activePath, setActivePath] = useState<string | null>(null);

  const handleSettingsClick = () => {
    router.push(`/patient/${id}/configuracion`);
  }
  const handleNavigation = (path: string) => {
    setActivePath(path);
    if (path === PATH_OPTIONS.appointments) {
      router.push(`/patient/${id}`);
    }
    else if (path === PATH_OPTIONS.scheduleAppointment) {
      router.push(`/patient/${id}/new-appointment`);
    }
    else if (path === PATH_OPTIONS.patientDoctors) {
      router.push(`/patient/${id}/doctors`);
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
              className={getButtonClassName(PATH_OPTIONS.appointments)}  // Aplica la clase basada en el estado
              onClick={() => handleNavigation(PATH_OPTIONS.appointments)}
            >
              Citas Programadas
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.scheduleAppointment)}  // Aplica la clase basada en el estado
              onClick={() => handleNavigation(PATH_OPTIONS.scheduleAppointment)}
            >
              Programar Cita
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className={getButtonClassName(PATH_OPTIONS.patientDoctors)}  // Aplica la clase basada en el estado
              onClick={() => handleNavigation(PATH_OPTIONS.patientDoctors)}
            >
              Médicos
            </Button>
          </li>
        </ul>
        <IconButton onClick={handleSettingsClick} className='top-72 left-4'>
                <SettingsIcon />
            </IconButton>     
      </nav>
    </aside>
  );
};

export default Sidebar;
