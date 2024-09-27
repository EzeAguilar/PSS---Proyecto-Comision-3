const { pacientes,
    medicos,
    citas,
    fichas_medicas,
    administradores,
    es_paciente_de,
    horarios } = require('./placeholder-data');

const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Función para insertar datos en la tabla "Pacientes"
async function seedPacientes(client) {
  
  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS pacientes (
        ID_Paciente SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        domicilio VARCHAR(255),
        telefono BIGINT,
        fecha_nac DATE,
        deshabilitado BOOLEAN
      );
    `;

    console.log(`Created "pacientes" table`);

    for (const paciente of pacientes) {
      const hashedPassword = await bcrypt.hash(paciente.contraseña, 10);
      await client.sql`
        INSERT INTO pacientes (ID_Paciente, email, contraseña, nombre, apellido, domicilio, telefono, fecha_nac, deshabilitado)
        VALUES (${paciente.ID_Paciente} ,${paciente.email}, ${hashedPassword}, ${paciente.nombre}, ${paciente.apellido}, ${paciente.domicilio}, ${paciente.telefono}, ${paciente.fecha_nac}, ${paciente.deshabilitado});
      `;
    }

    console.log(`Seeded pacientes`);

  } catch (error) {
    console.error('Error seeding pacientes:', error);
    throw error;
  }
}

// Función para insertar datos en la tabla "Médicos"
async function seedMedicos(client) {

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS medicos (
        ID_Medico SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        numero_matricula INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        dni INT NOT NULL,
        domicilio VARCHAR(255),
        fecha_nac DATE,
        especialidad VARCHAR(255),
        telefono BIGINT,
        tiempo_consulta INT,
        deshabilitado BOOLEAN
      );
    `;

    console.log(`Created "medicos" table`);

    for (const medico of medicos) {
      const hashedPassword = await bcrypt.hash(medico.contraseña, 10);
      await client.sql`
        INSERT INTO medicos (ID_Medico, email, contraseña, numero_matricula, nombre, apellido, dni, domicilio, fecha_nac, especialidad, telefono, tiempo_consulta, deshabilitado)
        VALUES (${medico.ID_Medico}, ${medico.email}, ${hashedPassword}, ${medico.numero_matricula}, ${medico.nombre}, ${medico.apellido}, ${medico.dni}, ${medico.domicilio}, ${medico.fecha_nac}, ${medico.especialidad}, ${medico.telefono}, ${medico.tiempo_consulta}, ${medico.deshabilitado});
      `;
    }

    console.log(`Seeded medicos`);

  } catch (error) {
    console.error('Error seeding medicos:', error);
    throw error;
  }
}

// Función para insertar datos en la tabla intermedia "Es_paciente_de" (relación paciente - médico)
async function seedEsPacienteDe(client) {

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS es_paciente_de (
        ID_Paciente INT NOT NULL,
        ID_Medico INT NOT NULL,
        fecha_creacion DATE NOT NULL,
        deshabilitado BOOLEAN,
        
        PRIMARY KEY (ID_Paciente, ID_Medico),
        FOREIGN KEY (ID_Paciente) REFERENCES pacientes (ID_Paciente),
        FOREIGN KEY (ID_Medico) REFERENCES medicos (ID_Medico)
      );
    `;

    console.log(`Created "es_paciente_de" table`);

    for (const relacion of es_paciente_de) {
      await client.sql`
        INSERT INTO es_paciente_de (ID_Paciente, ID_Medico, fecha_creacion, deshabilitado)
        VALUES (${relacion.ID_Paciente}, ${relacion.ID_Medico}, ${relacion.fecha_creacion}, ${relacion.deshabilitado});
      `;
    }

    console.log(`Seeded es_paciente_de`);

  } catch (error) {
    console.error('Error seeding es_paciente_de:', error);
    throw error;
  }
}

// Función para insertar datos en la tabla "Cita"
async function seedCitas(client) {

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS citas (
        fecha DATE NOT NULL,
        ID_Medico INT NOT NULL,
        ID_Paciente INT NOT NULL,
        inicio TIME NOT NULL,
        deshabilitado BOOLEAN,
        
        PRIMARY KEY (fecha, ID_Medico, ID_Paciente),
        FOREIGN KEY (ID_Medico) REFERENCES medicos (ID_Medico),
        FOREIGN KEY (ID_Paciente) REFERENCES pacientes (ID_Paciente)
      );
    `;

    console.log(`Created "citas" table`);

    for (const cita of citas) {
      await client.sql`
        INSERT INTO citas (fecha, ID_Medico, ID_Paciente, inicio, deshabilitado)
        VALUES (${cita.fecha}, ${cita.ID_Medico}, ${cita.ID_Paciente}, ${cita.inicio}, ${cita.deshabilitado});
      `;
    }

    console.log(`Seeded citas`);

  } catch (error) {
    console.error('Error seeding citas:', error);
    throw error;
  }
}

