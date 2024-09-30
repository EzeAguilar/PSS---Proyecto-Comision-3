'use client'
import { Button } from "@/app/components/ui/button";
import NewPatientForm from "@/app/components/ui/newPatientForm";
import { fetchPatient } from "@/app/lib/data";
import { Patient } from "@/app/lib/types";
import { NewPatientFormData } from "@/app/lib/utils";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

//aa
const EditPatientPage = () => {
    const { patientID } = useParams<{ patientID: string }>();
    const patientData = fetchPatient(patientID) as unknown as Patient;
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

    const handleInputChange = (field: any, value: any) => {
        setFormData((prevForm) => ({
            ...prevForm,
            [field]: value,
        }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const allFieldsFilled = Object.values(formData).every(field => field.trim() !== '');

        if (!allFieldsFilled) {
            console.log("Por favor, complete todos los campos.");
            return;
        }

        if (e.target.checkValidity()) {
            console.log("Datos del formulario:", formData);
        } else {
            console.log("Formulario no es válido");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <h1>Edit Patient</h1>
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
}

export default EditPatientPage;