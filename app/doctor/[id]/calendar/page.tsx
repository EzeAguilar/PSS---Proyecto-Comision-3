"use client"; // Agregar esta línea al inicio del archivo

import React, { useEffect, useState } from 'react';
import { fechCitasDoctor } from "@/app/lib/data";
import { useParams } from "next/navigation";
import { Cita } from "@/app/lib/utils";

const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const Page = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [showDisabled] = useState(false);
    const [filteredDates, setfilteredDates] = useState<Cita[]>([]);
    const params = useParams();
    const id = parseInt(params.id as string, 10);

    useEffect(() => {
        const loadDates = async () => {
            const allDates = await fechCitasDoctor(id);
            console.log("Datos de todas las citas:", allDates);
            setfilteredDates(allDates.filter(date => date.deshabilitado === showDisabled));
            console.log(allDates[0]);
        };
        loadDates();
    }, [showDisabled, id]);

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
                <div
                    key={`day-${day}`}
                    className="border h-24 flex items-center justify-center"
                >
                    {day}
                </div>
            );
        });

        // Agregar días del mes anterior al inicio si el mes no empieza en domingo
        for (let i = startDay - 1; i >= 0; i--) {
            calendar.push(
                <div
                    key={`prev-${i}`}
                    className="border h-24 flex items-center justify-center text-gray-400"
                >
                    {prevMonthDays - i}
                </div>
            );
        }

        // Agregar los días del mes actual
        for (let day = 1; day <= daysInMonth; day++) {
            const isToday = day === today.getDate() &&
                currentMonth === today.getMonth() &&
                currentYear === today.getFullYear();

            const hasAppointment = filteredDates.some(date => {
                const appointmentDate = new Date(date.fecha); // Ajusta esto según tu estructura de datos
                return appointmentDate.getDate() === day &&
                    appointmentDate.getMonth() === currentMonth &&
                    appointmentDate.getFullYear() === currentYear;
            });

            calendar.push(
                <div key={day} className={`border h-24 flex items-center justify-center ${isToday ? 'rounded-' : ''} ${hasAppointment ? 'bg-red-300' : ''}`}>
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
                <div
                    key={`next-${i}`}
                    className="border h-24 flex items-center justify-center text-gray-400"
                >
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

                {/* Días del calendario incluyendo días de la semana */}
                <div className="grid grid-cols-7 gap-0">
                    {renderCalendar()}
                </div>

                {/* Flechas de navegación */}
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
            </div>
        </div>
    );
};

export default Page;
