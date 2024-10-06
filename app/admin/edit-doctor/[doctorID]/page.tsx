import { fetchMedico, fetchPatient } from "@/app/lib/data";
import { Doctor, Patient } from "@/app/lib/utils";
import EditDoctorClientPage from "@/app/components/ui/edit-doctor-client";

interface Props {
    params: { doctorID: number };
}

const EditPatientServerPage = async ({ params }: Props) => {
    const { doctorID } = params;
    const medicoData: Doctor = await fetchMedico(doctorID);

    return (
        <div>
            <EditDoctorClientPage medicoData={medicoData} />
        </div>
    );
};

export default EditPatientServerPage;