'use client'

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import NewPatientForm from "@/app/components/ui/newPatientForm";
import { Button } from "@/app/components/ui/button";
import { NewPatientFormData } from "@/app/lib/utils";

type FormFieldValue = string | number;

const NewPatientPage = () => {
    const [form, setForm] = useState<NewPatientFormData>({
        name: "",
        dni: undefined,
        lastName: "",
        phone: undefined,
        address: "",
        birthDate: "",
        email: "",
        password: "",
    });

    const handleInputChange = (field: keyof NewPatientFormData, value: FormFieldValue) => {
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
    };

    const router = useRouter();

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1 className="text-xl">Registrar nuevo paciente</h1>
            <NewPatientForm formData={form} handleInputChange={handleInputChange} />
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
                    onClick={() => router.push('/admin/patients')}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
};


export default NewPatientPage;
