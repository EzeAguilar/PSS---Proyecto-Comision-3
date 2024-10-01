"use server"
import { sql } from "@vercel/postgres";
import { Patient } from "./utils";
import { Doctor } from "./utils";

export async function fetchPatient(id: number): Promise<Patient> {
    const result = await sql<Patient>`
    SELECT * FROM pacientes WHERE ID_Paciente = ${id}
    `;

    const patient = result.rows.map((row) => {
        const date = new Date(row.fecha_nac);
        const formattedDate = date.toLocaleDateString('en-GB'); 
        return {
            ID_Paciente: id,
            dni: 4000,
            nombre: row.nombre,
            apellido: row.apellido,
            fecha_nac: formattedDate,
            domicilio: row.domicilio,
            telefono: row.telefono,
            email: row.email,
            deshabilitado: row.deshabilitado,
            contraseña: row.contraseña,
        };
    });
    return patient[0];
}

export async function insertPatient(patient: Patient): Promise<void> {
    await sql`
    INSERT INTO pacientes (nombre, apellido, fecha_nac, domicilio, telefono, email, deshabilitado, contraseña)
    VALUES (${patient.nombre}, ${patient.apellido}, ${patient.fecha_nac}, ${patient.domicilio}, ${patient.telefono}, ${patient.email}, ${patient.deshabilitado}, ${patient.contraseña})
    `;
}

export async function updatePatient(patient: Patient): Promise<void> {
    await sql`
    UPDATE pacientes
    SET nombre = ${patient.nombre}, apellido = ${patient.apellido}, fecha_nac = ${patient.fecha_nac}, domicilio = ${patient.domicilio}, telefono = ${patient.telefono}, email = ${patient.email}, deshabilitado = ${patient.deshabilitado}, contraseña =  ${patient.contraseña} 
    WHERE ID_Paciente = ${patient.ID_Paciente}
    `;
}

export async function insertDoctor(doctor: Doctor): Promise<void> {
    await sql`
    INSERT INTO medicos (email, contraseña, numero_matricula, nombre, apellido, dni, domicilio, fecha_nac, especialidad, telefono, tiempo_consulta, deshabilitado)
    VALUES (${doctor.email}, ${doctor.contraseña}, ${doctor.numero_matricula}, ${doctor.nombre}, ${doctor.apellido}, ${doctor.dni}, ${doctor.domicilio}, ${doctor.fecha_nac}, ${doctor.especialidad}, ${doctor.telefono}, ${doctor.tiempo_consulta}, ${doctor.deshabilitado})
    `;
}

export async function editDoctor(doctor: Doctor): Promise<void> {
    await sql`
    UPDATE medicos
    SET email = ${doctor.email}, contraseña = ${doctor.contraseña}, numero_matricula = ${doctor.numero_matricula}, nombre = ${doctor.nombre}, apellido = ${doctor.apellido}, dni = ${doctor.dni}, domicilio = ${doctor.domicilio}, fecha_nac = ${doctor.fecha_nac}, especialidad = ${doctor.especialidad}, telefono = ${doctor.telefono}, tiempo_consulta = ${doctor.tiempo_consulta}, deshabilitado = ${doctor.deshabilitado}
    WHERE ID_Medico = ${doctor.id_Medico}
    `;
    //CHEQUEAR, LO HIZO COPILOT
}
export async function deleteDoctor(id: number | undefined): Promise<void> {
    if (id === undefined) {
        console.error("ID is undefined, cannot delete doctor");
        return;
    }
    
    await sql`
    DELETE FROM medicos
    WHERE ID_Medico = ${id}
    `;
}
export async function searchDoctors(query: string): Promise<Doctor[]> {
    const searchQuery = `%${query}%`; // Para buscar coincidencias parciales


    const result = await sql<Doctor>`
      SELECT * FROM medicos
      WHERE nombre ILIKE ${searchQuery}
      OR apellido ILIKE ${searchQuery}
      OR CAST(dni AS TEXT) ILIKE ${searchQuery};
    `;
  
    return result.rows;
  }

  export async function fetchAllDoctors(): Promise<Doctor[]> {
    const result = await sql<Doctor>`
    SELECT * FROM medicos
    `;
    return result.rows;
}