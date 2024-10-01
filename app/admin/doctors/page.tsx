'use client'

import { Button } from "@/app/components/ui/button";
import { searchDoctors, deleteDoctor, fetchAllDoctors } from "@/app/lib/data";
import { Doctor, PATH_OPTIONS } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const DoctorsPage = () => {
  const router = useRouter();
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);


  useEffect(() => {
    const loadDoctors = async () => {
      const allDoctors = await fetchAllDoctors();
      console.log("Datos de todos los doctores:", allDoctors); // Imprime todos los datos de los doctores
      setFilteredDoctors(allDoctors);
      console.log(allDoctors[0].id_medico);
    };
    loadDoctors();
  }, []);

  // Maneja la navegación a la página de creación de doctores
  const handleNavigation = (path: string) => {
    router.push(path);
  }

  // Función para manejar la búsqueda de médicos
  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      const results = await searchDoctors(value);
      setFilteredDoctors(results);
    } else if (value.length === 0) {
      const allDoctors = await fetchAllDoctors();
      setFilteredDoctors(allDoctors); // Mostrar todos los médicos si no hay búsqueda
    }
  };

  
  // Función para editar un doctor
  const editDoctor = (id: number | undefined) => {
    const doctorId = id ?? 0; // Usa 0 u otro valor predeterminado si id es undefined
    handleNavigation(`${PATH_OPTIONS.editDoctor}/${doctorId}`);
  };

  const handleDeleteDoctor = async (doctorId: number | undefined) => {
    console.log("Deleting doctor with ID:", doctorId); // Verifica que el ID se está pasando correctamente
    await deleteDoctor(doctorId);
    const updatedDoctors = await fetchAllDoctors();
    setFilteredDoctors(updatedDoctors);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Encabezado con barra de búsqueda y botón */}
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-xl font-semibold">Médicos</h1>

        {/* Barra de búsqueda */}
        <div className="flex items-center w-1/2">
          <input
            type="text"
            placeholder="Buscar médico..."
            className="border p-2 rounded-md w-full"
            onChange={(e) => handleSearch(e.target.value)} // Función para manejar búsqueda
          />
        </div>

        {/* Botón agregar */}
        <Button
          size="lg"
          variant="default"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleNavigation(PATH_OPTIONS.newDoctor)}
        >
          Agregar
        </Button>
      </div>

      {/* Tabla de médicos */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr>
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Apellido</th>
              <th className="px-4 py-2 border">DNI</th>
              <th className="px-4 py-2 border">Domicilio</th>
              <th className="px-4 py-2 border">Teléfono</th>
              <th className="px-4 py-2 border">Editar</th>
              <th className="px-4 py-2 border">Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((medico) => (
              <tr key={medico.id_medico}>
                <td className="px-4 py-2 border">{medico.nombre}</td>
                <td className="px-4 py-2 border">{medico.apellido}</td>
                <td className="px-4 py-2 border">{medico.dni}</td>
                <td className="px-4 py-2 border">{medico.domicilio}</td>
                <td className="px-4 py-2 border">{medico.telefono}</td>
                <td className="px-4 py-2 border text-center">
                  <Button  
                  className="bg-blue-600 text-white px-12 py-2 rounded-md"
                  onClick={() => editDoctor(medico.id_medico)}>Editar</Button>
                </td>
                <td className="px-4 py-2 border text-center">
                  <Button 
                   className="bg-red-600 text-white px-12 py-2 rounded-md"
                  
                  onClick={() => handleDeleteDoctor(medico.id_medico)}>Eliminar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DoctorsPage;