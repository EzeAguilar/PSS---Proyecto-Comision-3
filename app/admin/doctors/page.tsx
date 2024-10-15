'use client'

import { Button } from "@/app/components/ui/button";
import { searchDoctors, deleteDoctor, fetchAllDoctors } from "@/app/lib/data";
import { Doctor, PATH_OPTIONS } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const DoctorsPage = () => {
  const router = useRouter();
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [showDisabled, setShowDisabled] = useState(false);
  const [showConfirmMessage, setShowConfirmMessage] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);

  useEffect(() => {
    const loadDoctors = async () => {
      const allDoctors = await fetchAllDoctors();
      const filtered = allDoctors.filter(doctor => doctor.deshabilitado === showDisabled);
      setFilteredDoctors(filtered);
    };
    loadDoctors();
  }, [showDisabled]);

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

  const handleConfirm = (doctorId: number | undefined) => {
    setSelectedDoctorId(doctorId ?? null); // Almacena el doctor a eliminar
    setShowConfirmMessage(true); // Muestra el modal
  };

  const handleDeleteDoctor = async () => {
    if (selectedDoctorId !== null) {
      await deleteDoctor(selectedDoctorId);
      const updatedDoctors = await fetchAllDoctors();
      const filtered = updatedDoctors.filter(doctor => doctor.deshabilitado === showDisabled);
      setFilteredDoctors(filtered);
      setShowConfirmMessage(false); // Oculta el modal después de eliminar
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <h1 className="text-3xl mr-44">Medicos</h1>

        {/* Barra de búsqueda */}
        <div className="flex items-center w-1/2 mr-36">
          <input
            type="text"
            placeholder="Buscar médico..."
            className="border border-gray-300 rounded-lg p-2 flex-grow focus:outline-none focus:border-blue-500"
            onChange={(e) => handleSearch(e.target.value)} // Función para manejar búsqueda
          />
        </div>

        {/* Botón agregar */}
        <Button
          size="lg"
          variant="default"
          className="bg-red-500 text-white text-[1.3rem] px-10 h-12 flex items-center rounded-lg" // Botón más ovalado
          onClick={() => handleNavigation(PATH_OPTIONS.newDoctor)}
        >
          Agregar
        </Button>
      </div>
      <div className="flex items-center gap-4 mt-4">
        <label htmlFor="showDisabled">Mostrar deshabilitados</label>
        <input
          type="checkbox"
          id="showDisabled"
          checked={showDisabled}
          onChange={() => setShowDisabled(!showDisabled)}
        />
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
              <th className="px-4 py-2 border">Deshabilitado</th>
            </tr>
          </thead>
          <tbody>
            {filteredDoctors.map((medico) => (
                <tr
                    key={medico.id_medico}
                    onClick={() => handleNavigation(`/admin/doctor-information/${medico.id_medico}`)}
                    className="cursor-pointer"
                >
                  <td className="px-4 py-2 border">{medico.nombre}</td>
                  <td className="px-4 py-2 border">{medico.apellido}</td>
                  <td className="px-4 py-2 border">{medico.dni}</td>
                  <td className="px-4 py-2 border">{medico.domicilio}</td>
                  <td className="px-4 py-2 border">{medico.telefono}</td>
                  <td className="px-4 py-2 border">{medico.deshabilitado ? "Sí" : "No"}</td>
                  {!showDisabled && (
                      <td className="px-4 py-2 flex space-x-4">
                        <FaEdit
                            className="text-black cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              editDoctor(medico.id_medico);
                            }}
                        />
                        <FaTrash
                            className="text-black cursor-pointer"
                            onClick={(event) => {
                              event.stopPropagation();
                              handleConfirm(medico.id_medico)
                            }}
                        />
                      </td>
                  )}
                </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showConfirmMessage && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-gray-100 p-6 rounded-lg">
            <p className="text-lg mb-4">¿Seguro que desea eliminar al médico seleccionado?</p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="default"
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => setShowConfirmMessage(false)} // Cierra el modal sin eliminar
              >
                Cancelar
              </Button>
              <Button
                variant="default"
                className="bg-black text-white px-4 py-2 rounded"
                onClick={handleDeleteDoctor} // Confirma la eliminación
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorsPage;