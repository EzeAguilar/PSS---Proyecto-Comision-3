"use server"
import { sql } from "@vercel/postgres";
import { Horario, Patient } from "./utils";
import { Doctor } from "./utils";
import { unstable_noStore as noStore } from 'next/cache';
import bcrypt from 'bcrypt';


export async function doCredentialLogin(mail: string, pass: string): Promise<Doctor | Patient | null> {
    noStore();
    
    const result = await sql`
    SELECT * FROM medicos WHERE email = ${mail}
    `;

    if (result.rows.length > 0) {
        const doctor = result.rows[0];
        const isMatch = await bcrypt.compare(pass, doctor.contraseña);
        if (isMatch) {
            // @ts-ignore
            return doctor;
        }
    }

    const result2 = await sql`
    SELECT * FROM pacientes WHERE email = ${mail} 
    `;

    if (result2.rows.length > 0) {
        const paciente = result2.rows[0];
        const isMatch = await bcrypt.compare(pass, paciente.contraseña);
        if (isMatch) {
            // @ts-ignore
            return paciente;
        }
    }

    const result3 = await sql`
    SELECT * FROM administradores WHERE email = ${mail} 
    `;
    if (result3.rows.length > 0) {
        console.log(result3.rows[0]);
        const admin = result3.rows[0];
        console.log(admin);
        const isMatch = await bcrypt.compare(pass, admin.contraseña);
        if (isMatch) {
            // @ts-ignore
            return admin;
        }
    }

    return null;
}

export async function fetchMedico(id: number): Promise<Doctor> {
    noStore();
    const result = await sql<Doctor>`
      SELECT * FROM medicos WHERE ID_Medico = ${id}
    `;
  
    const medico = result.rows.map((row) => {
      const date = new Date(row.fecha_nac);
      const formattedDate = date.toLocaleDateString('en-GB');
      return {
        id_medico: row.id_medico,
        email: row.email,
        contraseña: row.contraseña,
        numero_matricula: row.numero_matricula,
        nombre: row.nombre,
        apellido: row.apellido,
        dni: row.dni,
        domicilio: row.domicilio,
        fecha_nac: formattedDate,
        especialidad: row.especialidad,
        telefono: row.telefono,
        tiempo_consulta: row.tiempo_consulta,
        deshabilitado: row.deshabilitado,
      };
    });
  
    return medico[0]; // Asumiendo que solo habrá un médico con el ID dado
  }

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
            dni: row.dni,
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
    INSERT INTO pacientes (nombre, apellido, fecha_nac, domicilio, telefono, email, deshabilitado, contraseña, dni)
    VALUES (${patient.nombre}, ${patient.apellido}, ${patient.fecha_nac}, ${patient.domicilio}, ${patient.telefono}, ${patient.email}, ${patient.deshabilitado}, ${patient.contraseña}, ${patient.dni})
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
        UPDATE pacientes
        SET deshabilitado = true
        WHERE ID_Paciente = ${id};
        `;

        await sql`
        UPDATE ficha_medica
        SET deshabilitado = true
        WHERE ID_Paciente = ${id};
        `;

        await sql`
        UPDATE citas
        SET deshabilitado = true
        WHERE ID_Paciente = ${id};
        `;

        await sql`
        UPDATE es_paciente_de
        SET deshabilitado = true
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

export async function insertDoctor(doctor: Doctor, horarios: Horario[]): Promise<void> {
    await sql`
    INSERT INTO medicos (email, contraseña, numero_matricula, nombre, apellido, dni, domicilio, fecha_nac, especialidad, telefono, tiempo_consulta, deshabilitado)
    VALUES (${doctor.email}, ${doctor.contraseña}, ${doctor.numero_matricula}, ${doctor.nombre}, ${doctor.apellido}, ${doctor.dni}, ${doctor.domicilio}, ${doctor.fecha_nac}, ${doctor.especialidad}, ${doctor.telefono}, ${doctor.tiempo_consulta}, ${doctor.deshabilitado})
    `;

    const result = await sql`
    SELECT id_medico FROM medicos WHERE dni = ${doctor.dni}
    `;

    const idMedico = result.rows[0]?.id_medico;

    if (!idMedico) {
        throw new Error("Médico no encontrado o error al obtener el id_medico.");
    }

    horarios.forEach(async (horario) => {
        await sql`
        INSERT INTO horarios (ID_Medico, dia, inicio, fin, deshabilitado)
        VALUES (${idMedico}, ${horario.dia}, ${horario.inicio}, ${horario.fin}, false)
        `;
    })
}

export async function editDoctor(doctor: Doctor): Promise<void> {
    await sql`
    UPDATE medicos
    SET email = ${doctor.email}, numero_matricula = ${doctor.numero_matricula}, nombre = ${doctor.nombre}, apellido = ${doctor.apellido}, dni = ${doctor.dni}, domicilio = ${doctor.domicilio}, fecha_nac = ${doctor.fecha_nac}, especialidad = ${doctor.especialidad}, telefono = ${doctor.telefono}, tiempo_consulta = ${doctor.tiempo_consulta}, deshabilitado = ${doctor.deshabilitado}
    WHERE ID_Medico = ${doctor.id_medico}
    `;
    //CHEQUEAR, LO HIZO COPILOT
}

export async function deleteDoctor(id: number | undefined): Promise<void> {
    
    if (id === undefined) {
        console.error("ID is undefined, cannot disable doctor");
        return;
    }
    
    try {
        // Establecer el campo deshabilitado en true para el médico
        await sql`
        UPDATE medicos
        SET deshabilitado = true
        WHERE ID_Medico = ${id};
        `;

        await sql`
        UPDATE ficha_medica
        SET deshabilitado = true
        WHERE ID_Medico = ${id};
        `;

        await sql`
        UPDATE citas
        SET deshabilitado = true
        WHERE ID_Medico = ${id};
        `;

        await sql`
        UPDATE es_paciente_de
        SET deshabilitado = true
        WHERE ID_Medico = ${id};
        `;

        await sql`
        UPDATE horarios
        SET deshabilitado = true
        WHERE ID_Medico = ${id};
        `;


    
        console.log(`Doctor with ID ${id} disabled successfully.`);
    } catch (error) {
        console.error(`Error disabling doctor with ID ${id}:`, error);
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