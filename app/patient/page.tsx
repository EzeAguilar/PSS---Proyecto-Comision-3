'use client'

import { Button } from "@/app/components/ui/button";
import {PATH_OPTIONS, Patient} from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {deletePatient, fetchAllPatients} from "@/app/lib/data";
import { FaEdit, FaTrash } from 'react-icons/fa'; // Asegúrate de tener react-icons instalado

const PatientsPage = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);

  //TODO Hacer fetch a las citas pertenecientes al paciente logeado
  useEffect(() => {
    const loadPatients = async () => {
      const allPatients = await fetchAllPatients();
      console.log("Datos de todos los pacientes:", allPatients); // Imprime todos los datos de los doctores
      setFilteredPatients(allPatients.filter(patient => patient));
      console.log(allPatients[0].apellido);
    };
    loadPatients();
  }, []);

  return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl mr-44">Citas Programadas</h1> {/* Espacio a la derecha */}
        </div>
      </div>
  );
};

export default PatientsPage;
