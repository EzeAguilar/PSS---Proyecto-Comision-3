'use client'
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {Horario, diasSemana} from "@/app/lib/utils";

const HorarioForm = ({ onConfirm, onCancel }: { onConfirm: (horarios: Horario[]) => void; onCancel: () => void }) => {
  const [horarios, setHorarios] = useState<Horario[]>(
    diasSemana.map(dia => ({ dia: dia.dia, inicio: "", fin: "", activo: false }))
  );

  const handleCheckboxChange = (index: number, value: boolean) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = { ...nuevosHorarios[index], ["activo"]: value };
    if (value == false){
        nuevosHorarios[index] = { ...nuevosHorarios[index], ["inicio"]: "", ["fin"]: ""};
    }
    setHorarios(nuevosHorarios);
  };

  const handleHorarioChange = (index: number, field: 'inicio' | 'fin', value: string) => {
    const nuevosHorarios = [...horarios];
    nuevosHorarios[index] = { ...nuevosHorarios[index], [field]: value };
    console.log(value);
    setHorarios(nuevosHorarios);
  };

  const handleConfirm = () => {
    const horariosValidos: Horario[] = [];
    let error = false;

    horarios.forEach((horario) => {
        if (horario.activo && !error) {
            if ((horario.inicio && !horario.fin) || (!horario.inicio && horario.fin)){
                error = true;
            } else if (horario.inicio && horario.fin) {
                if (horario.fin <= horario.inicio) {
                    error = true;
                } else {
                    horariosValidos.push(horario);
                }
            }
        }
    });

    if (!error) {
        console.log(horariosValidos);
        onConfirm(horariosValidos); // Aquí enviarías los horarios válidos
    }
    else{
        alert(`Error: los horarios deben estar completos con inicio y final válidos`);
    }
  };

  return (
    <div className="border p-4 rounded-md shadow-md">
      <h2 className="text-xl mb-4">Cargar horario</h2>
      <div className="grid grid-cols-3 gap-4">
        {diasSemana.map((dia, index) => (
          <div key={dia.dia} className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={horarios[index].activo}
              onChange={(e) => handleCheckboxChange(index, e.target.checked)}
            />
            <label className="w-20">{dia.nombre}:</label>
            <input
              type="time"
              value={horarios[index].inicio}
              disabled={!horarios[index].activo}
              className={`p-2 border rounded-md w-24 ${
                !horarios[index].activo ? 'bg-gray-200' : ''
              }`}
              onChange={(e) => handleHorarioChange(index, 'inicio', e.target.value)}
            />
            <span>-</span>
            <input
              type="time"
              value={horarios[index].fin}
              disabled={!horarios[index].activo}
              className={`p-2 border rounded-md w-24 ${
                !horarios[index].activo ? 'bg-gray-200' : ''
              }`}
              onChange={(e) => handleHorarioChange(index, 'fin', e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end gap-4 mt-4">
        <Button className="bg-red-600 text-white px-4 py-2 rounded-md" onClick={onCancel}>
          Cancelar
        </Button>
        <Button className="bg-gray-700 text-white px-4 py-2 rounded-md" onClick={handleConfirm}>
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default HorarioForm;
