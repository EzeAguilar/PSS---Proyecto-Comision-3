import Image from "next/image";


const Header = () => {
    return (
      <header className="bg-gradient-to-r from-[#952D30] to-black p-4 flex justify-end items-center">
        
        <div className="flex items-center">
          <Image 
            src="/profile-placeholder.png"
            alt="User" 
            className="w-10 h-10 rounded-full"
            width={40}
            height={40}
            />
        </div>
      </header>
    );
  };
  
  export default Header;
  