

interface CustomInputProps {
    label: string;
    type: string;
    value?: string | number;
    placeholder?: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
};

const CustomInput = ({ label, type, value, placeholder, className, onChange, required }: CustomInputProps) => {
    return (
        <div className={`flex flex-col gap-2 ${className} md:w-[40%]`}>
            <label className="text-lg text-black">{label}</label>
            <input
                type={type}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                className="w-full h-10 px-3 py-2 border rounded-md border-gray-300 bg-white text-sm focus:outline-none focus:border-primary-500"
            />
        </div>
    );
};

export default CustomInput;