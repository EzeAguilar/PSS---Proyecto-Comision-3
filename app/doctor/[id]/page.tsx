'use client'

import { Button } from "@/app/components/ui/button";
import {ficha_medica, Patient} from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import {useEffect, useState} from "react";
import {fetchAllDoctorPatients, fetchFichaMedica} from "@/app/lib/data";
import { useParams } from "next/navigation";

const PatientsPage = () => {
  const router = useRouter();
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
  const [showDisabled] = useState(false);
  const params = useParams()
  const id = parseInt(params.id as string, 10);

  useEffect(() => {
    const loadPatients = async () => {
      
      const allPatients = await fetchAllDoctorPatients(id);
      console.log("Datos de todos los pacientes:", allPatients);
      setFilteredPatients(allPatients.filter(patient => patient.deshabilitado === showDisabled));
      console.log(allPatients[0].apellido);
    };
    loadPatients();
  }, [showDisabled, id]);

    const getInformationPatient = (patient: Patient) => {
        router.push(`/doctor/${id}/patient-information/${patient.id_paciente}`);
    };
    
    
    const [fichaMedica, setFichaMedica] = useState<ficha_medica | null>(null);
    const handleFetchFichaMedica = async (id_paciente: number) => {
      try {
        const ficha = await fetchFichaMedica(id_paciente);
        setFichaMedica(ficha);
        console.log("Ficha médica obtenida:", ficha);
      } catch (error) {
        console.error("Error al obtener la ficha médica:", error);
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
                  <tr
                      key={patient.id_paciente}
                      onClick={() => getInformationPatient(patient)}
                      className="cursor-pointer"
                  >
                    <td className="px-4 py-2 border">{patient.nombre}</td>
                    <td className="px-4 py-2 border">{patient.apellido}</td>
                    <td className="px-4 py-2 border">{patient.dni}</td>
                    <td className="px-4 py-2 border">{patient.domicilio}</td>
                    <td className="px-4 py-2 border">{patient.telefono}</td>
                    {!showDisabled && (
                        <td className="px-4 py-2 border text-center">
                          <Button
                              size="lg"
                              variant="default"
                              className=" text-xl bg-orange-500 text-white text-[1.3rem]" // Botón más ovalado
                              onClick={(event) => {
                                //event.stopPropagation();
                                //Poner botón que fetchee la ficha del paciente
                                if (patient.id_paciente !== undefined) {
                                  handleFetchFichaMedica(patient.id_paciente);
                                }
                                //handleConfirm(patient.id_paciente);
                              }}
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
      </div>
  );
};

export default PatientsPage;
