// app/components/Navbar.jsx
import Image from "next/image";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-5 py-4 bg-white shadow-md">
      <div className="flex items-center space-x-1">
        <Image src="/logo.png" alt="Logo Tutorcito" width={40} height={32} />
        <span className="text-xl font-bold  ">Tutorcito</span>
      </div>

      <Button
        variant={"default"}
        className="flex items-end w-25 bg-blue-500 text-white py-2 px-4 rounded font-medium hover:bg-blue-600 transition-colors"
      >
        Ingresar
      </Button>
    </nav>
  );
}
