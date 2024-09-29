import { sql } from "@vercel/postgres";
import { Patient } from "./types";

export async function fetchPatient(id: string): Promise<Patient> {
    const result = await sql<Patient>`
    SELECT * FROM pacientes WHERE ID_Paciente = ${id}
    `;

    const patient = result.rows.map((row) => {
        return {
            ID_Paciente: row.ID_Paciente,
            nombre: row.nombre,
            apellido: row.apellido,
            fecha_nac: row.fecha_nac,
            domicilio: row.domicilio,
            telefono: row.telefono,
            email: row.email,
            deshabilitado: row.deshabilitado,
        };
    });
    return patient[0];
}
