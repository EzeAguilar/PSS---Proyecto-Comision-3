'use client'

import { Button } from "@/app/components/ui/button";
import { Patient } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState} from "react";
import { fetchAllDoctorPatients, fetchFichaMedica} from "@/app/lib/data";
import { useParams } from "next/navigation";


interface PatientWithFichaStatus extends Patient {
  hasFichaMedica: boolean;
}

const PatientsPage = () => {
  const router = useRouter();
  const [filteredPatients, setFilteredPatients] = useState<PatientWithFichaStatus[]>([]);
  const [showDisabled] = useState(false);
  const params = useParams()
  const id = parseInt(params.id as string, 10);

  useEffect(() => {
    const loadPatients = async () => {
      
      const allPatients = await fetchAllDoctorPatients(id);

      const patientsWithFichaStatus = await Promise.all(
        allPatients.map(async (patient) => {
          if (!patient.id_paciente) {
            console.log("Error: Paciente sin ID");
            return patient;
          }
      
          const fichaMedica = await fetchFichaMedica(patient.id_paciente);
          return {
            ...patient,
            hasFichaMedica: !!fichaMedica && !fichaMedica.deshabilitado, // false if ficha_medica doesn't exist or if fichaMedica.deshabilitado is true
          };
        })
      );
      

      setFilteredPatients(patientsWithFichaStatus.filter((patient): patient is PatientWithFichaStatus => patient.deshabilitado === showDisabled));
      console.log(patientsWithFichaStatus[0].apellido);
    };
    loadPatients();
  }, [showDisabled, id]);

    const getInformationPatient = (patient: Patient) => {
        router.push(`/doctor/${id}/patient-information/${patient.id_paciente}`);
    };
    
    const handleFetchFichaMedica = async (id_paciente: number) => {
        router.push(`/doctor/${id}/patient-medicalRecord/${id_paciente}`);
    };

  return (
      <div className="p-4">
        <div className="flex items-center mb-4">
          <h1 className="text-3xl mr-44">Pacientes</h1> {/* Espacio a la derecha */}
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
                              className={`text-xl text-white text-[1.3rem] ${ patient.hasFichaMedica ? "bg-orange-500" : "bg-gray-800" }`}
                                onClick={(event) => {
                                event.stopPropagation();
                                if (patient.id_paciente !== undefined) {
                                  handleFetchFichaMedica(patient.id_paciente);
                                }
                              }}
                          >
                            {patient.hasFichaMedica ? "Ver" : "Cargar"}
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
