import {
  Users,
  Target,
  Compass,
  BookOpen,
  Facebook,
  Twitter,
  Youtube,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import isopo from "@/assets/isotipo.png";

function App() {
  return (
    <div className="min-h-screen bg-[#3e538d]">
      {/* Hero Section */}

      <main>
        {/* Welcome Section */}
        <div className="flex flex-col items-center  text-center py-10 mx-auto bg-[#93ab4c]">
          <Link href="/" className="mb-8 transition-transform hover:scale-105">
            <Image
              src={isopo}
              alt="Mascota de la intranet"
              width={100}
              height={100}
              className="w-auto h-auto"
            />
          </Link>

          <h1 className="text-5xl font-bold mb-4 animate-title">
            ¡Bienvenido a la intranet!
          </h1>
          <p className="text-2xl mb-8 px-10">
            Este es el espacio central para toda la información, comunicación y
            recursos de la empresa.
          </p>

          <div className="flex gap-4 mb-8">
            <Link href="/guest-dashboard/">
              <button className="bg-[#ffef41] text-black px-6 py-2 rounded-md hover:bg-[#e8de71]">
                Iniciar
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

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Visión general de la Intranet
            </h1>
            <p className="text-2xl text-black max-w-2xl mx-auto mb-8 text-justify">
              Nuestra intranet es un espacio diseñado para facilitar la
              colaboración, el acceso rápido a información importante y la
              eficiencia en nuestros procesos. Aquí podrás encontrar todos los
              recursos y herramientas necesarios para trabajar de manera
              efectiva en un solo lugar.
            </p>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="bg-[#93ab4c] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 text-black">
                  <Target className="h-5 w-5" />
                  <h2 className="text-3xl font-bold">Nuestra Misión</h2>
                </div>
                <p className="text-black leading-relaxed text-xl text-justify">
                  Somos la mejor alternativa en la industria farmacéutica
                  dedicada a mantener la satisfacción de nuestros clientes
                  innovando y dispensando productos de alta calidad con precios
                  accesibles, y un excelente servicio en cada una de nuestras
                  sucursales.
                </p>
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 text-black text-justify">
                  <Compass className="h-5 w-5" />
                  <h2 className="text-3xl font-bold">Nuestra Visión</h2>
                </div>
                <p className="text-black leading-relaxed text-xl text-justify">
                  En Farmacias Yireh tenemos la visión de formar el mejor equipo
                  humano, trabajando con profesionalismo, honestidad y
                  compromiso para llegar a ser la mejor cadena farmacéutica a
                  nivel nacional.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="py-16 bg-[#8d2429]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Objetivos Clave
              </h2>
              <p className="text-black max-w-2xl mx-auto text-2xl">
                La intranet es tu espacio para acceder a información importante
                y estar al día con las novedades de la empresa.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Users className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Comunicación Interna Eficiente
                </h3>
                <p className="text-black">
                  Proveer un canal para compartir noticias, actualizaciones y
                  anuncios dentro de la organización.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <BookOpen className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Centralización de la Información
                </h3>
                <p className="text-black">
                  Facilitar el acceso a documentos, políticas y recursos
                  importantes desde un solo lugar.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <Target className="h-8 w-8 text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold mb-3">
                  Fomentar la Cultura Organizacional
                </h3>
                <p className="text-black">
                  Reflejar la misión, visión y valores de la empresa para
                  fortalecer el sentido de pertenencia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
