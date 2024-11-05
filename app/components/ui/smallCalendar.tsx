import React, {useEffect, useState} from 'react';
import {Cita, Horario} from "@/app/lib/utils";
import {fechCitasDoctor, fetchAllDoctorTimes, insertPatientDate} from "@/app/lib/data";
import Swal from "sweetalert2";

interface SmallCalendarProps {
    doctorName: string,
    doctorLastName: string,
    doctorID: number | undefined,
    onClose: () => void,
    idPatient?: number
}

const SmallCalendar: React.FC<SmallCalendarProps> = ({
                                                         doctorName,
                                                         doctorLastName,
                                                         doctorID,
                                                         onClose,
                                                         idPatient,
                                                     }) => {
    const [filteredDoctorTimes, setFilteredDoctorTimes] = useState<Horario[]>([]);
    const [filteredDoctorDates, setFilteredDoctorDates] = useState<Cita[]>([]);

    useEffect(() => {
        loadDoctorTimes();
        loadDoctorDates();
    }, [doctorID]);

    const loadDoctorDates = async () => {
        const allDoctorDates = await fechCitasDoctor(doctorID);
        setFilteredDoctorDates(allDoctorDates);
    };

    const loadDoctorTimes = async () => {
        const allDoctorTimes = await fetchAllDoctorTimes(doctorID);
        setFilteredDoctorTimes(allDoctorTimes);
    };

    const generateTimeSlots = (startTime: string, endTime: string) => {
        const slots = [];

        const [startHour, startMinute] = startTime.split(':').map(Number);
        const [endHour, endMinute] = endTime.split(':').map(Number);

        const currentTime = new Date(1970, 0, 1, startHour, startMinute);
        const end = new Date(1970, 0, 1, endHour, endMinute);

        while (currentTime < end) {
            slots.push(currentTime.toTimeString().slice(0, 5)); // Agrega el tiempo en formato HH:MM
            currentTime.setMinutes(currentTime.getMinutes() + 20); // Incrementa en 30 minutos
        }

        return slots;
    };

    const getCurrentMonthDays = () => {
        const date = new Date();
        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        const daysArray = [];
        const weekDaysMap = ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'];

        // Determina el día de la semana del primer día del mes
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

        // Rellena días vacíos hasta el primer día del mes
        for (let i = 0; i < firstDayOfMonth; i++) {
            daysArray.push({ day: null, isAvailable: false, isBooked: false });
        }

        // Rellena los días del mes actual con la disponibilidad
        for (let i = 1; i <= daysInMonth; i++) {
            const currentDate = new Date(currentYear, currentMonth, i);
            const weekDay = weekDaysMap[currentDate.getDay()];

            // Verifica si hay horarios disponibles para el médico en este día
            const doctorSchedule = filteredDoctorTimes.find(time => time.dia === weekDay);
            const isAvailable = doctorSchedule !== undefined;

            let isBooked = false;

            if (doctorSchedule) {
                const timeSlots = generateTimeSlots(doctorSchedule.inicio, doctorSchedule.fin);
                const bookedSlots = filteredDoctorDates
                    .filter(date => {
                        const d = new Date(date.fecha);
                        return d.getDate() === i && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
                    })
                    .map(date => {
                        const d = new Date(date.fecha); // Asegúrate de usar la fecha correcta
                        const [hours, minutes] = date.inicio.split(':'); // Separar horas y minutos
                        d.setHours(parseInt(hours), parseInt(minutes));
                        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
                    });

                isBooked = timeSlots.every(slot => bookedSlots.includes(slot));
            }

            daysArray.push({ day: i, isAvailable, isBooked });
        }

        return daysArray;
    };



    const days = getCurrentMonthDays();
    const monthName = new Date().toLocaleString('default', {month: 'long'}).toUpperCase();
    const weekDays = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

    const handleDayClick = async (day: number) => {
        const selectedDate = new Date();
        selectedDate.setDate(day);

        // Verifica si el paciente ya tiene una cita programada en el día seleccionado
        const hasAppointment = filteredDoctorDates.some(date => {
            console.log(date);
            const appointmentDate = new Date(date.fecha);
            return (
                appointmentDate.getDate() === day &&
                appointmentDate.getMonth() === selectedDate.getMonth() &&
                appointmentDate.getFullYear() === selectedDate.getFullYear() &&
                date.id_paciente === idPatient // Verifica que la cita sea para el paciente actual
            );
        });

        if (hasAppointment) {
            // Mostrar alerta si ya tiene una cita programada
            await Swal.fire({
                title: 'Cita ya programada',
                text: 'Ya tiene una cita programada para este día. Seleccione otra fecha.',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return; // Detener la ejecución si ya tiene una cita
        }

        const weekDaysMap = ['D', 'L', 'Ma', 'Mi', 'J', 'V', 'S'];
        const doctorSchedule = filteredDoctorTimes.find(time => time.dia === weekDaysMap[selectedDate.getDay()]);
        if (!doctorSchedule) return;

        const timeSlots = generateTimeSlots(doctorSchedule.inicio, doctorSchedule.fin);

        const bookedSlots = filteredDoctorDates
            .filter(date => {
                const d = new Date(date.fecha);
                return (
                    d.getDate() === day &&
                    d.getMonth() === selectedDate.getMonth() &&
                    d.getFullYear() === selectedDate.getFullYear()
                );
            })
            .map(date => date.inicio.slice(0, 5));

        const timeOptionsContainer = document.createElement('div');
        timeOptionsContainer.style.maxHeight = '200px';
        timeOptionsContainer.style.overflowY = 'auto';
        timeOptionsContainer.style.textAlign = 'left';

        timeSlots.forEach(slot => {
            if (!bookedSlots.includes(slot)) {
                const button = document.createElement('button');
                button.type = 'button';
                button.style.display = 'block';
                button.style.width = '100%';
                button.style.padding = '8px';
                button.style.textAlign = 'center';
                button.style.fontSize = '18px';
                button.style.borderTop = '1px solid #ccc';
                button.style.borderBottom = '1px solid #ccc';
                button.style.background = 'white';
                button.style.cursor = 'pointer';
                button.style.marginTop = '4px';
                button.innerText = slot;

                button.onclick = () => confirmTime(slot, selectedDate.toISOString().split('T')[0], doctorID, idPatient, day);

                timeOptionsContainer.appendChild(button);
            }
        });

        await Swal.fire({
            title: `Seleccione un horario para su turno:`,
            html: timeOptionsContainer,
            showCancelButton: true,
            showConfirmButton: false,
            cancelButtonText: 'Cancelar'
        });
    };

// Función para confirmar la reserva
    const confirmTime = async (selectedTime: string, selectedDate: string, doctorID: number | undefined, idPatient: number | undefined, day: number) => {
        const confirmResult = await Swal.fire({
            text: `¿Está seguro que desea reservar el horario ${selectedTime}?`,
            showCancelButton: true,
            confirmButtonText: 'Sí, reservar',
            cancelButtonText: 'Cancelar'
        });

        if (confirmResult.isConfirmed) {
            const newDate: Cita = {
                fecha: `${selectedDate} ${selectedTime}`,
                id_medico: doctorID,
                id_paciente: idPatient,
                inicio: selectedTime,
                deshabilitado: false
            }
            await insertPatientDate(newDate);
            Swal.fire(
                'Turno reservado',
                `Ha reservado su turno para el día ${day} a las ${selectedTime}.`,
                'success'
            );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-lg">
                <h2 className="text-2xl mb-4">Calendario de {doctorName} {doctorLastName}</h2>
                <h3 className="text-lg mb-4 text-center font-bold">{monthName}</h3>
                <div className="grid grid-cols-7 gap-0">
                    {weekDays.map((day, index) => (
                        <div key={index} className="p-2 text-center font-bold border">
                            {day}
                        </div>
                    ))}
                    {days.map(({day, isAvailable, isBooked}, index) => (
                        <div
                            key={index}
                            className={`p-2 text-center border 
                                ${isBooked ? 'bg-red-200' : isAvailable || day === null ? 'bg-white' : 'bg-gray-200'}
                                ${isAvailable && !isBooked ? 'cursor-pointer' : ''}`}
                            onClick={() => isAvailable && !isBooked ? handleDayClick(day as number) : null}
                        >
                            {day !== null ? day : ""}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center mt-4">
                    <button onClick={onClose} className="bg-red-500 text-white py-2 px-4 rounded">
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SmallCalendar;
