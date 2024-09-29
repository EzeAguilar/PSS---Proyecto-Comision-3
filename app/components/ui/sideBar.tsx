'use client'
import { useRouter } from "next/navigation";
import { Button } from "./button";
import { PATH_OPTIONS } from "@/app/lib/utils";


const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    if (path === PATH_OPTIONS.patients) {
      router.push(PATH_OPTIONS.patients);
    }
    else if (path === PATH_OPTIONS.doctors) {
      router.push(PATH_OPTIONS.doctors);
    }
    else if (path === PATH_OPTIONS.calendar) {
      router.push(PATH_OPTIONS.calendar);
    }
  }

  return (
    <aside className="bg-gray-100 h-screen p-4 w-64 fixed border border-solid border-black">
      <nav>
        <ul>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className="text-black font-semibold"
              onClick={() => handleNavigation(PATH_OPTIONS.patients)}
            >
              Pacientes
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className="text-gray-700 hover:text-black"
              onClick={() => handleNavigation(PATH_OPTIONS.doctors)}
            >
              Médicos
            </Button>
          </li>
          <li className="mb-4">
            <Button
              size="lg"
              variant="link"
              className="text-gray-700 hover:text-black"
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