async function seedFichaMedica(client) {

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS ficha_medica (
        ID_ficha SERIAL PRIMARY KEY,
        ID_Paciente INT NOT NULL,
        ID_Medico INT NOT NULL,
        alergias VARCHAR(255),
        diagnosticos VARCHAR(255),
        tratamientos VARCHAR(255),
        ultima_modificacion TIMESTAMP NOT NULL,
        medicamentos VARCHAR(255),
        deshabilitado BOOLEAN,

        FOREIGN KEY (ID_Paciente) REFERENCES pacientes(ID_Paciente),
        FOREIGN KEY (ID_Medico) REFERENCES medicos(ID_Medico)
      )
    `;

    console.log(`Created "ficha_medica" table`);

    for (const ficha of fichas_medicas) {
      await client.sql`
        INSERT INTO ficha_medica (ID_ficha, ID_Paciente, ID_Medico, alergias, diagnosticos, tratamientos, ultima_modificacion, medicamentos, deshabilitado)
        VALUES (${ficha.ID_ficha}, ${ficha.ID_Paciente}, ${ficha.ID_Medico}, ${ficha.alergias}, ${ficha.diagnosticos}, ${ficha.tratamientos}, ${ficha.ultima_modificacion}, ${ficha.medicamentos}, ${ficha.deshabilitado});
      `;
    }

    console.log(`Seeded ficha_medica`);

  } catch (error) {
    console.error('Error seeding ficha_medica:', error);
    throw error;
  }
}

// Función para insertar datos en la tabla "Horarios"
async function seedHorarios(client) {

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS horarios (
        ID_Horario SERIAL PRIMARY KEY,
        ID_Medico INT NOT NULL,
        dia VARCHAR(2) NOT NULL CHECK (dia IN ('L', 'Ma', 'Mi', 'J', 'V', 'S', 'D')),
        inicio TIME,
        fin TIME,
        FOREIGN KEY (ID_Medico) REFERENCES medicos(ID_Medico)
      );
    `;

    console.log(`Created "horarios" table`);

    for (const horario of horarios) {
      await client.sql`
        INSERT INTO horarios (ID_Horario, ID_Medico, dia, inicio, fin)
        VALUES (${horario.ID_Horario}, ${horario.ID_Medico}, ${horario.dia}, ${horario.inicio}, ${horario.fin});
      `;
    }

    console.log(`Seeded horarios`);

  } catch (error) {
    console.error('Error seeding horarios:', error);
    throw error;
  }
}

// Función para insertar datos en la tabla "Administradores"
async function seedAdministradores(client) {

  try {
    await client.sql`
      CREATE TABLE IF NOT EXISTS administradores (
        ID_Administrador SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        fecha_creacion DATE NOT NULL,
        deshabilitado BOOLEAN
      );
    `;

    console.log(`Created "administradores" table`);

    for (const admin of administradores) {
      const hashedPassword = await bcrypt.hash(admin.contraseña, 10);
      await client.sql`
        INSERT INTO administradores (ID_Administrador, email, contraseña, fecha_creacion, deshabilitado)
        VALUES (${admin.ID_Administrador}, ${admin.email}, ${hashedPassword}, ${admin.fecha_creacion}, ${admin.deshabilitado});
      `;
    }

    console.log(`Seeded administradores`);

  } catch (error) {
    console.error('Error seeding administradores:', error);
    throw error;
  }
}

// Función principal
async function main() {
  const client = await db.connect();

  await seedPacientes(client);
  await seedMedicos(client);
  await seedEsPacienteDe(client);
  await seedCitas(client);
  await seedFichaMedica(client);
  await seedHorarios(client);
  await seedAdministradores(client);
  // Llamadas adicionales para otras tablas...

  await client.end();
}

main().catch((err) => {
  console.error('An error occurred while attempting to seed the database:', err);
});