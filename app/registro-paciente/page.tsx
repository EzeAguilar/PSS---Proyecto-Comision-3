'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NewPatientForm from "@/app/components/ui/newPatientForm";
import { Button } from "@/app/components/ui/button";
import { Patient } from "@/app/lib/utils";
import { insertPatient } from "@/app/lib/data";

type FormFieldValue = string | number;

const NewPatientPage = () => {
    const [form, setForm] = useState<Patient>({
        id_paciente: 1000, //dejarlo así en 1000 hardcodeado para que funcione
        dni: undefined,
        nombre: "",
        apellido: "",
        telefono: undefined,
        domicilio: "",
        fecha_nac: "",
        email: "",
        contraseña: "",
        deshabilitado: false
    });

    const handleInputChange = (field: keyof Patient, value: FormFieldValue) => {
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

        insertPatient(form);
    };

    const router = useRouter();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1 className="text-xl text-center pt-8 text-[1.8rem]">Registro de pacientes</h1>
            <NewPatientForm formData={form} handleInputChange={handleInputChange} insercion={true} />
            <div className="flex justify-center items-center gap-3">
                <Button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={() => router.push('/')}
                >
                    Guardar
                </Button>
                <Button
                    variant="destructive"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md"
                    onClick={() => router.push('/')}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
};


export default NewPatientPage;
