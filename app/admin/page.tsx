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

  useEffect(() => {
    const loadPatients = async () => {
      const allPatients = await fetchAllPatients();
      console.log("Datos de todos los pacientes:", allPatients); // Imprime todos los datos de los doctores
      setFilteredPatients(allPatients);
      console.log(allPatients[0].apellido);
    };
    loadPatients();
  }, []);

  const editPatient = (patient: Patient) => {
    const patientId = patient.id_paciente ?? 0; // Usa 0 u otro valor predeterminado si id es undefined
    handleNavigation(`${PATH_OPTIONS.editPatient}/${patientId}`);
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl mr-44">Pacientes</h1> {/* Espacio a la derecha */}

          <div className="flex items-center w-1/2 mr-36">
            <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Buscar pacientes..."
                className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:border-blue-500"
            />
            <button
                onClick={clearSearch}
                className="rounded-r-lg px-4 h-12 flex items-center"
            >
              X
            </button>
          </div>

          <Button
              size="lg"
              variant="default"
              className="bg-red-500 text-white text-[1.3rem] px-10 h-12 flex items-center rounded-lg" // Botón más ovalado
              onClick={() => handleNavigation(PATH_OPTIONS.newPatient)}
          >
            Agregar
          </Button>
        </div>

        {/* Aquí va tu tabla */}
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">DNI</th>
              <th className="px-4 py-2 border">Domicilio</th>
              <th className="px-4 py-2 border">Teléfono</th>
              {/* Eliminamos la columna de acciones */}
            </tr>
            </thead>
            <tbody>
            {filteredPatients.map((patient) => (
                <tr key={patient.id_paciente}>
                  <td className="px-4 py-2 border">{patient.nombre}</td>
                  <td className="px-4 py-2 border">{patient.apellido}</td>
                  <td className="px-4 py-2 border">{patient.dni}</td>
                  <td className="px-4 py-2 border">{patient.domicilio}</td>
                  <td className="px-4 py-2 border">{patient.telefono}</td>
                  <td className="px-4 py-2 flex space-x-4">
                    {/* Iconos de editar y eliminar al final de la fila */}
                    <FaEdit
                        className="text-black cursor-pointer"
                        onClick={() => editPatient(patient)}
                    />
                    <FaTrash
                        className="text-black cursor-pointer"
                        onClick={() => deletePatient(patient.id_paciente)}
                    />
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
  );
};

export default PatientsPage;
