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
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const [showDisabled, setShowDisabled] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      const allPatients = await fetchAllPatients();
      console.log("Datos de todos los pacientes:", allPatients); // Imprime todos los datos de los doctores
      setFilteredPatients(allPatients.filter(patient => patient.deshabilitado === showDisabled));
      console.log(allPatients[0].apellido);
    };
    loadPatients();
  }, [showDisabled]);

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

  const handleConfirm = (patientId: number | undefined) => {
    setSelectedPatientId(patientId ?? null); // Almacena el doctor a eliminar
    setShowConfirmMessage(true); // Muestra el modal
  };

  const handleDeletePatient = async () => {
    if (selectedPatientId !== null) {
      await deletePatient(selectedPatientId);
      setFilteredPatients((prevPatients) => 
         prevPatients.filter(patient => patient.id_paciente !== selectedPatientId)
      );
      setShowConfirmMessage(false); 
    }
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

        <div className="flex items-center gap-4 mt-4">
          <label htmlFor="showDisabled">Mostrar deshabilitados</label>
            <input
              type="checkbox"
              id="showDisabled"
              checked={showDisabled}
              onChange={() => setShowDisabled(!showDisabled)}
            />
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
                {showDisabled === false && <th className="px-4 py-2 border">Acciones</th>}
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
                  {showDisabled === false && (
                    <td className="px-4 py-2 flex space-x-4">
                      {/* Iconos de editar y eliminar al final de la fila */}
                      <FaEdit
                        className="text-black cursor-pointer"
                        onClick={() => editPatient(patient)}
                      />
                      <FaTrash
                        className="text-black cursor-pointer"
                        onClick={() => handleConfirm(patient.id_paciente)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showConfirmMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
          <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-lg mb-4">¿Seguro que desea eliminar al paciente seleccionado?</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="default"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmMessage(false)} // Cierra el modal sin eliminar
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="bg-black text-white px-4 py-2 rounded"
                onClick={handleDeletePatient} // Confirma la eliminación
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
  );
};

export default PatientsPage;