'use client'

import { Button } from "@/app/components/ui/button"
import { searchDoctors, fetchAllDoctors } from "@/app/lib/data"
import { Doctor, PATH_OPTIONS } from "@/app/lib/utils"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react"
import {toast}

export default function DoctorsPage() {
  const router = useRouter()
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([])
  const [isDeleting, setIsDeleting] = useState(false)

  const loadDoctors = useCallback(async () => {
    const allDoctors = await fetchAllDoctors()
    setFilteredDoctors(allDoctors)
  }, [])

  useEffect(() => {
    loadDoctors()
  }, [loadDoctors])

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleSearch = async (value: string) => {
    if (value.length > 0) {
      const results = await searchDoctors(value)
      setFilteredDoctors(results)
    } else {
      loadDoctors()
    }
  }

  const editDoctor = (id: number | undefined) => {
    const doctorId = id ?? 0
    handleNavigation(`${PATH_OPTIONS.editDoctor}/${doctorId}`)
  }

  const deleteDoctor = useCallback(async (id: number | undefined) => {
    if (!id) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/doctors/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete doctor')
      }

      await loadDoctors() // Refresh the list after successful deletion
      toast({
        title: "Doctor eliminado",
        description: "El médico ha sido eliminado exitosamente.",
      })
    } catch (error) {
      console.error('Error deleting doctor:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el médico. Por favor, intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }, [loadDoctors])

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center gap-10">
        <h1 className="text-xl font-semibold">Médicos</h1>
        <div className="flex items-center w-1/2">
          <input
            type="text"
            placeholder="Buscar médico..."
            className="border p-2 rounded-md w-full"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <Button
          size="lg"
          variant="default"
          className="bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleNavigation(PATH_OPTIONS.newDoctor)}
        >
          Agregar
        </Button>
      </div>
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
              <tr key={medico.ID_Medico}>
                <td className="px-4 py-2 border">{medico.nombre}</td>
                <td className="px-4 py-2 border">{medico.apellido}</td>
                <td className="px-4 py-2 border">{medico.dni}</td>
                <td className="px-4 py-2 border">{medico.domicilio}</td>
                <td className="px-4 py-2 border">{medico.telefono}</td>
                <td className="px-4 py-2 border text-center">
                  <Button  
                    className="bg-blue-600 text-white px-12 py-2 rounded-md"
                    onClick={() => editDoctor(medico.id_Medico)}
                  >
                    Editar
                  </Button>
                </td>
                <td className="px-4 py-2 border text-center">
                  <Button 
                    className="bg-red-600 text-white px-12 py-2 rounded-md"
                    onClick={() => deleteDoctor(medico.id_medico)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar'}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}