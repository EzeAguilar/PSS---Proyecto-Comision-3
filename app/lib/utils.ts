export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  export const enum PATH_OPTIONS {
    patients = "/admin",
    editPatient = "/admin/edit-patient",
    doctors = "/admin/doctors",
    calendar = "/admin/calendar",
    newPatient = "/admin/new-patient",
    newDoctor = "new-doctor",
    editDoctor = "edit-doctor",
    doctorPatients = "`/doctor/${id}`",
    doctorCalendar = "/doctor/calendar",
    appointments = "/patient",
    scheduleAppointment = "/patient/new-appointment",
    patientDoctors = "/patient/doctors"
  };

  export type admin = {
    id_admin: number | undefined;
    email: string;
    contraseña: string;
    fecha_creacion: string;
    deshabilitado: boolean;
  };

  export type Patient = {
    id_paciente: number | undefined;
    nombre: string;
    dni: number | undefined;
    apellido: string;
    contraseña: string;
    fecha_nac: string;
    domicilio: string;
    telefono: number | undefined;
    email: string;
    deshabilitado: boolean;
};

export type Doctor = {
  id_medico: number | undefined;
  email: string;
  contraseña: string;
  numero_matricula: number | undefined;
  nombre: string;
  apellido: string;
  dni: number | undefined;
  domicilio: string;
  fecha_nac: string;
  especialidad: string;
  telefono: number | undefined;
  tiempo_consulta: number | undefined;
  deshabilitado: boolean;
};

export type Horario = {
  dia: string;
  inicio: string;
  fin: string;
  activo: boolean;
};

export const diasSemana = [
  { dia: 'L', nombre: 'Lunes' },
  { dia: 'Ma', nombre: 'Martes' },
  { dia: 'Mi', nombre: 'Miércoles' },
  { dia: 'J', nombre: 'Jueves' },
  { dia: 'V', nombre: 'Viernes' },
  { dia: 'S', nombre: 'Sábado' },
  { dia: 'D', nombre: 'Domingo' },
];