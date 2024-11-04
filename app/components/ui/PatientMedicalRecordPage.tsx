"use client";

import { ficha_medica, Patient } from "@/app/lib/utils";
import React from "react";

interface PatientMedicalRecordPageProps {
    patientMedicalRecord: ficha_medica;
    patientData: Patient;
}

const PatientMedicalRecordPage: React.FC<PatientMedicalRecordPageProps> = ({ patientData, patientMedicalRecord}) => {
    const { alergias, diagnosticos, tratamientos, ultima_modificacion, medicamentos, deshabilitado } = patientMedicalRecord;
    const { nombre, apellido, fecha_nac, dni } = patientData;
    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-2">Ficha médica</h1>
            <p className="text-gray-600 text-right">Última modificación: {new Date(ultima_modificacion).toLocaleDateString()}</p>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-4">
                {/* Datos del paciente */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Datos del paciente</h2>
                    <p>Nombre: <span className="font-medium">{patientData.nombre}</span></p>
                    <p>Apellido: <span className="font-medium">{patientData.apellido}</span></p>
                    <p>Fecha de nacimiento: <span className="font-medium">{new Date(patientData.fecha_nac).toLocaleDateString()}</span></p>
                    <p>Edad: <span className="font-medium">{new Date().getFullYear() - new Date(patientData.fecha_nac).getFullYear()}</span></p>
                    <p>DNI: <span className="font-medium">{patientData.dni}</span></p>
                </div>

                <hr className="my-4" />

                {/* Alergias */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Alergias</h2>
                    <p>{patientMedicalRecord.alergias}</p>
                </div>

                {/* Diagnósticos */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Diagnósticos</h2>
                    <p>{patientMedicalRecord.diagnosticos}</p>
                </div>

                {/* Tratamientos */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Tratamientos</h2>
                    <p>{patientMedicalRecord.tratamientos}</p>
                </div>

                {/* Medicamentos */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Medicamentos</h2>
                    <p>{patientMedicalRecord.medicamentos}</p>
                </div>
            </div>

            <div className="flex justify-between mt-6">
                <button
                    className="bg-red-500 text-white py-2 px-4 rounded-lg"
                    disabled={!!patientMedicalRecord.deshabilitado}
                    onClick={() => console.log("Deshabilitar")}
                >
                    Deshabilitar
                </button>
                <div>
                    <button
                        className="bg-black text-white py-2 px-4 mr-2 rounded-lg"
                        onClick={() => console.log("Volver")}
                    >
                        Volver
                    </button>
                    <button
                        className="bg-black text-white py-2 px-4 rounded-lg"
                        onClick={() => console.log("Modificar")}
                    >
                        Modificar
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PatientMedicalRecordPage;
