'use client';

import { useEffect, useState } from "react";
import { cancelDate, fetchCitasPatient, findDoctorById } from "@/app/lib/data";
import { useParams } from "next/navigation";
import { Cita } from "@/app/lib/utils";

const PatientsPage = () => {
    const params = useParams();
    const id = parseInt(params.id as string, 10);
    const [showDisabled] = useState(false);
    const [filteredPatientDates, setFilteredPatientDates] = useState<Cita[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;
    const [doctorMap, setDoctorMap] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        loadPatientDates();
    }, [showDisabled, id]);

    useEffect(() => {
        loadDoctors();
    }, [id]);

    const loadPatientDates = async () => {
        const allPatientDates = await fetchCitasPatient(id);
        setFilteredPatientDates(allPatientDates.filter(date => date.deshabilitado === showDisabled));
    };

    const loadDoctors = async () => {
        const allPatientDates = await fetchCitasPatient(id);
        const doctorPromises = allPatientDates.map(async (date) => {
            if (date.id_medico) {
                const doctorData = await findDoctorById(date.id_medico);
                return { id: date.id_medico, name: `${doctorData.nombre} ${doctorData.apellido}` };
            }
            return null;
        });

        const doctors = await Promise.all(doctorPromises);
        const validDoctors = doctors.filter((doctor) => doctor !== null) as { id: number, name: string }[];

        // Creamos un mapa de doctores para acceder fácilmente por ID
        const doctorMap = Object.fromEntries(validDoctors.map(doctor => [doctor.id, doctor.name]));
        setDoctorMap(doctorMap);
    };

    const formatDateTime = (isoDate: string) => {
        const date = new Date(isoDate);
        const optionsDate: Intl.DateTimeFormatOptions = {
            weekday: 'long',
            day: 'numeric',
            month: 'numeric',
        };
        const optionsTime: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
        };

        const formattedDate = date.toLocaleDateString('es-AR', optionsDate).replace('-', ' / ');
        const formattedTime = date.toLocaleTimeString('es-AR', optionsTime).replace(':', '');

        const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        return `${capitalizedDate} - ${formattedTime.slice(0, 2)}:${formattedTime.slice(2)} hs`;
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredPatientDates.slice(indexOfFirstItem, indexOfLastItem);

    const handleCancelAppointment = async (fecha: string, id_paciente: number | undefined, id_medico: number | undefined) => {
        const confirmCancel = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
        if (confirmCancel) {
            await cancelDate(fecha, id_paciente, id_medico); // Espera a que se complete la cancelación
            loadPatientDates(); // Recarga las citas
        }
    };

    return (
        <div className="p-4">
            <div>
                {currentItems.length === 0 ? (
                    <p className="text-xl text-gray-600">No tiene citas pendientes.</p> // Mensaje cuando no hay citas
                ) : (
                    currentItems.map((date) => (
                        <div key={date.fecha} className="border-b border-gray-300 py-4 flex justify-between items-center">
                            <div>
                                <p className="text-3xl">{formatDateTime(date.fecha)}</p>
                                <p className="text-2xl text-gray-600">
                                    {date.id_medico !== undefined ?
                                        (doctorMap[date.id_medico] ? doctorMap[date.id_medico] : "Cargando médico...")
                                        : "Cargando médico..."
                                    }
                                </p>
                            </div>
                            <button
                                className="bg-black text-white px-4 py-2 rounded"
                                onClick={() => handleCancelAppointment(date.fecha, date.id_paciente, date.id_medico)}
                            >
                                Cancelar cita
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(filteredPatientDates.length / itemsPerPage) }, (_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => setCurrentPage(index + 1)}
                        className={`px-3 py-1 mx-1 rounded ${currentPage === index + 1 ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PatientsPage;
