export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
export const enum PATH_OPTIONS {
    patients = "patients",
    doctors = "doctors",
    calendar = "calendar",
    newPatient = "new-patient",
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