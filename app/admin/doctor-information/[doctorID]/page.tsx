import DoctorInformationPage from "@/app/components/ui/DoctorInformationPage";
import PatientInformationPage from "@/app/components/ui/PatientInformationPage";
import { fetchMedico } from "@/app/lib/data";
import { Doctor } from "@/app/lib/utils";

interface DoctorInformationProps {
  params: { doctorID: number };
}

const DoctorInformation: React.FC<DoctorInformationProps> = async ({ params }) => {
  const { doctorID } = params;
  const doctorData: Doctor = await fetchMedico(doctorID);

  return (
    <div>
      <DoctorInformationPage doctorData={doctorData} />
    </div>
  );
};

export default DoctorInformation;
