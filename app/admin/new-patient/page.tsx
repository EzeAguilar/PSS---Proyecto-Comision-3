'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import NewPatientForm from "@/app/components/ui/newPatientForm";
import { Button } from "@/app/components/ui/button";
import { NewPatientFormData } from "@/app/lib/utils";

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

    const handleInputChange = (field: any, value: any) => {
        setForm((prevForm) => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const allFieldsFilled = Object.values(form).every(field => field.trim() !== '');

        if (!allFieldsFilled) {
            console.log("Por favor, complete todos los campos.");
            return;
        }
    
        if (e.target.checkValidity()) {
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
