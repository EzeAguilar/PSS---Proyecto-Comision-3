'use client'

import { Button } from "@/app/components/ui/button";
import {Patient} from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {deletePatient, fetchAllDoctorPatients} from "@/app/lib/data";

const PatientsPage = () => {
  useRouter();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [selectedPatientId] = useState<number | null>(null);
  const [showDisabled] = useState(false);

  //TODO agregar solo los pacientes del doctor actual
  useEffect(() => {
    const loadPatients = async () => {
      //TODO cambiar el id con el del actual logeado
      const allPatients = await fetchAllDoctorPatients(1);
      console.log("Datos de todos los pacientes:", allPatients);
      setFilteredPatients(allPatients.filter(patient => patient.deshabilitado === showDisabled));
      console.log(allPatients[0].apellido);
    };
    loadPatients();
  }, [showDisabled]);

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

          <Button
              size="lg"
              variant="default"
              className=" absolute right-0 mr-44 bg-red-500 text-white text-[1.3rem] px-10 h-12 flex items-center rounded-lg" // Botón más ovalado
              //onClick={() => handleNavigation(PATH_OPTIONS.doctorNewPatient)}
          >
            Agregar
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Nombre</th>
                <th className="px-4 py-2 border">Apellido</th>
                <th className="px-4 py-2 border">DNI</th>
                <th className="px-4 py-2 border">Domicilio</th>
                <th className="px-4 py-2 border">Teléfono</th>
                <th className="px-4 py-2 border">Ficha Médica</th>
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
                  {!showDisabled && (
                    <td className="px-4 py-2 flex border justify-center">
                      <Button
                          size="lg"
                          variant="default"
                          className=" text-xl bg-orange-500 text-white text-[1.3rem] h-12 flex rounded-lg" // Botón más ovalado
                          //onClick={() => handleNavigation(PATH_OPTIONS.medicalRecord)}
                      >
                        Ver
                      </Button>
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
