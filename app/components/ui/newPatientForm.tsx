import { Patient } from "@/app/lib/utils";
import CustomInput from "./customInput";

interface NewPatientFormProps {
    formData: Patient;
    handleInputChange: (field: keyof Patient, value: string | number) => void;
    patientID?: string;
    insercion: boolean;
}

const NewPatientForm: React.FC<NewPatientFormProps> = ({ formData, handleInputChange, insercion /*patientID = ""*/ }) => {

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
                value={formData.nombre}
                onChange={(e) => handleInputChange('nombre', e.target.value)}
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
                value={formData.apellido}
                onChange={(e) => handleInputChange('apellido', e.target.value)}
            />
            <CustomInput
                type="number"
                label="Teléfono"
                placeholder="2915447866"
                required
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
            />
            <CustomInput
                type="text"
                label="Dirección"
                placeholder="Brown 100"
                required
                value={formData.domicilio}
                onChange={(e) => handleInputChange('domicilio', e.target.value)}
            />
            <CustomInput
                type="text"
                label="Fecha de nacimiento"
                placeholder="dd/mm/yyyy"
                required
                value={formData.fecha_nac}
                onChange={(e) => handleInputChange('fecha_nac', e.target.value)}
            />
            <CustomInput
                type="email"
                label="Correo electrónico"
                placeholder="email@gmail.com"
                required
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
            />
            {insercion && 
                (<CustomInput
                    type="password"
                    label="Contraseña"
                    placeholder="********"
                    required
                    value={formData.contraseña}
                    onChange={(e) => handleInputChange('contraseña', e.target.value)}
                />
            )}
        </div>
    );
};

export default NewPatientForm;
