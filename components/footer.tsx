import React from 'react';

//el footer está estructurado con Flexbox para adaptarse tanto a mobile como desktop (columna en mobile, fila en escritorio).
//chequear si hay errores con el responsive
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t py-6 px-4 text-gray-600 flex flex-col md:flex-row items-center justify-between">
      
      {/* Sección de logo + nombre */}
      <div className="flex items-center mb-4 md:mb-0">
        <img src="/tutorcito-logo.png" alt="Tutorcito logo" className="h-16 mr-2" />
        <span className="font-semibold text-lg">Tutorcito</span>
      </div>

      {/* Navegación central */}
      <nav className="flex flex-wrap justify-center gap-6 text-sm">
        <a href="#" className="hover:underline">Tutores populares</a>
        <a href="#" className="hover:underline">Clases populares</a>
        <a href="#" className="hover:underline">Recursos</a>
      </nav>

      {/* Aviso legal */}
      <p className="text-sm mt-4 md:mt-0 text-center md:text-left">
        {/* la etiqueta <strong> sirve para marcar el texto como importante y también lo muestra en negrita(creo que se puede hacer en tailwind) */}
        <strong>© Tutorcito 2025 — Todos los derechos reservados</strong>
      </p>

    </footer>
  );
};

export default Footer;
