'use client';

import { useState, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import NewPatientForm from "@/app/components/ui/newPatientForm";
import { Patient } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { updatePatient } from "@/app/lib/data";

type FormFieldValue = string | number;

interface EditPatientClientPageProps {
    patientData: Patient;
}

const EditPatientClientPage = ({ patientData }: EditPatientClientPageProps) => {
    const router = useRouter();

    const [formData, setFormData] = useState<Patient>({
        ID_Paciente: patientData.ID_Paciente ,
        dni: patientData.dni,
        nombre: patientData.nombre,
        apellido: patientData.apellido,
        telefono: patientData.telefono,
        domicilio: patientData.domicilio,
        fecha_nac: patientData.fecha_nac,
        email: patientData.email,
        contraseña: patientData.contraseña,
        deshabilitado: false,
    });

    const handleInputChange = (field: keyof Patient, value: FormFieldValue) => {
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

        updatePatient(formData);
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