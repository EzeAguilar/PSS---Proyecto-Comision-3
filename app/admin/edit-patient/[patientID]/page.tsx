import { fetchPatient } from "@/app/lib/data";
import { Patient } from "@/app/lib/utils";
import EditPatientClientPage from "@/app/components/ui/edit-patient-client";

interface Props {
    params: { patientID: string };
}

const EditPatientServerPage = async ({ params }: Props) => {
    const { patientID } = params;
    const patientData: Patient = await fetchPatient(patientID);

    return (
        <div>
            <EditPatientClientPage patientData={patientData} />
        </div>
    );
};

export default EditPatientServerPage;