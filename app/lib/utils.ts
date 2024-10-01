export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
export const enum PATH_OPTIONS {
    patients = "patients",
    doctors = "doctors",
    calendar = "calendar",
    newPatient = "new-patient",
    newDoctor = "new-doctor",
    editDoctor = "edit-doctor",
  };

  export type Patient = {
    ID_Paciente: number | undefined;
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
  id_Medico: number | undefined;
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