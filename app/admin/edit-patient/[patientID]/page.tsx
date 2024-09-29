'use client'
import { fetchPatient } from "@/app/lib/data";
import { Patient } from "@/app/lib/types";
import { NewPatientFormData } from "@/app/lib/utils";
import { useParams } from "next/navigation";
import { useState } from "react";


const EditPatientPage = async () => {
    const { patientID } = useParams<{ patientID: string }>();
    const patientData = await fetchPatient(patientID);

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
    return (
        <div>
            <h1>Edit Patient</h1>
        </div>
    );
}

export default EditPatientPage;