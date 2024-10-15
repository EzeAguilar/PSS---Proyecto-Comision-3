'use client'
import { useEffect, useState } from "react";
import { Horario, diasSemana } from "@/app/lib/utils";
import { fetchHorarios } from "@/app/lib/data";


interface HorarioProps {
  idMedico?: number;
  onClose: () => void;
}
const HorarioPanel = ({ idMedico, onClose }: HorarioProps) => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (idMedico === undefined) return; // Verificar que idMedico está definido

    const obtenerHorarios = async () => {
      try {
        const horariosObtenidos = await fetchHorarios(idMedico);
        setHorarios(horariosObtenidos);
      } catch (error) {
        console.error("Error al obtener los horarios:", error);
      } finally {
        setIsLoading(false);
      }
    };

    obtenerHorarios();
  }, [idMedico]);

  if (isLoading) {
    return <p>Cargando horarios...</p>;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-gray-100 rounded-lg p-6 relative w-[90%] max-w-md shadow-lg">
            <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onClose}
                aria-label="Cerrar"
            >
                ✕
            </button>
            <h2 className="text-xl font-semibold text-center mb-4">Horarios de atención</h2>
            <div className="space-y-2">
              {horarios.length > 0 ? (
                horarios.map((horario) => {
                  const nombreDia = diasSemana.find(d => d.dia === horario.dia)?.nombre || horario.dia;
                  const inicioFormatted = horario.inicio.slice(0, 5); // Elimina los segundos
                  const finFormatted = horario.fin.slice(0, 5);       // Elimina los segundos
                  return (
                    <p key={horario.dia}>
                      {nombreDia}: {inicioFormatted} - {finFormatted}
                    </p>
                  );
                })
              ) : (
                <p className="text-center text-gray-500">No hay horarios disponibles.</p>
              )}
            </div>
        </div>
    </div>
);
};

export default HorarioPanel;