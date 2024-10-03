"use server"
import { sql } from "@vercel/postgres";
import { Patient } from "./utils";
import { Doctor } from "./utils";
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchPatient(id: number): Promise<Patient> {
    noStore();
    const result = await sql<Patient>`
    SELECT * FROM pacientes WHERE ID_Paciente = ${id}
    `;

    const patient = result.rows.map((row) => {
        const date = new Date(row.fecha_nac);
        const formattedDate = date.toLocaleDateString('en-GB'); 
        return {
            id_paciente: row.id_paciente,
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
    WHERE ID_Paciente = ${patient.id_paciente}
    `;
}

export async function deletePatient(id: number | undefined): Promise<void> {
    if (id === undefined) {
        console.error("ID is undefined, cannot delete patient");
        return;
    }

    try {
        await sql`
        DELETE FROM ficha_medica
        WHERE ID_Paciente = ${id};
        `;

        await sql`
        DELETE FROM citas
        WHERE ID_Paciente = ${id};
        `;

        await sql`
        DELETE FROM es_paciente_de
        WHERE ID_Paciente = ${id};
        `;

        await sql`
        DELETE FROM pacientes
        WHERE ID_Paciente = ${id};
        `;

        console.log(`Patient with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting patient with ID ${id}:`, error);
        throw error;
    }
}

export async function fetchAllPatients(): Promise<Patient[]> {
    noStore();
    const result = await sql<Patient>`
    SELECT * FROM pacientes
    `;
    return result.rows;
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
    WHERE ID_Medico = ${doctor.id_medico}
    `;
    //CHEQUEAR, LO HIZO COPILOT
}

export async function deleteDoctor(id: number | undefined): Promise<void> {
    
    if (id === undefined) {
        console.error("ID is undefined, cannot delete doctor");
        return;
    }

    try {

        await sql`
        DELETE FROM ficha_medica
        WHERE ID_Medico = ${id};
        `;

        // Eliminar las citas del médico
        await sql`
        DELETE FROM citas
        WHERE ID_Medico = ${id};
        `;

        // Eliminar los horarios del médico
        await sql`
        DELETE FROM horarios
        WHERE ID_Medico = ${id};
        `;

        // Eliminar las relaciones en "es_paciente_de"
        await sql`
        DELETE FROM es_paciente_de
        WHERE ID_Medico = ${id};
        `;

        // Finalmente, eliminar el médico
        await sql`
        DELETE FROM medicos
        WHERE ID_Medico = ${id};
        `;

        console.log(`Doctor with ID ${id} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting doctor with ID ${id}:`, error);
        throw error;
    }
}



export async function searchDoctors(query: string): Promise<Doctor[]> {
    noStore();
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
    noStore();
    const result = await sql<Doctor>`
    SELECT * FROM medicos
    `;
    return result.rows;
}