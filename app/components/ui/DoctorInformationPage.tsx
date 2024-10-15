'use client';

import { Doctor } from "@/app/lib/utils";
import { Button } from "./button";
import HorarioPanel from "./horariosPanel";
import { useState } from "react";

interface DoctorInformationPageProps {
    doctorData: Doctor;
}

const DoctorInformationPage: React.FC<DoctorInformationPageProps> = ({ doctorData }) => {
    const [mostrarHorario, setMostrarHorario] = useState(false);
    return (
        <>
        {!mostrarHorario ? (
        <div className="sm:mr-0 sm:px-4 md:mr-[10%] flex flex-col gap-4 mb-40">
            <h1 className="text-2xl font-bold mb-6 text-start sm:text-center">Información del Doctor</h1>
            <div className="bg-white rounded-lg border border-gray-300 p-8 w-full shadow-md flex flex-col justify-center sm:p-4 md:p-6">
                <div className="space-y-4 mb-6 flex flex-col justify-center">
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Médico:</h2>
                        <p className="text-right sm:text-left">{doctorData.nombre}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Dirección:</h2>
                        <p className="text-right sm:text-left">{doctorData.domicilio}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Correo electrónico:</h2>
                        <p className="text-right sm:text-left">{doctorData.email}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">DNI:</h2>
                        <p className="text-right sm:text-left">{doctorData.dni}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Teléfono:</h2>
                        <p className="text-right sm:text-left">{doctorData.telefono}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Fecha de nacimiento:</h2>
                        <p className="text-right sm:text-left">{doctorData.fecha_nac}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Especialidad:</h2>
                        <p className="text-right sm:text-left">{doctorData.especialidad}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Matrícula:</h2>
                        <p className="text-right sm:text-left">{doctorData.numero_matricula}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Tiempo de consulta:</h2>
                        <p className="text-right sm:text-left">{doctorData.tiempo_consulta} minutos</p>
                    </div>
                    <div className="flex justify-end items-end pt-10">
                        <Button className=" p-5 md:max-w-[40%] sm:w-full bg-black text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                            onClick={() => setMostrarHorario(true)}
                        >
                            Ver Horarios
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex w-full justify-center">
                <button className="md:max-w-[40%] p-5 sm:w-full bg-black text-white py-2 rounded-lg hover:bg-gray-700 transition-colors">
                    Volver
                </button>
            </div>
        </div>
        ) : (
            <HorarioPanel
                idMedico={doctorData.id_medico}
                onClose={() => setMostrarHorario(false)}                  
            />
        )}
        </>
    );
}

export default DoctorInformationPage;
