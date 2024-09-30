import { NewPatientFormData } from "@/app/lib/utils";
import CustomInput from "./customInput";

interface NewPatientFormProps {
    formData: NewPatientFormData;
    handleInputChange: (field: keyof NewPatientFormData, value: string | number) => void;
    patientID?: string;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ formData, handleInputChange, patientID = "" }) => {

    //if (patientID !== "") {
      //  const patient = fetchPatient(patientID); COMENTADO PARA QUE ANDE DEPLOY
    //}

    return (
        <div className="bg-gray-200 md:min-h-[450px] rounded-lg flex flex-wrap justify-between p-14">
            <CustomInput
                type="text"
                label="Nombre"
                placeholder="Nombre"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
            />
            <CustomInput
                type="number"
                label="DNI"
                placeholder="P ej: 12345678"
                required
                value={formData.dni}
                onChange={(e) => handleInputChange('dni', e.target.value)}
            />
            <CustomInput
                type="text"
                label="Apellido"
                placeholder="Apellido"
                required
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
            />
            <CustomInput
                type="number"
                label="Teléfono"
                placeholder="2915447866"
                required
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
            />
            <CustomInput
                type="text"
                label="Dirección"
                placeholder="Brown 100"
                required
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
            />
            <CustomInput
                type="text"
                label="Fecha de nacimiento"
                placeholder="dd/mm/yyyy"
                required
                value={formData.birthDate}
                onChange={(e) => handleInputChange('birthDate', e.target.value)}
            />
            <CustomInput
                type="email"
                label="Correo electrónico"
                placeholder="email@gmail.com"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
            />
            <CustomInput
                type="password"
                label="Contraseña"
                placeholder="********"
                required
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
            />
        </div>
    );
};

export default NewPatientForm;
