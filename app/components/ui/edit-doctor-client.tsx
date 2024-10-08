'use client';

import { useState, FormEvent, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import NewDoctorForm from "@/app/components/ui/newDoctorForm";
import { Doctor } from "@/app/lib/utils";
import { useRouter } from "next/navigation";
import { editDoctor } from "@/app/lib/data";

type FormFieldValue = string | number;

interface EditDoctorClientPageProps {
    medicoData: Doctor;
}

const EditDoctorClientPage = ({ medicoData }: EditDoctorClientPageProps) => {
    const router = useRouter();

    const formatDateToDisplay = (dateString: string) => {
        const dateParts = dateString.split('-');
        if (dateParts.length === 3) {
            return `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`; // Formato DD/MM/YYYY
        }
        return dateString;
    };

    const formatDateToDatabase = (dateString: string) => {
        const dateParts = dateString.split('/');
        if (dateParts.length === 3) {
            return `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // Formato YYYY-MM-DD
        }
        return dateString;
    };

    const [formData, setFormData] = useState<Doctor>({
        ...medicoData,
        fecha_nac: formatDateToDisplay(medicoData.fecha_nac), // Formatear la fecha para mostrarla
    });

    useEffect (() => {
        console.log(medicoData.fecha_nac);
    }, [medicoData.fecha_nac]);

    const handleInputChange = (field: keyof Doctor, value: FormFieldValue) => {
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

        const formattedFormData = {
            ...formData,
            fecha_nac: formatDateToDatabase(formData.fecha_nac), // Formatear la fecha para la base de datos
        };

        editDoctor(formattedFormData);
    };

    const handleSaveClick = async () => {
        try {
            console.log("Guardando paciente...", formData);
            const formattedFormData = {
                ...formData,
                fecha_nac: formatDateToDatabase(formData.fecha_nac), // Formatear la fecha para la base de datos
            };
            await editDoctor(formattedFormData);
            console.log("Paciente actualizado correctamente");
            router.push('/admin/doctors');
        } catch (error) {
            console.error("Error al actualizar el paciente:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1>Edit Doctor</h1>
            <NewDoctorForm formData={formData} handleInputChange={handleInputChange} insercion={false}/>
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
                    onClick={() => router.push('/admin/doctors')}
                >
                    Cancelar
                </Button>
            </div>
        </form>
    );
};

export default EditDoctorClientPage;