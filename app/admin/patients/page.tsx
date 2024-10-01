'use client'

import { Button } from "@/app/components/ui/button";
import { PATH_OPTIONS } from "@/app/lib/utils";
import { useRouter } from "next/navigation";


const PatientsPage = () => {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  }

  return (
    <div>
      <div className="flex items-center gap-10">
        <h1>Pacientes</h1>
        <Button
          size="lg"
          variant="default"
          className="bg-red-500"
          onClick={() => handleNavigation(PATH_OPTIONS.newPatient)}
        >
          Agregar
        </Button>
      </div>
    </div>
  );
};

export default PatientsPage;