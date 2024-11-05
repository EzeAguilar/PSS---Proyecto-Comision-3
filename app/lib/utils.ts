export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
  export const enum PATH_OPTIONS {
    patients = "/admin",
    editPatient = "/admin/edit-patient",
    doctors = "/admin/doctors",

    nuevaCita = "/admin/nueva-cita",
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

export type Cita = {
  fecha: string;
  id_medico: number;
  id_paciente: number;
  inicio: string;
  deshabilitado: boolean;
}

export const diasSemana = [
  { dia: 'L', nombre: 'Lunes' },
  { dia: 'Ma', nombre: 'Martes' },
  { dia: 'Mi', nombre: 'Miércoles' },
  { dia: 'J', nombre: 'Jueves' },
  { dia: 'V', nombre: 'Viernes' },
  { dia: 'S', nombre: 'Sábado' },
  { dia: 'D', nombre: 'Domingo' },
];

export const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, '...', totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    '...',
    currentPage - 1,
    currentPage,
    currentPage + 1,
    '...',
    totalPages,
  ];
};
