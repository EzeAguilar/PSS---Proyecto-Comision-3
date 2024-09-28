// Paciente
const pacientes = [
    {
      ID_Paciente: 1,
      email: "juan.perez@mail.com",
      contraseña: "password123",
      nombre: "Juan",
      apellido: "Perez",
      domicilio: "Calle Falsa 123",
      telefono: 1234567890,
      fecha_nac: "1990-04-12",
      deshabilitado: false
    },
    {
      ID_Paciente: 2,
      email: "maria.gomez@mail.com",
      contraseña: "mariaPass456",
      nombre: "Maria",
      apellido: "Gomez",
      domicilio: "Avenida Siempre Viva 742",
      telefono: 1234567891,
      fecha_nac: "1988-08-22",
      deshabilitado: false
    },
    {
      ID_Paciente: 3,
      email: "carlos.lopez@mail.com",
      contraseña: "carlos789",
      nombre: "Carlos",
      apellido: "Lopez",
      domicilio: "Calle Luna 333",
      telefono: 1234567892,
      fecha_nac: "1985-03-14",
      deshabilitado: false
    },
    {
      ID_Paciente: 4,
      email: "ana.martinez@mail.com",
      contraseña: "ana123",
      nombre: "Ana",
      apellido: "Martinez",
      domicilio: "Calle Sol 456",
      telefono: 1234567893,
      fecha_nac: "1992-11-30",
      deshabilitado: false
    },
    {
      ID_Paciente: 5,
      email: "luis.sanchez@mail.com",
      contraseña: "luispass123",
      nombre: "Luis",
      apellido: "Sanchez",
      domicilio: "Avenida Libertad 123",
      telefono: 1234567894,
      fecha_nac: "1995-05-10",
      deshabilitado: false
    }
  ];
  
  // Médico
  const medicos = [
    {
      ID_Medico: 1,
      email: "medico1@mail.com",
      contraseña: "medicoPass123",
      numero_matricula: 1111,
      nombre: "Dr. Pedro",
      apellido: "Rodriguez",
      dni: 12345678,
      domicilio: "Calle Doctor 123",
      telefono: 9876543210,
      fecha_nac: "1975-01-15",
      especialidad: "Cardiología",
      tiempo_consulta: 30,
      deshabilitado: false
    },
    {
      ID_Medico: 2,
      email: "medico2@mail.com",
      contraseña: "medicoPass456",
      numero_matricula: 2222,
      nombre: "Dra. Lucia",
      apellido: "Fernandez",
      dni: 87654321,
      domicilio: "Avenida Salud 456",
      telefono: 9876543211,
      fecha_nac: "1980-06-20",
      especialidad: "Pediatría",
      tiempo_consulta: 25,
      deshabilitado: false
    },
    {
      ID_Medico: 3,
      email: "medico3@mail.com",
      contraseña: "medicoPass789",
      numero_matricula: 3333,
      nombre: "Dr. Carlos",
      apellido: "Garcia",
      dni: 11223344,
      domicilio: "Calle Hospital 789",
      telefono: 9876543212,
      fecha_nac: "1982-02-12",
      especialidad: "Neurología",
      tiempo_consulta: 40,
      deshabilitado: false
    },
    {
      ID_Medico: 4,
      email: "medico4@mail.com",
      contraseña: "medicoPass101",
      numero_matricula: 4444,
      nombre: "Dra. Andrea",
      apellido: "Lopez",
      dni: 55667788,
      domicilio: "Avenida Doctor 101",
      telefono: 9876543213,
      fecha_nac: "1978-09-25",
      especialidad: "Ginecología",
      tiempo_consulta: 30,
      deshabilitado: false
    },
    {
      ID_Medico: 5,
      email: "medico5@mail.com",
      contraseña: "medicoPass202",
      numero_matricula: 5555,
      nombre: "Dr. Javier",
      apellido: "Martinez",
      dni: 99887766,
      domicilio: "Calle Sanidad 202",
      telefono: 9876543214,
      fecha_nac: "1985-04-10",
      especialidad: "Dermatología",
      tiempo_consulta: 20,
      deshabilitado: false
    }
  ];
  
  // Cita
  const citas = [
    {
      fecha: "2024-09-27",
      ID_Medico: 1,
      ID_Paciente: 1,
      inicio: "10:00",
      deshabilitado: false
    },
    {
      fecha: "2024-09-28",
      ID_Medico: 2,
      ID_Paciente: 2,
      inicio: "11:00",
      deshabilitado: false
    },
    {
      fecha: "2024-09-29",
      ID_Medico: 3,
      ID_Paciente: 3,
      inicio: "09:30",
      deshabilitado: false
    },
    {
      fecha: "2024-09-30",
      ID_Medico: 4,
      ID_Paciente: 4,
      inicio: "08:00",
      deshabilitado: false
    },
    {
      fecha: "2024-10-01",
      ID_Medico: 5,
      ID_Paciente: 5,
      inicio: "12:30",
      deshabilitado: false
    }
  ];
  
  // Ficha médica
  const fichas_medicas = [
    {
      ID_ficha: 1,
      ID_Paciente: 1,
      ID_Medico: 1,
      alergias: "Ninguna",
      diagnosticos: "Hipertensión",
      tratamientos: "Dieta baja en sodio",
      ultima_modificacion: "2024-09-27T10:30:00",
      medicamentos: "Lisinopril",
      deshabilitado: false
    },
    {
      ID_ficha: 2,
      ID_Paciente: 2,
      ID_Medico: 2,
      alergias: "Penicilina",
      diagnosticos: "Asma",
      tratamientos: "Inhalador",
      ultima_modificacion: "2024-09-28T11:30:00",
      medicamentos: "Albuterol",
      deshabilitado: false
    },
    {
      ID_ficha: 3,
      ID_Paciente: 3,
      ID_Medico: 3,
      alergias: "Polen",
      diagnosticos: "Migraña",
      tratamientos: "Ejercicio regular",
      ultima_modificacion: "2024-09-29T09:00:00",
      medicamentos: "Ibuprofeno",
      deshabilitado: false
    },
    {
      ID_ficha: 4,
      ID_Paciente: 4,
      ID_Medico: 4,
      alergias: "Ninguna",
      diagnosticos: "Anemia",
      tratamientos: "Suplementos de hierro",
      ultima_modificacion: "2024-09-30T08:30:00",
      medicamentos: "Hierro",
      deshabilitado: false
    },
    {
      ID_ficha: 5,
      ID_Paciente: 5,
      ID_Medico: 5,
      alergias: "Mariscos",
      diagnosticos: "Dermatitis",
      tratamientos: "Cremas hidratantes",
      ultima_modificacion: "2024-10-01T12:00:00",
      medicamentos: "Corticoides tópicos",
      deshabilitado: false
    }
  ];
  
  // Administrador
  const administradores = [
    {
      ID_Administrador: 1,
      email: "admin1@mail.com",
      contraseña: "admin123",
      fecha_creacion: "2023-01-01",
      deshabilitado: false
    },
    {
      ID_Administrador: 2,
      email: "admin2@mail.com",
      contraseña: "admin456",
      fecha_creacion: "2023-02-15",
      deshabilitado: false
    },
    {
      ID_Administrador: 3,
      email: "admin3@mail.com",
      contraseña: "admin789",
      fecha_creacion: "2023-03-20",
      deshabilitado: false
    },
    {
      ID_Administrador: 4,
      email: "admin4@mail.com",
      contraseña: "admin101",
      fecha_creacion: "2023-04-10",
      deshabilitado: false
    },
    {
      ID_Administrador: 5,
      email: "admin5@mail.com",
      contraseña: "admin202",
      fecha_creacion: "2023-05-05",
      deshabilitado: false
    }
  ];
  
  // Es_paciente_de
  const es_paciente_de = [
    {
      ID_Paciente: 1,
      ID_Medico: 1,
      fecha_creacion: "2024-09-01",
      deshabilitado: false
    },
    {
      ID_Paciente: 2,
      ID_Medico: 2,
      fecha_creacion: "2024-09-02",
      deshabilitado: false
    },
    {
      ID_Paciente: 3,
      ID_Medico: 3,
      fecha_creacion: "2024-09-03",
      deshabilitado: false
    },
    {
      ID_Paciente: 4,
      ID_Medico: 4,
      fecha_creacion: "2024-09-04",
      deshabilitado: false
    },
    {
      ID_Paciente: 5,
      ID_Medico: 5,
      fecha_creacion: "2024-09-05",
      deshabilitado: false
    }
  ];
  
  // Horario
  const horarios = [
    {
      ID_Horario: 1,
      ID_Medico: 1,
      dia: "L",
      inicio: "08:00",
      fin: "12:00"
    },
    {
      ID_Horario: 2,
      ID_Medico: 2,
      dia: "Ma",
      inicio: "09:00",
      fin: "13:00"
    },
    {
      ID_Horario: 3,
      ID_Medico: 3,
      dia: "Mi",
      inicio: "10:00",
      fin: "14:00"
    },
    {
      ID_Horario: 4,
      ID_Medico: 4,
      dia: "J",
      inicio: "08:00",
      fin: "12:00"
    },
    {
      ID_Horario: 5,
      ID_Medico: 5,
      dia: "V",
      inicio: "09:00",
      fin: "13:00"
    }
  ];
  
  // Exportamos todos los datos
  module.exports = {
    pacientes,
    medicos,
    citas,
    fichas_medicas,
    administradores,
    es_paciente_de,
    horarios
  };

  
  