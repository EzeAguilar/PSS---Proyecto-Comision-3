"use server"
import { sql } from "@vercel/postgres";
import { Patient } from "./utils";

export async function fetchPatient(id: number): Promise<Patient> {
    const result = await sql<Patient>`
    SELECT * FROM pacientes WHERE ID_Paciente = ${id}
    `;

    const patient = result.rows.map((row) => {
        return {
            ID_Paciente: id,
            dni: 4000,
            nombre: row.nombre,
            apellido: row.apellido,
            fecha_nac: row.fecha_nac,
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
