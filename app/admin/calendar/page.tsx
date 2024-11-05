"use client"; // Agregar esta línea al inicio del archivo

import React, { useEffect, useState } from 'react';
import { cancelCita, editCita, fetchAllCitas, fetchAllPatients, fetchDoctorsWithCitasForDate, fetchHorarios } from "@/app/lib/data";
import { Cita, Doctor, Horario, Patient } from "@/app/lib/utils";

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Page = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [avaliableTimes, setAvaliableTimes] = useState<string[]>([]);
    const [showDisabled] = useState(false);
    const [filteredDates, setfilteredDates] = useState<Cita[]>([]);
    const [allMedicos, setAllMedicos] = useState<Doctor[]>([]);
    const [selectedMedico, setSelectedMedico] = useState<string>("");
    const [showModalList, setShowModalList] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
    const [nuevaCita, setNuevaCita] = useState<Cita | null>(null);
    const [medicoCitas, setMedicoCitas] = useState<Cita[]>([]);
    const [pacientes, setPacientes] = useState<Patient[]>([]);
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [mensajeError, setMensajeError] = useState<boolean>(false);

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
        setShowModalList(true);
    };

    const closeModal = () => {
        setShowModalList(false);
        setSelectedMedico("");
        setMedicoCitas([]);
    };

    const handleMedicoChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
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
                cita.deshabilitado === false && 
                new Date(cita.fecha).toDateString() === selectedDateString // Usar toDateString para asegurar la comparación correcta
        );
    
        setMedicoCitas(citasForMedico);
        console.log(citasForMedico); // Muestra las citas filtradas, no medicoCitas porque setMedicoCitas es asíncrono

        const allHorarios = await fetchHorarios(Number(medicoID));
        setHorarios(allHorarios);
        console.log("HORARIOS:", allHorarios);
    };

    const generateAvailableTimes = (inicio: string, fin: string) => {
        const start = new Date(`1970-01-01T${inicio}`);
        const end = new Date(`1970-01-01T${fin}`);
        const times: string[] = [];
    
        while (start < end) {
          times.push(start.toTimeString().slice(0, 5)); 
          start.setMinutes(start.getMinutes() + 30); // Incrementar 30 minutos
        }
        return times;
      };

    const openCancelModal = (cita: Cita) => {
        setSelectedCita(cita);
        setShowCancelModal(true);
    };

    const handleDateChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setNuevaCita(nuevaCita ? { ...nuevaCita, fecha: e.target.value } : null);
        const fecha = new Date(e.target.value);
        const diasSemana = ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'];
        const diaSeleccionado = diasSemana[fecha.getUTCDay()]; // Obtener el día como abreviación
        console.log("HORARIOS:", horarios);
        console.log("día seleccionado", diaSeleccionado);

        // Buscamos el horario que coincida con el día seleccionado
        const horario = horarios.find(horario => horario.dia === diaSeleccionado);
        console.log("dia encontrado", horario);
        if (!horario) {
            setMensajeError(true); // No hay horario disponible para ese día
            setAvaliableTimes([]); // Limpiar horarios disponibles
        } else {
            setMensajeError(false); // Hay horario disponible, limpiar el mensaje de error
            // Generar y establecer los horarios disponibles entre `inicio` y `fin`
            const times = generateAvailableTimes(horario.inicio, horario.fin);
            console.log("inicio", horario.inicio);
            console.log("fin", horario.fin);
            console.log("times", times);
            setAvaliableTimes(times);

            console.log("Horario disponible encontrado:", horario);
        }
    
    };

    const confirmCancelCita = async () => {
        if (selectedCita) {
            await cancelCita(selectedCita);
            console.log("Cita cancelada:", selectedCita);

            const allDates = await fetchAllCitas();
            setfilteredDates(allDates.filter(date => date.deshabilitado === showDisabled));
        }
        setShowCancelModal(false);
        setShowModalList(false);
    };

    const openEditModal = async (cita: Cita) => {
        const pacientesData = await fetchAllPatients();
        setPacientes(pacientesData);
        
        setSelectedCita(cita);
        setNuevaCita(cita)
        setShowEditModal(true);
    };

    const saveEditCita = async () => {
        try {
            if (nuevaCita && selectedCita?.fecha && selectedCita?.id_paciente) {
                await editCita(
                    nuevaCita,
                    selectedCita.fecha,
                    selectedCita.id_paciente
                );
            }

            const allDates = await fetchAllCitas();
            setfilteredDates(allDates.filter(date => date.deshabilitado === showDisabled));

            setShowEditModal(false);
            setShowModalList(false);
        } catch (error) {
            console.error("Error al editar la cita:", error);
        }
    };

    useEffect(() => {
        console.log("Medico seleccionado actualizado:", selectedMedico);
        console.log("Nueva cita", nuevaCita);
    }, [selectedMedico, nuevaCita]);

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

                {showModalList && (
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
                                            <button onClick={() => openCancelModal(cita)} className="bg-red-500 text-white px-2 py-1 mr-2">Cancelar</button>
                                            <button onClick={() => openEditModal(cita)} className="bg-black text-white px-2 py-1">Editar</button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="mt-4">No hay citas para este médico en la fecha seleccionada.</p>
                                )
                            )}
                            <button onClick={closeModal} className="bg-gray-300 px-4 py-2 mt-4">Cerrar</button>
                        </div>
                    </div>
                )}

                {showCancelModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg">
                            <h2 className="text-lg font-bold mb-4">Confirmar Cancelación</h2>
                            <p>¿Estás seguro de que deseas cancelar la cita?</p>
                            <div className="flex justify-end mt-4">
                                <button onClick={() => setShowCancelModal(false)} className="bg-gray-300 px-4 py-2 mr-2">Cancelar</button>
                                <button onClick={confirmCancelCita} className="bg-red-500 text-white px-4 py-2">Confirmar</button>
                            </div>
                        </div>
                    </div>
                )}

                {showEditModal && selectedCita && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg">
                            <h2>Editar cita</h2>

                            {/* Selector de paciente */}
                            <label>Paciente: </label>
                            <select
                                value={nuevaCita?.id_paciente || ''}
                                onChange={(e) => setNuevaCita(nuevaCita ? { ...nuevaCita, id_paciente: Number(e.target.value) } : null)}
                            >
                                {pacientes.map((paciente) => (
                                    <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                        {paciente.nombre} {paciente.apellido}
                                    </option>
                                ))}
                            </select>

                            <label>Fecha: </label>
                                <input
                                    type="date"
                                    value={nuevaCita?.fecha || ''}
                                    onChange={(e) => handleDateChange(e)}
                                />

                            <label>Horario: </label>
                                <select
                                    value={nuevaCita?.inicio}
                                    onChange={(e) => setNuevaCita(nuevaCita ? {...nuevaCita , inicio: e.target.value }: null)}
                                >
                                <option value="">Seleccione un horario</option>
                                    {!mensajeError && (
                                    avaliableTimes.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))
                                    )}
                                </select>

                            {mensajeError && <p className="text-red-500">El médico no trabaja en el día seleccionado, por favor seleccione otro</p>}

                            <button onClick={saveEditCita} className="bg-red-500 text-white px-2 py-1 mr-2" disabled={mensajeError}>Guardar cambios</button>
                            <button onClick={() => setShowEditModal(false)} className="bg-black text-white px-2 py-1">Descartar cambios</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;

