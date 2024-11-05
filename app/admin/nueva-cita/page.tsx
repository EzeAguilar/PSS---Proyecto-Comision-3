'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/app/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter} from '@/app/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/app/components/ui/alert-dialog'
import { fetchAllCitas, fetchAllDoctors, fetchAllPatients, createCita, checkCitaAvailability } from "@/app/lib/data"
import { Cita, Doctor, Patient } from "@/app/lib/utils"

const months = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]

const daysOfWeek = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"]

export default function AdminAppointmentScheduling() {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [filteredDates, setFilteredDates] = useState<Cita[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showAlertDialog, setShowAlertDialog] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showWarningDialog, setShowWarningDialog] = useState(false)
  const [isDirty, setIsDirty] = useState(false) // eslint-disable-line

  useEffect(() => {
    const loadData = async () => {
      const allDates = await fetchAllCitas()
      const allDoctors = await fetchAllDoctors()
      const allPatients = await fetchAllPatients()
      setFilteredDates(allDates.filter(date => !date.deshabilitado))
      setDoctors(allDoctors)
      setPatients(allPatients)
    }
    loadData()
  }, [])

  const generateTimeSlots = () => {
    const slots = []
    const startHour = 8 // Start at 8 AM
    const endHour = 20 // End at 8 PM
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const handleDateClick = async (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setIsDirty(true)
  }

  const handleConfirmAppointment = async () => {
    if (!selectedDoctor || !selectedPatient || !selectedDate || !selectedTime) return;

    try {
      const dateStr = selectedDate.toISOString().split('T')[0]
      const isAvailable = await checkCitaAvailability(dateStr, selectedTime, selectedDoctor.id_medico ?? 0)

      if (!isAvailable) {
        setAlertMessage('El horario seleccionado ya no está disponible.')
        setShowAlertDialog(true)
        return
      }

      const newCita: Cita = {
        id_paciente: selectedPatient.id_paciente ?? 0,
        id_medico: selectedDoctor.id_medico ?? 0,
        fecha: dateStr,
        inicio: selectedTime,
        deshabilitado: false
      }

      const success = await createCita(newCita)
      
      if (success) {
        setShowConfirmDialog(false)
        setAlertMessage('La cita se ha creado con éxito.')
        setShowAlertDialog(true)
        setIsDirty(false)
        // Refresh dates
        const allDates = await fetchAllCitas()
        setFilteredDates(allDates.filter(date => !date.deshabilitado))
      } else {
        setAlertMessage('Error al crear la cita. Por favor intente nuevamente.')
        setShowAlertDialog(true)
      }
    } catch (error) {
      console.error('Error creating appointment:', error)
      setAlertMessage('Error al crear la cita. Por favor intente nuevamente.')
      setShowAlertDialog(true)
    }
  }

  const handleAlertClose = () => {
    setShowAlertDialog(false)
    if (alertMessage.includes('éxito')) {
      router.push('/admin/calendar')
    }
  }

  const handleWarningClose = () => {
    setShowWarningDialog(false)
  }

    const changeMonth = (direction: string) => {
        if (direction === 'prev') {
            if (currentMonth === 0) {
                setCurrentMonth(11)
                setCurrentYear(currentYear - 1)
            } else {
                setCurrentMonth(currentMonth - 1)
            }
        } else if (direction === 'next') {
            if (currentMonth === 11) {
                setCurrentMonth(0)
                setCurrentYear(currentYear + 1)
            } else {
                setCurrentMonth(currentMonth + 1)
            }
        }
    }

    
    const renderCalendar = () => {
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const calendar: React.ReactNode[] = [];

        // Add day headers
        daysOfWeek.forEach(day => {
            calendar.push(
                <div key={`header-${day}`} className="text-center font-bold p-2">
                    {day}
                </div>
            );
        });

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            calendar.push(<div key={`empty-${i}`} className="p-4"></div>);
        }

        // Add calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(currentYear, currentMonth, day);
            const isToday = new Date().toDateString() === date.toDateString();
            const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
            const isSelected = selectedDate?.toDateString() === date.toDateString();

            calendar.push(
                <Button
                    key={`day-${day}`}
                    variant={isSelected ? "default" : "outline"}
                    className={`p-4 w-full ${isToday ? "border-blue-500" : ""} 
                              ${isPast ? "opacity-50" : ""}
                              ${isSelected ? "bg-black text-white hover:bg-gray-800" : "hover:bg-gray-100"}`}
                    disabled={isPast}
                    onClick={() => handleDateClick(date)}
                >
                    {day}
                </Button>
            );
        }

        return calendar;
    }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Nueva Cita</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Select onValueChange={(value : any) => { // eslint-disable-line
          setSelectedPatient(patients.find(p => p.id_paciente?.toString() === value) || null)
          setIsDirty(true)
        }}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Seleccionar Paciente" />
          </SelectTrigger>
          <SelectContent className='bg-gray-200 text-black'>
            {patients.map((patient) => (
              <SelectItem key={patient.id_paciente} value={patient.id_paciente? patient.id_paciente.toString() : '' }>
                {patient.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value: any) => { // eslint-disable-line
          setSelectedDoctor(doctors.find(d => d.id_medico?.toString() === value) || null)
          setIsDirty(true)
        }}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Seleccionar Médico" />
          </SelectTrigger>
          <SelectContent className='bg-gray-200 text-black'>
            {doctors.map((doctor) => (
              <SelectItem key={doctor.id_medico ?? ''} value={(doctor.id_medico ?? '').toString()}>
                {doctor.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
        <Button 
    onClick={() => changeMonth('prev')}
    className="w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  </Button>
          <h2 className="text-xl font-bold">{months[currentMonth]} {currentYear}</h2>
          <Button 
    onClick={() => changeMonth('next')}
    className="w-10 h-10 rounded-full bg-black text-white hover:bg-gray-800 flex items-center justify-center"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  </Button>        </div>
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {selectedDate && (
        <div className="mt-4">
          <h3 className="text-lg font-bold mb-2">
            Horarios disponibles para {selectedDate.toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-4 gap-2">



            {generateTimeSlots().map((time) => {
              const dateStr = selectedDate.toISOString().split('T')[0]
              const isTimeSlotTaken = filteredDates.some(
                date => 
                  date.fecha === dateStr &&
                  date.inicio === time &&
                  date.id_medico === selectedDoctor?.id_medico
              )
              
              return (
                <Button
      key={time}
      variant={selectedTime === time ? 'default' : 'outline'}
      onClick={() => setSelectedTime(time)}
      disabled={isTimeSlotTaken}
      className={`
        ${isTimeSlotTaken ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : ''}
        ${selectedTime === time ? 'bg-black text-white hover:bg-gray-800' : ''}
        ${!isTimeSlotTaken && selectedTime !== time ? 'hover:bg-gray-100' : ''}
      `}
    >
      {time}
    </Button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-4">
        <p>Turno: {selectedDate && selectedTime ? `${selectedDate.toLocaleDateString()} ${selectedTime}` : 'No seleccionado'}</p>
        <Button
  onClick={() => setShowConfirmDialog(true)}
  disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime}
  className={`
    ${(!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) 
      ? 'bg-gray-300 cursor-not-allowed' 
      : 'bg-black text-white hover:bg-gray-800'}
    px-6 py-2 rounded-md transition-colors
  `}
>
  Confirmar Cita
</Button>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cita</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea confirmar la siguiente cita?
              <br />
              Paciente: {selectedPatient?.nombre}
              <br />
              Médico: {selectedDoctor?.nombre}
              <br />
              Fecha y Hora: {selectedDate?.toLocaleDateString()} {selectedTime}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancelar</Button>
            <Button onClick={handleConfirmAppointment}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Información</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleAlertClose}>Aceptar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showWarningDialog} onOpenChange={setShowWarningDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Advertencia</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleWarningClose}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => { 
              setShowWarningDialog(false)
              router.push('/admin/patients')
            }}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}