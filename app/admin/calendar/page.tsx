"use client"; // Agregar esta línea al inicio del archivo

import React, { useEffect, useState } from 'react';
import { fetchAllCitas, fetchDoctorsWithCitasForDate } from "@/app/lib/data";
import { Cita, Doctor } from "@/app/lib/utils";

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Page = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [showDisabled] = useState(false);
    const [filteredDates, setfilteredDates] = useState<Cita[]>([]);
    const [allMedicos, setAllMedicos] = useState<Doctor[]>([]);
    const [selectedMedico, setSelectedMedico] = useState<string>("");
    const [showModal, setShowModal] = useState(false);
    const [medicoCitas, setMedicoCitas] = useState<Cita[]>([]);

    useEffect(() => {
        const loadDates = async () => {
            const allDates = await fetchAllCitas();
            setfilteredDates(allDates.filter(date => date.deshabilitado === showDisabled));
        };
        loadDates();
    }, [showDisabled]);

    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const changeMonth = (direction: string) => {
        if (direction === 'next') {
            if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
            } else {
                setCurrentMonth(currentMonth + 1);
            }
        } else if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
            } else {
                setCurrentMonth(currentMonth - 1);
            }
        }
    };

    const openModal = async (day: number) => {
        const selectedDay = new Date(currentYear, currentMonth, day);
        setSelectedDate(selectedDay);

        const medicos = await fetchDoctorsWithCitasForDate(selectedDay); 
        setAllMedicos(medicos);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedMedico("");
        setMedicoCitas([]);
    };

    const handleMedicoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const medicoID = event.target.value;
        setSelectedMedico(medicoID);
     
        console.log(filteredDates);
    
        const selectedDateString = selectedDate?.toDateString(); // Convierte la fecha seleccionada a un formato legible
        console.log(selectedDateString);
    
        filteredDates.forEach(cita => {
            console.log(cita.fecha); // Debes asegurarte de que esta sea la misma propiedad que estás usando para comparar
            console.log(cita.id_medico); // Usar el nombre correcto, que es ID_Medico según tu tipo de Cita
        });
    
        const citasForMedico = filteredDates.filter(
            cita => 
                cita.id_medico?.toString() === medicoID && 
                new Date(cita.fecha).toDateString() === selectedDateString // Usar toDateString para asegurar la comparación correcta
        );
    
        setMedicoCitas(citasForMedico);
        console.log(citasForMedico); // Muestra las citas filtradas, no medicoCitas porque setMedicoCitas es asíncrono
    };
    

    useEffect(() => {
        console.log("Medico seleccionado actualizado:", selectedMedico);
    }, [selectedMedico]);

    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const startDay = new Date(currentYear, currentMonth, 1).getDay();
        const prevMonthDays = getDaysInMonth(
            currentMonth === 0 ? 11 : currentMonth - 1,
            currentMonth === 0 ? currentYear - 1 : currentYear
        );

        const calendar = [];
        const today = new Date();

        // Agregar los días de la semana
        daysOfWeek.forEach((day) => {
            calendar.push(
                <div key={`day-${day}`} className="border h-24 flex items-center justify-center">
                    {day}
                </div>
            );
        });

        // Agregar días del mes anterior al inicio si el mes no empieza en domingo
        for (let i = startDay - 1; i >= 0; i--) {
            calendar.push(
                <div key={`prev-${i}`} className="border h-24 flex items-center justify-center text-gray-400">
                    {prevMonthDays - i}
                </div>
            );
        }

        // Agregar los días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

            // Verifica si hay citas para el día actual
            const hasAppointment = filteredDates.some((date) => {
                const appointmentDate = new Date(date.fecha);
                return (
                    appointmentDate.getDate() === day &&
                    appointmentDate.getMonth() === currentMonth &&
                    appointmentDate.getFullYear() === currentYear
                );
            });

            calendar.push(
                <div
                    key={day}
                    className={`border h-24 flex items-center justify-center ${
                        isToday ? 'rounded-full bg-blue-100' : ''
                    } ${hasAppointment ? 'bg-red-300' : ''}`}
                    onClick={() => hasAppointment && openModal(day)}
                >
                    {isToday ? (
                        <div className="flex items-center justify-center">
                        <span className="text-blue-500 bg-white rounded-full border border-blue-500 w-12 h-12 flex items-center justify-center">
                            {day}
                        </span>
                        </div>
                    ) : (
                        <span>{day}</span>
                    )}
                </div>
            );
        }

        // Agregar días del siguiente mes al final si la fila no está completa
        const totalCells = calendar.length;
        const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
        for (let i = 1; i <= remainingCells; i++) {
            calendar.push(
                <div key={`next-${i}`} className="border h-24 flex items-center justify-center text-gray-400">
                    {i}
                </div>
            );
        }

        return calendar;
    };


    return (
        <div className="flex ml-32 mr-32">
            <div className="flex-1 flex-col">
                <div className="flex justify-center items-center mb-3">
                    <h1 className="text-[2.8rem] font-bold">
                        {months[currentMonth]}
                    </h1>
                </div>

                <div className="grid grid-cols-7 gap-0">
                    {renderCalendar()}
                </div>

                <div className="flex justify-between pt-1">
                    <button
                        onClick={() => changeMonth('prev')}
                        className="text-[3rem] rotate-180"
                    >
                        ➔
                    </button>
                    <button onClick={() => changeMonth('next')} className="text-[3rem]">
                        ➔
                    </button>
                </div>

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg">
                            <label>Seleccione un médico: </label>
                            <select value={selectedMedico} onChange={handleMedicoChange}>
                                <option value="">Seleccione</option>
                                {allMedicos.map(medico => (
                                    <option key={medico.id_medico} value={medico.id_medico}>
                                        {medico.nombre} {medico.apellido}
                                    </option>
                                ))}
                            </select>

                            {selectedMedico && (
                                medicoCitas.length > 0 ? (
                                    medicoCitas.map(cita => (
                                        <div key={cita.id_paciente} className="mt-4">
                                            <p>Paciente: {cita.id_paciente}</p>
                                            <p>Horario: {cita.inicio}</p>
                                            <button className="bg-red-500 text-white px-2 py-1 mr-2">Cancelar</button>
                                            <button className="bg-black text-white px-2 py-1">Editar</button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="mt-4">No hay turnos para el médico seleccionado.</p>
                                )
                            )}
                            <button onClick={closeModal} className="bg-black text-white px-4 py-2 mt-4">Cerrar</button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Page;
