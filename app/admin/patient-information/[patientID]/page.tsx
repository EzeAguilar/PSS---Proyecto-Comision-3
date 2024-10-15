import PatientInformationPage from "@/app/components/ui/PatientInformationPage";
import { fetchPatient } from "@/app/lib/data";
import { Patient } from "@/app/lib/utils";

interface PatientInformationProps {
  params: { patientID: number };
}

const PatientInformation: React.FC<PatientInformationProps> = async ({ params }) => {
  const { patientID } = params;
  const patientData: Patient = await fetchPatient(patientID);

  return (
    <div>
      <PatientInformationPage patientData={patientData} />
    </div>
  );
};

export default PatientInformation;
