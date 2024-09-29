export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
  }
  
export const enum PATH_OPTIONS {
    patients = "patients",
    doctors = "doctors",
    calendar = "calendar",
    newPatient = "new-patient",
  };

  export interface NewPatientFormData {
    name: string;
    dni: number | undefined;
    lastName: string;
    phone: number | undefined;
    address: string;
    birthDate: string;
    email: string;
    password: string;
}