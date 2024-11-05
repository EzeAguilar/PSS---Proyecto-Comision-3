import PatientMedicalRecordPage from "@/app/components/ui/PatientMedicalRecordPage";
import { fetchFichaMedica, fetchPatient} from "@/app/lib/data";
import { ficha_medica, Patient } from "@/app/lib/utils";

interface PatientMedicalRecordProps {
  params: { patientID: number };
}

const PatientMedicalRecord: React.FC<PatientMedicalRecordProps> = async ({ params }) => {
  const { patientID } = params;
  const patientMedR: ficha_medica = await fetchFichaMedica(patientID);
  const patientD: Patient = await fetchPatient(patientID);

  return (
    <div>
      <PatientMedicalRecordPage patientData={patientD} patientMedicalRecord={patientMedR} />
    </div>
  );
};

export default PatientMedicalRecord;
