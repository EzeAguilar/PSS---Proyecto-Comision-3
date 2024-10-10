'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NewDoctorForm from "@/app/components/ui/newDoctorForm";
import { Button } from "@/app/components/ui/button";
import { Doctor, Horario } from "@/app/lib/utils";
import { insertDoctor } from "@/app/lib/data";
import HorarioForm from "@/app/components/ui/horariosForm";

type FormFieldValue = string | number;

const NewDoctorPage = () => {
    const [form, setForm] = useState<Doctor>({
        id_medico: 1000,
        email: "",
        contraseña: "",
        numero_matricula: undefined,
        nombre: "",
        apellido: "",
        dni: undefined,
        domicilio: "",
        fecha_nac: "",
        especialidad: "",
        telefono: undefined,
        tiempo_consulta: undefined,
        deshabilitado: false,
    });

    const [mostrarHorario, setMostrarHorario] = useState(false);
    const [horarios, setHorarios] = useState<Horario[]>([]);

    const handleInputChange = (field: keyof Doctor, value: FormFieldValue) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const allFieldsFilled = Object.values(form).every((field) => {
            if (typeof field === "string") {
                return field.trim() !== "";
            }
            return field !== undefined && field !== null;
        });

        if (!allFieldsFilled) {
            console.log("Por favor, complete todos los campos.");
            return;
        }
        console.log("Datos form antes del check", form);
        
        if (e.currentTarget.checkValidity()) {
            console.log("Datos del formulario:", form);
            console.log("Horarios", horarios);
        } else {
            console.log("Formulario no es válido");
        }

        insertDoctor(form, horarios);
    };

    const router = useRouter();

    return (
        <>
          {!mostrarHorario ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-10">
              <h1 className="text-xl">Registrar nuevo doctor</h1>
              <NewDoctorForm formData={form} handleInputChange={handleInputChange} insercion={true} />
              <div className="flex justify-center items-center gap-3">
                <Button
                  type="button"
                  className="bg-black text-white px-4 py-2 rounded-md"
                  onClick={() => setMostrarHorario(true)}
                >
                  Cargar horarios
                </Button>
                <Button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md"
                  onClick={() => router.push("/admin/doctors")}
                >
                  Guardar
                </Button>
                <Button
                  variant="destructive"
                  className="bg-gray-700 text-white px-4 py-2 rounded-md"
                  onClick={() => router.push("/admin/doctors")}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <HorarioForm
              onConfirm={(horarios) => {
                setHorarios(horarios);
                setMostrarHorario(false);
              }}
              onCancel={() => setMostrarHorario(false)}
            />
          )}
        </>
      );
};


export default NewDoctorPage;