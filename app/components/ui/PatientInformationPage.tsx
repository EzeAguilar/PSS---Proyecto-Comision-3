"use client";

import { Patient } from "@/app/lib/utils";
import React from "react";

interface PatientInformationPageProps {
    patientData: Patient;
}

const PatientInformationPage: React.FC<PatientInformationPageProps> = ({ patientData }) => {

    return (
        <div className="sm:mr-0 sm:px-4 md:mr-[10%]">
            <h1 className="text-2xl font-bold mb-6 text-start sm:text-center">Información del paciente</h1>
            <div className="bg-white rounded-lg border border-gray-300 p-8 w-full shadow-md flex flex-col justify-center sm:p-4 md:p-6">
                <div className="space-y-4 mb-6 flex flex-col justify-center">
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Paciente:</h2>
                        <p className="text-right sm:text-left">{patientData.nombre}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Dirección:</h2>
                        <p className="text-right sm:text-left">{patientData.domicilio}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Correo electrónico:</h2>
                        <p className="text-right sm:text-left">{patientData.email}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">DNI:</h2>
                        <p className="text-right sm:text-left">{patientData.dni}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Teléfono:</h2>
                        <p className="text-right sm:text-left">{patientData.telefono}</p>
                    </div>
                    <div className="flex flex-col items-start md:flex-row justify-between">
                        <h2 className="text-md font-semibold">Fecha de nacimiento:</h2>
                        <p className="text-right sm:text-left">{patientData.fecha_nac}</p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        className="w-[40%] sm:w-full bg-black text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
                        onClick={() => window.history.back()}
                    >
                        Volver
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientInformationPage;
