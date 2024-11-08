import Link from "next/link";
import Image from "next/image";
import isopo from "@/assets/isotipo.png";
import { Facebook, Twitter, Youtube } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function Component() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ebda16] to-[#549c2c] flex flex-col items-center justify-between p-8">
      <div className="flex flex-col items-center max-w-2xl text-center">
        <Link href="/" className="mb-8 transition-transform hover:scale-105">
          <Image
            src={isopo}
            alt="Mascota de la intranet"
            width={100}
            height={100}
            className="w-auto h-auto"
          />
        </Link>

        <h1 className="text-5xl font-bold mb-4 animate-title">¡Bienvenido a la intranet!</h1>
        <p className="text-xl mb-8">
          Este es el espacio central para toda la información, comunicación y
          recursos de la empresa.
        </p>

        <div className="flex gap-4 mb-8">
          <Link href="/login">
            <button className="bg-[#1a472a] text-white px-6 py-2 rounded-md hover:bg-[#143d23]">
              Iniciar
            </button>
          </Link>

          <Link href="/about">
            <button className="bg-[#1a472a] text-white px-6 py-2 rounded-md hover:bg-[#143d23]">
              Saber más...
            </button>
          </Link>
        </div>

        <div className="flex gap-6">
          <Link
            href="#"
            className="text-black hover:text-[#1877f2] transition-colors"
          >
            <Facebook size={24} />
            <span className="sr-only">Facebook</span>
          </Link>
          <Link
            href="#"
            className="text-black hover:text-[#1da1f2] transition-colors"
          >
            <Twitter size={24} />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="#"
            className="text-black hover:text-[#ff0000] transition-colors"
          >
            <Youtube size={24} />
            <span className="sr-only">YouTube</span>
          </Link>
          <Link
            href="#"
            className="text-black hover:text-[#25d366] transition-colors"
          >
            <FaWhatsapp size={24} />
            <span className="sr-only">WhatsApp</span>
          </Link>
        </div>
      </div>

      <footer className="text-sm text-center mt-8">
        © 2024 Farmcias Yireh. Todos los derechos reservados.
      </footer>
    </div>
  );
}
