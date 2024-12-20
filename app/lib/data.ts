"use server"
import { sql } from "@vercel/postgres";
import {Doctor, Horario, Patient, admin, Cita, ficha_medica} from "./utils";
import { unstable_noStore as noStore } from 'next/cache';
import bcrypt from 'bcrypt';

export async function doCredentialLogin(mail: string, pass: string): Promise<Doctor | Patient | admin | null> {
    noStore();
    
    
    const result = await sql`
    SELECT * FROM medicos WHERE email = ${mail}
    `;

    if (result.rows.length > 0) {
        const doctor = result.rows[0];
        const isMatch = await bcrypt.compare(pass, doctor.contraseña);
        if (isMatch) {
            
            return {
                id_medico: doctor.id_medico,
                email: doctor.email,
                contraseña: doctor.contraseña,
                numero_matricula: doctor.numero_matricula,
                nombre: doctor.nombre,
                apellido: doctor.apellido,
                dni: doctor.dni,
                domicilio: doctor.domicilio,
                fecha_nac: doctor.fecha_nac,
                especialidad: doctor.especialidad,
                telefono: doctor.telefono,
                tiempo_consulta: doctor.tiempo_consulta,
                deshabilitado: doctor.deshabilitado,
            } as Doctor;
        }
        else {
            console.log("Contraseña incorrecta");
            return null;
        }
    }

    const result2 = await sql`
    SELECT * FROM pacientes WHERE email = ${mail} 
    `;

    if (result2.rows.length > 0) {
        const paciente = result2.rows[0];
        const isMatch = await bcrypt.compare(pass, paciente.contraseña);
        if (isMatch) {
            
            return {
                id_paciente: paciente.id_paciente,
                dni: paciente.dni,
                nombre: paciente.nombre,
                apellido: paciente.apellido,
                fecha_nac: paciente.fecha_nac,
                domicilio: paciente.domicilio,
                telefono: paciente.telefono,
                email: paciente.email,
                deshabilitado: paciente.deshabilitado,
                contraseña: paciente.contraseña,
            } as Patient;
        }
        else {
            console.log("Contraseña incorrecta");
            return null;
        }
    }

    const result3 = await sql`
    SELECT * FROM administradores WHERE email = ${mail} 
    `;
    if (result3.rows.length > 0) {
        
        const admin = result3.rows[0];
        
        const isMatch = await bcrypt.compare(pass, admin.contraseña);
        if (isMatch) {
            
            return {
                id_admin: admin.id_administrador,
                email: admin.email,
                contraseña: admin.contraseña,
                fecha_creacion: admin.fecha_creacion,
                deshabilitado: admin.deshabilitado,
            } as admin;
        }
        else {
            console.log("Contraseña incorrecta");
            return null;
        }
    }

    return null;
}

