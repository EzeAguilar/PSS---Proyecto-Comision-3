"use client"; // Agregar esta línea al inicio del archivo

import React, { useEffect, useState } from 'react';
import { useParams } from "next/navigation";
import { Doctor } from "@/app/lib/utils";
import { fetchAllPatientDoctors } from "@/app/lib/data";
import SmallCalendar from "@/app/components/ui/smallCalendar";

const Page = () => {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const [showDisabled] = useState(false);
    const [filteredPatientDoctors, setFilteredPatientDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        loadPatientDoctors();
    }, [showDisabled, id]);

    const loadPatientDoctors = async () => {
        const allPatientDoctors = await fetchAllPatientDoctors(id);
        setFilteredPatientDoctors(allPatientDoctors.filter(doctor => doctor.deshabilitado === showDisabled));
    };

    const openCalendar = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDoctor(null);
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h1 className="text-3xl mr-44">Programar Cita</h1>
            </div>
            <div>
                {filteredPatientDoctors.length === 0 ? (
                    <p className="text-xl text-gray-600">No tiene médicos asignados.</p> // Mensaje cuando no hay médicos
                ) : (
                    filteredPatientDoctors.map((doctor) => (
                        <div key={doctor.id_medico} className="border-b border-gray-300 py-4 flex justify-between items-center">
                            <div>
                                <p onClick={() => openCalendar(doctor)} className="text-3xl cursor-pointer">
                                    {doctor.nombre} {doctor.apellido} ({doctor.especialidad})
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && selectedDoctor && (
                <SmallCalendar
                    doctorName={selectedDoctor.nombre}
                    doctorLastName={selectedDoctor.apellido}
                    doctorID={selectedDoctor.id_medico}
                    onClose={closeModal}
                    idPatient={id}
                />
            )}
        </div>
    );
};

export default Page;
