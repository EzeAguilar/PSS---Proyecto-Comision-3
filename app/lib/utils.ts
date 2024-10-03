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