export async function fetchMedico(id: number): Promise<Doctor> {
    noStore();
    const result = await sql<Doctor>`
      SELECT * FROM medicos WHERE id_medico = ${id}
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

const ITEMS_PER_PAGE = 3;
export async function fetchPatientPages(query: string): Promise<number> {
    noStore();
    try {
      const count = await sql`
        SELECT COUNT(*)
        FROM pacientes
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          apellido ILIKE ${`%${query}%`}
                      
      `;
  
      const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
      return totalPages;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch total number of patients.');
    }
  }

  export async function fetchFilteredPatients(
    query: string,
    currentPage: number,
  ): Promise<Patient[]> {
    noStore();
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
      const patients = await sql<Patient>`
        SELECT *
        FROM pacientes
        WHERE
          nombre ILIKE ${`%${query}%`} OR
          apellido ILIKE ${`%${query}%`}

        ORDER BY nombre DESC
        LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
      `;
  
      return patients.rows;
    } catch (error) {
      console.error('Database Error:', error);
      throw new Error('Failed to fetch patients.');
    }
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

export async function fetchAllDoctorPatients(id: number): Promise<Patient[]> {
    noStore();
    const result = await sql<Patient>`
    SELECT * FROM pacientes
    WHERE ID_Paciente IN (SELECT ID_Paciente FROM es_paciente_de WHERE ID_Medico = ${id})
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

export async function createCita(cita: Cita) {
    try {
      await sql`
        INSERT INTO citas (id_paciente, id_medico, fecha, inicio, deshabilitado)
        VALUES (${cita.id_paciente}, ${cita.id_medico}, ${cita.fecha}, ${cita.inicio}, false)
      `;
      return true;
    } catch (error) {
      console.error('Error creating appointment:', error);
      return false;
    }
  }


  export async function verifyAndChangePatientPassword(id: number, currentPass: string, newPass: string): Promise<boolean> {
    const patient = await sql`
      SELECT contraseña FROM pacientes WHERE id_paciente = ${id}
    `;
    
    if (patient.rows.length === 0) {
      throw new Error('Paciente no encontrado');
    }
  
    const isMatch = await bcrypt.compare(currentPass, patient.rows[0].contraseña);
    if (!isMatch) {
      throw new Error('Error en contraseña actual');
    }
  
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await sql`
      UPDATE pacientes
      SET contraseña = ${hashedNewPass}
      WHERE id_paciente = ${id}
    `;
  
    return true;
}
  
  export async function checkCitaAvailability(fecha: string, inicio: string, id_medico: number) {
    const result = await sql`
      SELECT * FROM citas 
      WHERE fecha = ${fecha} 
      AND inicio = ${inicio} 
      AND id_medico = ${id_medico}
      AND deshabilitado = false
    `;
    return result.rows.length === 0;
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

export async function fetchHorarios(id: number): Promise<Horario[]> {
    noStore();
    const result = await sql<Horario>`
    SELECT * FROM horarios WHERE id_medico = ${id}
    `;
    return result.rows;
}

export async function editHorarios(idMedico: number | undefined, horarios: Horario[]): Promise<void> {
    // Elimina los horarios existentes para el médico
    await sql`
    DELETE FROM horarios WHERE ID_Medico = ${idMedico};
    `;
    console.log("ESTOS HORARIOS SE QUIEREN INSERTAR", horarios, "LOG EN DATA.TS");
    // Inserta los nuevos horarios
    horarios.forEach(async (horario) => {
        await sql`
        INSERT INTO horarios (ID_Medico, dia, inicio, fin, deshabilitado)
        VALUES (${idMedico}, ${horario.dia}, ${horario.inicio}, ${horario.fin}, false)
        `;
    });
}

export async function fetchAllCitas(): Promise<Cita[]> {
    noStore();
    const result = await sql<Cita>`
    SELECT * FROM citas
    `;
    return result.rows;
}

export async function fechCitasDoctor(id: number | undefined): Promise<Cita[]> {
    noStore();
    const result = await sql<Cita>`
    SELECT * FROM citas WHERE ID_Medico = ${id}
    `;
    return result.rows;
}


export async function fetchDoctorsWithCitasForDate(date: Date): Promise<Doctor[]> {
    // Formatear la fecha a YYYY-MM-DD para la consulta SQL
    const formattedDate = date.toISOString().split('T')[0];

    const result = await sql<Doctor>`
    SELECT DISTINCT m.*
    FROM medicos m
    JOIN citas c ON m.ID_Medico = c.ID_Medico
    WHERE c.fecha = ${formattedDate} and c.deshabilitado = false
    `;

    return result.rows;
}

export async function cancelCita(cita: Cita): Promise<void> {
    await sql`
        UPDATE citas 
        SET deshabilitado = true
        WHERE fecha = ${cita.fecha} 
          AND ID_Medico = ${cita.id_medico} 
          AND ID_Paciente = ${cita.id_paciente};
    `;
    console.log("Cita cancelada con éxito");
}

export async function editCita(cita: Cita, fechaAnterior: string, id_paciente_Anterior: number): Promise<void> {
    await sql`
        UPDATE citas 
        SET fecha = ${cita.fecha}, 
            inicio = ${cita.inicio}, 
            ID_Paciente = ${cita.id_paciente}
        WHERE fecha = ${fechaAnterior} 
          AND ID_Medico = ${cita.id_medico} 
          AND ID_Paciente = ${id_paciente_Anterior};
    `;
    console.log("Cita editada con éxito");
}

export async function fetchCitasPatient(id: number): Promise<Cita[]> {
    noStore();
    const result = await sql<Cita>`
    SELECT * FROM citas WHERE ID_Paciente = ${id}
    `;
    return result.rows;
}

export async function cancelDate(fecha: string, id_paciente: number | undefined, id_medico: number | undefined): Promise<void> {
    await sql`
    UPDATE citas
    SET deshabilitado = true
    WHERE fecha = ${fecha} AND ID_Paciente = ${id_paciente} AND ID_Medico = ${id_medico}
    `;
}

export async function deleteCita(fecha: string, id_paciente: number | undefined, id_medico: number | undefined): Promise<void> {
    await sql`
    DELETE FROM citas
    WHERE fecha = ${fecha} AND ID_Paciente = ${id_paciente} AND ID_Medico = ${id_medico}
    `;
}

export async function fetchAllPatientDoctors(id: number): Promise<Doctor[]> {
    noStore();
    const result = await sql<Doctor>`
    SELECT * FROM medicos WHERE id_medico IN (SELECT id_medico FROM es_paciente_de WHERE id_paciente = ${id})
    `;
    return result.rows;
}

export async function findDoctorById(id: number | undefined): Promise<Doctor> {
    noStore();
    const result = await sql<Doctor>`
    SELECT * FROM medicos WHERE id_medico = ${id}
    `;
    return result.rows[0];
}

export async function fetchAllDoctorTimes(id: number | undefined): Promise<Horario[]> {
    noStore();
    const result = await sql<Horario>`
    SELECT * FROM horarios WHERE id_medico = ${id}
    `;
    return result.rows;
}

export async function insertPatientDate(cita: {
    fecha: string;
    id_medico: number | undefined;
    deshabilitado: boolean;
    inicio: string | null;
    id_paciente: number | undefined
}): Promise<void> {
    await sql`
    INSERT INTO citas (fecha, ID_Medico, ID_Paciente, inicio, deshabilitado)
    VALUES (${cita.fecha}, ${cita.id_medico}, ${cita.id_paciente}, ${cita.inicio}, ${cita.deshabilitado})
    `;
}

export async function verifyAndChangePassword(id: number, currentPass: string, newPass: string): Promise<boolean> {
    
    const doctor = await sql`
      SELECT contraseña FROM medicos WHERE id_medico = ${id}
    `;
    
    if (doctor.rows.length === 0) {
      throw new Error('Doctor not found');
    }
  
    const isMatch = await bcrypt.compare(currentPass, doctor.rows[0].contraseña);
    if (!isMatch) {
      throw new Error('Error en contraseña actual');
    }
  
    const hashedNewPass = await bcrypt.hash(newPass, 10);
    await sql`
      UPDATE medicos
      SET contraseña = ${hashedNewPass}
      WHERE id_medico = ${id}
    `;
  
    return true;
  } 

export async function fetchFichaMedica(id_paciente: number): Promise<ficha_medica> {
    noStore();
    const result = await sql<ficha_medica>`
    SELECT * FROM ficha_medica WHERE id_ficha = ${id_paciente}
    `;
    return result.rows[0];
}
export async function editFichaMedica(ficha: ficha_medica): Promise<void> {
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // Get just the date part (YYYY-MM-DD)
    
    await sql`
    UPDATE ficha_medica
    SET alergias = ${ficha.alergias}, diagnosticos = ${ficha.diagnosticos}, tratamientos = ${ficha.tratamientos}, medicamentos = ${ficha.medicamentos}, ultima_modificacion = ${formattedDate}, deshabilitado = false
    WHERE ID_Paciente = ${ficha.id_paciente}
    `;
}
export async function deshabilitarFichaMedica(id_paciente: number): Promise<void> {
    await sql`
    UPDATE ficha_medica
    SET deshabilitado = true
    WHERE id_paciente = ${id_paciente}
    `;
}