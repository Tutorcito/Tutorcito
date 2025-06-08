import React from 'react';

//el footer está estructurado con Flexbox para adaptarse tanto a mobile como desktop (columna en mobile, fila en escritorio).
//chequear si hay errores con el responsive
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      {/* Container with max width and responsive padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Mobile Layout (xs to md) */}
        <div className="block lg:hidden py-8">
          <div className="flex flex-col items-center space-y-6">
            
            {/* Logo Section */}
            <div className="flex items-center justify-center">
              <img 
                src="/tutorcito-logo.png" 
                alt="Tutorcito logo" 
                className="h-8 w-auto mr-3" 
              />
              <span className="font-bold text-xl text-gray-900">Tutorcito</span>
            </div>

            {/* Navigation Links - Stacked on very small screens, inline on larger mobile */}
            <nav className="w-full">
              <div className="flex flex-col sm:flex-row sm:justify-center sm:flex-wrap gap-y-3 sm:gap-x-8 sm:gap-y-2">
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 text-center sm:text-left
                           py-2 px-4 rounded-md hover:bg-gray-50 transition-all duration-200
                           text-sm font-medium min-h-[44px] flex items-center justify-center sm:justify-start"
                >
                  Tutores populares
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 text-center sm:text-left
                           py-2 px-4 rounded-md hover:bg-gray-50 transition-all duration-200
                           text-sm font-medium min-h-[44px] flex items-center justify-center sm:justify-start"
                >
                  Clases populares
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 text-center sm:text-left
                           py-2 px-4 rounded-md hover:bg-gray-50 transition-all duration-200
                           text-sm font-medium min-h-[44px] flex items-center justify-center sm:justify-start"
                >
                  Recursos
                </a>
              </div>
            </nav>

            {/* Copyright */}
            <div className="text-center pt-4 border-t border-gray-100 w-full">
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-semibold text-gray-700">© Tutorcito 2025</span>
                <span className="hidden xs:inline"> — </span>
                <span className="block xs:inline mt-1 xs:mt-0">Todos los derechos reservados</span>
              </p>
            </div>
          </div>
        </div>

        {/* Desktop Layout (lg and up) */}
        <div className="hidden lg:block py-6">
          <div className="flex items-center justify-between">
            
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <img 
                src="/tutorcito-logo.png" 
                alt="Tutorcito logo" 
                className="h-8 w-auto mr-3" 
              />
              <span className="font-bold text-xl text-gray-900">Tutorcito</span>
            </div>

            {/* Navigation Links - Centered */}
            <nav className="flex-1 flex justify-center">
              <div className="flex items-center space-x-8">
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md
                           hover:bg-gray-50 transition-all duration-200 text-sm font-medium
                           whitespace-nowrap"
                >
                  Tutores populares
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md
                           hover:bg-gray-50 transition-all duration-200 text-sm font-medium
                           whitespace-nowrap"
                >
                  Clases populares
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md
                           hover:bg-gray-50 transition-all duration-200 text-sm font-medium
                           whitespace-nowrap"
                >
                  Recursos
                </a>
              </div>
            </nav>

            {/* Copyright */}
            <div className="flex-shrink-0">
              <p className="text-sm text-gray-500 font-medium whitespace-nowrap">
                <span className="font-semibold text-gray-700">© Tutorcito 2025</span>
                {' — '}
                <span>Todos los derechos reservados</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tablet Layout (md to lg) */}
        <div className="hidden md:block lg:hidden py-7">
          <div className="flex flex-col space-y-6">
            
            {/* Top row: Logo and Copyright */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <img 
                  src="/tutorcito-logo.png" 
                  alt="Tutorcito logo" 
                  className="h-8 w-auto mr-3" 
                />
                <span className="font-bold text-xl text-gray-900">Tutorcito</span>
              </div>
              
              <p className="text-sm text-gray-500 font-medium">
                <span className="font-semibold text-gray-700">© Tutorcito 2025</span>
                {' — '}
                <span>Todos los derechos reservados</span>
              </p>
            </div>

            {/* Bottom row: Navigation centered */}
            <nav className="flex justify-center">
              <div className="flex items-center space-x-8">
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 rounded-md
                           hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                >
                  Tutores populares
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 rounded-md
                           hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                >
                  Clases populares
                </a>
                <a 
                  href="#" 
                  className="text-gray-600 hover:text-blue-600 py-2 px-4 rounded-md
                           hover:bg-gray-50 transition-all duration-200 text-sm font-medium"
                >
                  Recursos
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
