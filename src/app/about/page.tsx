import { Building2, Users, Target, Compass, BookOpen } from "lucide-react";
import Link from "next/link";

function App() {
  return (
    <div className="min-h-screen bg-[#ebda16]">
      {/* Hero Section */}
      <header className="shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href={"/"}>
            <div className="flex items-center space-x-2">
              <Building2 className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl text-gray-900">
                Corporativo Yireh
              </span>
            </div>
          </Link>
        </nav>
      </header>

      <main>
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
        <div className="bg-[#549c2c] py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 text-black">
                  <Target className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Nuestra Misión</h2>
                </div>
                <p className="text-black leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eaque
                  sed impedit nostrum? At iure provident quo non unde alias,
                  nobis ut nostrum cumque autem voluptatum culpa sequi, dolore
                  aut ea!
                </p>
              </div>
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 text-black">
                  <Compass className="h-5 w-5" />
                  <h2 className="text-2xl font-bold">Nuestra Visión</h2>
                </div>
                <p className="text-black leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi
                  labore cumque tempora dignissimos explicabo quasi debitis, sed
                  ratione recusandae ex nisi ullam temporibus error rerum
                  consequatur repudiandae consequuntur alias? Sint.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Objectives Section */}
        <div className="py-16 bg-[#ebda16]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Objetivos Clave
              </h2>
              <p className="text-black max-w-2xl mx-auto">
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
