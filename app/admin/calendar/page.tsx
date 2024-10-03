"use client"; // Agregar esta línea al inicio del archivo

import React, { useState } from 'react';

// Array para los nombres de los meses
const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

// Componente para crear el calendario
const Page = () => {
    // Establecer el mes y año actuales
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Función para obtener los días del mes
    const getDaysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate(); // Obtiene el número de días en el mes
    };

    // Función para manejar el cambio de mes
    const changeMonth = (direction: string) => {
        if (direction === 'next') {
            if (currentMonth === 11) { // Diciembre
                setCurrentMonth(0); // Enero
                setCurrentYear(currentYear + 1); // Incrementa el año
            } else {
                setCurrentMonth(currentMonth + 1); // Incrementa el mes
            }
        } else if (direction === 'prev') {
            if (currentMonth === 0) { // Enero
                setCurrentMonth(11); // Diciembre
                setCurrentYear(currentYear - 1); // Decrementa el año
            } else {
                setCurrentMonth(currentMonth - 1); // Decrementa el mes
            }
        }
    };

    // Generar el calendario
    const renderCalendar = () => {
        const daysInMonth = getDaysInMonth(currentMonth, currentYear);
        const startDay = new Date(currentYear, currentMonth, 1).getDay();

        const days = [];

        // Agregar los días vacíos al principio
        for (let i = 0; i < startDay; i++) {
            days.push(<div key={`empty-${i}`} className="border border-gray-300 "></div>);
        }

        // Agregar los días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(
                <div key={day} className="border border-gray-300 h-16 flex items-center justify-center">
                    {day}
                </div>
            );
        }

        return days;
    };

    // Cambia la sección donde se renderizan los días de la semana
    const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl justify-center items-center font-bold text-center mb-4">{months[currentMonth]}</h1>
            <div className="grid grid-cols-7 border border-gray-300" style={{ width: '90vw', gap: '0' }}>
                {daysOfWeek.map((day) => (
                    <div key={day} className="border border-gray-300 h-16 flex items-center justify-center">
                        {day}
                    </div>
                ))}
            </div>
            <div className="grid grid-cols-7 border border-gray-300" style={{ width: '90vw', gap: '0' }}>
                {renderCalendar()}
            </div>
            <div className="flex justify-between mt-4 w-full px-16">
                <button onClick={() => changeMonth('prev')} className="text-black">
                    ←
                </button>
                <button onClick={() => changeMonth('next')} className="text-black">
                    →
                </button>
            </div>
        </div>
    );
};

export default Page;
