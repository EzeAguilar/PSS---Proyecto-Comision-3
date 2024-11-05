'use client'

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Doctor } from "@/app/lib/utils";
import { fetchAllPatientDoctors } from "@/app/lib/data";
import { Button } from "@/app/components/ui/button";
import HorariosPanel from "@/app/components/ui/horariosPanel"; // Importa el componente del panel de horarios

const DoctorsPage = () => {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const [showDisabled] = useState(false);
    const [filteredPatientDoctors, setFilteredPatientDoctors] = useState<Doctor[]>([]);
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
    const [isHorariosPanelOpen, setHorariosPanelOpen] = useState(false);

    useEffect(() => {
        loadPatientDoctors();
    }, [showDisabled, id]);

    const loadPatientDoctors = async () => {
        const allPatientDoctors = await fetchAllPatientDoctors(id);
        setFilteredPatientDoctors(allPatientDoctors.filter(doctor => doctor.deshabilitado === showDisabled));
    };

    const openHorariosPanel = (doctor: Doctor) => {
        setSelectedDoctor(doctor);
        setHorariosPanelOpen(true);
    };

    const closeHorariosPanel = () => {
        setHorariosPanelOpen(false);
        setSelectedDoctor(null);
    };

    return (
        <div className="p-4">
            <div className="flex items-center mb-4">
                <h1 className="text-3xl mr-44">Medicos</h1>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                    <thead>
                    <tr>
                        <th className="px-4 py-2 border">Nombre</th>
                        <th className="px-4 py-2 border">Apellido</th>
                        <th className="px-4 py-2 border">Especialidad</th>
                        <th className="px-4 py-2 border">Horarios</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredPatientDoctors.map((doctor) => (
                        <tr key={doctor.id_medico}>
                            <td className="px-4 py-2 border">{doctor.nombre}</td>
                            <td className="px-4 py-2 border">{doctor.apellido}</td>
                            <td className="px-4 py-2 border">{doctor.especialidad}</td>
                            <td className="px-4 py-2 border text-center">
                                <Button
                                    size="lg"
                                    variant="default"
                                    className="bg-black text-xl text-white text-[1.3rem]"
                                    onClick={() => openHorariosPanel(doctor)}
                                >
                                    Ver
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {isHorariosPanelOpen && selectedDoctor && (
                <HorariosPanel
                    idMedico={selectedDoctor.id_medico}
                    onClose={closeHorariosPanel}
                />
            )}
        </div>
    );
};

export default DoctorsPage;
