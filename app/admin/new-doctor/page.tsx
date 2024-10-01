'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NewDoctorForm from "@/app/components/ui/newDoctorForm";
import { Button } from "@/app/components/ui/button";
import { Doctor } from "@/app/lib/utils";
import { insertDoctor } from "@/app/lib/data";

type FormFieldValue = string | number;

const NewDoctorPage = () => {
    const [form, setForm] = useState<Doctor>({
        ID_Medico: 1000,
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
        deshabilitado: true,
    });

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
    
        if (e.currentTarget.checkValidity()) {
            console.log("Datos del formulario:", form);
        } else {
            console.log("Formulario no es válido");
        }

        insertDoctor(form);
    };

    const router = useRouter();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1 className="text-xl">Registrar nuevo doctor</h1>
            <NewDoctorForm formData={form} handleInputChange={handleInputChange} />
            <div className="flex justify-center items-center gap-3">
                <Button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                >
                    Guardar
                </Button>
                <Button
                    variant="destructive"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md"
                    onClick={() => router.push('/admin/doctors')}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
};


export default NewDoctorPage;