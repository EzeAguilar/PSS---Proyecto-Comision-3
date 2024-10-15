import { fetchHorarios, fetchMedico } from "@/app/lib/data";
import { Doctor } from "@/app/lib/utils";
import EditDoctorClientPage from "@/app/components/ui/edit-doctor-client";


interface Props {
    params: { doctorID: number };
}

const EditDoctorServerPage = async ({ params }: Props) => {
    const { doctorID } = params;
    const medicoData: Doctor = await fetchMedico(doctorID);
    const medicoHorarios = await fetchHorarios(doctorID);

    return (
        <div>
            <EditDoctorClientPage medicoData={medicoData} medicoHorarios={medicoHorarios} />
        </div>
    );
};

export default EditDoctorServerPage;