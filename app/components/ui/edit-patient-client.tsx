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
        id_paciente: patientData.id_paciente ,
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

        console.log(formData);

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

    const handleSaveClick = async () => {
        try {
            console.log("Guardando paciente...", formData);
            await updatePatient(formData);
            console.log("Paciente actualizado correctamente");
            router.push('/admin/');
        } catch (error) {
            console.error("Error al actualizar el paciente:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1>Editar Paciente</h1>
            <NewPatientForm formData={formData} handleInputChange={handleInputChange} insercion={false}/>
            <div className="flex justify-center items-center gap-3">
                <Button
                    type="submit"
                    className="bg-red-600 text-white px-4 py-2 rounded-md"
                    onClick={handleSaveClick}
                >
                    Guardar
                </Button>
                <Button
                    variant="destructive"
                    className="bg-gray-700 text-white px-4 py-2 rounded-md"
                    onClick={() => router.push('/admin/')}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default EditPatientClientPage;