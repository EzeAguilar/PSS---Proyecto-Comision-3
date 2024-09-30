'use client';

import { useState, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import NewPatientForm from "@/app/components/ui/newPatientForm";
import { Patient } from "@/app/lib/types";
import { NewPatientFormData } from "@/app/lib/utils";
import { useRouter } from "next/navigation";

type FormFieldValue = string | number;

interface EditPatientClientPageProps {
    patientData: Patient;
}

const EditPatientClientPage = ({ patientData }: EditPatientClientPageProps) => {
    const router = useRouter();

    const [formData, setFormData] = useState<NewPatientFormData>({
        name: patientData.nombre || "",
        dni: patientData.ID_Paciente /* TODO: change this for the dni*/ || undefined,
        lastName: patientData.apellido || "",
        phone: patientData.telefono || undefined,
        address: patientData.domicilio || "",
        birthDate: patientData.fecha_nac || "",
        email: patientData.email || "",
        password: "",
    });

    const handleInputChange = (field: keyof NewPatientFormData, value: FormFieldValue) => {
        setFormData((prevForm) => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const allFieldsFilled = Object.values(formData).every((field) => {
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
            console.log("Datos del formulario:", formData);
        } else {
            console.log("Formulario no es válido");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1>Edit Patient (Client Component)</h1>
            <NewPatientForm formData={formData} handleInputChange={handleInputChange} />
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

export default EditPatientClientPage;