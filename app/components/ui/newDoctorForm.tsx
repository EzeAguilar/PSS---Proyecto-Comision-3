import { Doctor } from "@/app/lib/utils";
import CustomInput from "./customInput";

interface NewDoctorFormProps {
    formData: Doctor;
    handleInputChange: (field: keyof Doctor, value: string | number) => void;
    doctorID?: string;
}

const NewDoctorForm: React.FC<NewDoctorFormProps> = ({ formData, handleInputChange}) => {
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
            <CustomInput
                type="password"
                label="Contraseña"
                placeholder="********"
                required
                value={formData.contraseña}
                onChange={(e) => handleInputChange('contraseña', e.target.value)}
            />
            <CustomInput
                type="number"
                label="Número de Matrícula"
                placeholder="123456"
                required
                value={formData.numero_matricula}
                onChange={(e) => handleInputChange('numero_matricula', e.target.value)}
            />
            <CustomInput
                type="text"
                label="Especialidad"
                placeholder="Ej. Cardiología"
                required
                value={formData.especialidad}
                onChange={(e) => handleInputChange('especialidad', e.target.value)}
            />
            <CustomInput
                type="number"
                label="Tiempo de consulta (min)"
                placeholder="30"
                required
                value={formData.tiempo_consulta}
                onChange={(e) => handleInputChange('tiempo_consulta', e.target.value)}
            />
        </div>
    );
};

export default NewDoctorForm;