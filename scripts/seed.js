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
        ID_paciente SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        domicilio VARCHAR(255),
        telefono INT,
        fecha_nac DATE,
        deshabilitado BOOLEAN
      );
    `;

    console.log(`Created "pacientes" table`);

    for (const paciente of pacientes) {
      const hashedPassword = await bcrypt.hash(paciente.contraseña, 10);
      await client.sql`
        INSERT INTO pacientes (email, contraseña, nombre, apellido, domicilio, telefono, fecha_nac, deshabilitada)
        VALUES (${paciente.email}, ${hashedPassword}, ${paciente.nombre}, ${paciente.apellido}, ${paciente.domicilio}, ${paciente.telefono}, ${paciente.fecha_nac}, ${paciente.deshabilitada});
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
        ID_medico SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        numero_matricula INT NOT NULL,
        nombre VARCHAR(255) NOT NULL,
        apellido VARCHAR(255) NOT NULL,
        DNI INT NOT NULL,
        domicilio VARCHAR(255),
        fecha_nac DATE,
        especialidad VARCHAR(255),
        telefono INT,
        tiempo_consulta INT,
        deshabilitado BOOLEAN
      );
    `;

    console.log(`Created "medicos" table`);

    for (const medico of medicos) {
      const hashedPassword = await bcrypt.hash(medico.contraseña, 10);
      await client.sql`
        INSERT INTO medicos (email, contraseña, numero_matricula, nombre, apellido, DNI, domicilio, fecha_nac, especialidad, telefono, tiempo_consulta, deshabilitada)
        VALUES (${medico.email}, ${hashedPassword}, ${medico.numero_matricula}, ${medico.nombre}, ${medico.apellido}, ${medico.DNI}, ${medico.domicilio}, ${medico.fecha_nac}, ${medico.especialidad}, ${medico.telefono}, ${medico.tiempo_consulta}, ${medico.deshabilitada});
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
        ID_paciente INT NOT NULL,
        ID_medico INT NOT NULL,
        fecha_creacion DATE NOT NULL,
        deshabilitado BOOLEAN,
        
        PRIMARY KEY (ID_paciente, ID_medico),
        FOREIGN KEY (ID_paciente) REFERENCES pacientes (ID_paciente),
        FOREIGN KEY (ID_medico) REFERENCES medicos (ID_medico)
      );
    `;

    console.log(`Created "es_paciente_de" table`);

    for (const relacion of es_paciente_de) {
      await client.sql`
        INSERT INTO es_paciente_de (ID_paciente, ID_medico, fecha_creacion, deshabilitada)
        VALUES (${relacion.ID_paciente}, ${relacion.ID_medico}, ${relacion.fecha_creacion}, ${relacion.deshabilitada});
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
        ID_medico INT NOT NULL,
        ID_paciente INT NOT NULL,
        inicio TIME NOT NULL,
        deshabilitado BOOLEAN,
        
        PRIMARY KEY (fecha, ID_medico, ID_paciente),
        FOREIGN KEY (ID_medico) REFERENCES medicos (ID_medico),
        FOREIGN KEY (ID_paciente) REFERENCES pacientes (ID_paciente)
      );
    `;

    console.log(`Created "citas" table`);

    for (const cita of citas) {
      await client.sql`
        INSERT INTO citas (fecha, ID_medico, ID_paciente, inicio, deshabilitada)
        VALUES (${cita.fecha}, ${cita.ID_medico}, ${cita.ID_paciente}, ${cita.inicio}, ${cita.deshabilitada});
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
        ID_paciente INT NOT NULL,
        peso INT,
        altura INT,
        alergias VARCHAR(255),
        enfermedades VARCHAR(255),
        medicacion_actual VARCHAR(255),
        grupo_sanguineo VARCHAR(10),
        fecha_creacion DATE NOT NULL,
        FOREIGN KEY (ID_paciente) REFERENCES pacientes(ID_paciente)
      );
    `;

    console.log(`Created "ficha_medica" table`);

    for (const ficha of fichas_medicas) {
      await client.sql`
        INSERT INTO ficha_medica (ID_paciente, peso, altura, alergias, enfermedades, medicacion_actual, grupo_sanguineo, fecha_creacion)
        VALUES (${ficha.ID_paciente}, ${ficha.peso}, ${ficha.altura}, ${ficha.alergias}, ${ficha.enfermedades}, ${ficha.medicacion_actual}, ${ficha.grupo_sanguineo}, ${ficha.fecha_creacion});
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
        ID_horario SERIAL PRIMARY KEY,
        ID_medico INT NOT NULL,
        dia_semana VARCHAR(20),
        hora_inicio TIME,
        hora_fin TIME,
        FOREIGN KEY (ID_medico) REFERENCES medicos(ID_medico)
      );
    `;

    console.log(`Created "horarios" table`);

    for (const horario of horarios) {
      await client.sql`
        INSERT INTO horarios (ID_medico, dia_semana, hora_inicio, hora_fin)
        VALUES (${horario.ID_medico}, ${horario.dia_semana}, ${horario.hora_inicio}, ${horario.hora_fin});
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
        ID_administrador SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        contraseña VARCHAR(255) NOT NULL,
        fecha DATE NOT NULL,
        deshabilitado BOOLEAN
      );
    `;

    console.log(`Created "administradores" table`);

    for (const admin of administradores) {
      const hashedPassword = await bcrypt.hash(admin.contraseña, 10);
      await client.sql`
        INSERT INTO administradores (email, contraseña, nombre, apellido)
        VALUES (${admin.email}, ${hashedPassword}, ${admin.nombre}, ${admin.apellido});
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