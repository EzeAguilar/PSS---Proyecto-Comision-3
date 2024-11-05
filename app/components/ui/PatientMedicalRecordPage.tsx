"use client";

import { deshabilitarFichaMedica, editFichaMedica } from "@/app/lib/data";
import { ficha_medica, Patient, convertDateFormat } from "@/app/lib/utils";
import React, { useState, useEffect } from "react";

interface PatientMedicalRecordPageProps {
    patientMedicalRecord: ficha_medica;
    patientData: Patient;
}

const PatientMedicalRecordPage: React.FC<PatientMedicalRecordPageProps> = ({ patientData, patientMedicalRecord}) => {

    const [isEditing, setIsEditing] = useState(false);
    const [editableRecord, setEditableRecord] = useState<ficha_medica>(patientMedicalRecord);
    const [showConfirmation, setShowConfirmation] = useState(false);
    
    useEffect(() => {
        if (patientMedicalRecord.deshabilitado) {
            setIsEditing(true);
        }
    }, [patientMedicalRecord.deshabilitado]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableRecord({ ...editableRecord, [name]: value });
    };

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleSave = () => {
        editFichaMedica(editableRecord);
        setIsEditing(false);
    };

    const confirmDeshabilitar = async () => {
        await deshabilitarFichaMedica(patientMedicalRecord.id_paciente);
        setEditableRecord({ ...editableRecord, deshabilitado: true });
        setShowConfirmation(false);
    };
    
    return (
        <div className="p-8">
            <h1 className="text-2xl font-semibold mb-2">Ficha médica</h1>
            <p className="text-gray-600 text-right">Última modificación: {new Date(patientMedicalRecord.ultima_modificacion).toLocaleDateString()}</p>

            <div className="bg-gray-100 p-6 rounded-lg shadow-md mt-4">
                {/* Datos del paciente */}
                <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Datos del paciente</h2>
                    <p>Nombre: <span className="font-medium">{patientData.nombre}</span></p>
                    <p>Apellido: <span className="font-medium">{patientData.apellido}</span></p>
                    <p>Fecha de nacimiento: <span className="font-medium">{new Date(convertDateFormat(patientData.fecha_nac)).toLocaleDateString()}</span></p>
                    <p>Edad: <span className="font-medium">{patientData.fecha_nac ? new Date().getFullYear() - new Date(convertDateFormat(patientData.fecha_nac)).getFullYear() : 'N/A'}</span></p>
                    <p>DNI: <span className="font-medium">{patientData.dni}</span></p>
                </div>

                <hr className="my-4" />

                {/* Alergias */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Alergias</h2>
                    {isEditing ? (
                        <textarea
                            name="alergias"
                            value={editableRecord.alergias}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p>{editableRecord.alergias}</p>
                    )}
                </div>

                {/* Diagnósticos */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Diagnósticos</h2>
                    {isEditing ? (
                        <textarea
                            name="diagnosticos"
                            value={editableRecord.diagnosticos}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p>{editableRecord.diagnosticos}</p>
                    )}
                </div>

                {/* Tratamientos */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Tratamientos</h2>
                    {isEditing ? (
                        <textarea
                            name="tratamientos"
                            value={editableRecord.tratamientos}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p>{editableRecord.tratamientos}</p>
                    )}
                </div>

                {/* Medicamentos */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Medicamentos</h2>
                    {isEditing ? (
                        <textarea
                            name="medicamentos"
                            value={editableRecord.medicamentos}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    ) : (
                        <p>{editableRecord.medicamentos}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-between mt-6">
                {!isEditing && (
                    <button
                        className="bg-red-500 text-white py-2 px-4 rounded-lg"
                        onClick={() => {
                            setShowConfirmation(true);
                        }}
                    >
                        Deshabilitar
                    </button>
                )}
                {showConfirmation && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <p>¿Estás seguro de que deseas deshabilitar esta ficha médica?</p>
                            <button
                                className="bg-gray-500 text-white py-2 px-4 mr-2 rounded-lg"
                                onClick={() => setShowConfirmation(false)}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-red-500 text-white py-2 px-4 rounded-lg"
                                onClick={confirmDeshabilitar}
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                )}

                <div>
                    <button
                        className="bg-gray-500 text-white py-2 px-4 mr-2 rounded-lg"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancelar
                    </button>
                    {isEditing ? (
                        <button
                            className="bg-green-500 text-white py-2 px-4 rounded-lg"
                            onClick={handleSave}
                        >
                            Guardar
                        </button>
                    ) : (
                        <button
                            className="bg-black text-white py-2 px-4 rounded-lg"
                            onClick={handleEditToggle}
                        >
                            Modificar ficha
                        </button>
                    )}
                </div>
            </div>
        </div>
        
    );
}

export default PatientMedicalRecordPage;
