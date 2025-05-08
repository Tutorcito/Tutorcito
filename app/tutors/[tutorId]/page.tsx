import TutorBio from "@/components/tutor/bioTutor";
import KnowledgeCard from "@/components/tutor/knowledgeCard";
import PriceCard from '@/components/tutor/priceCard';
import CommentsSection from '@/components/tutor/CommentsSection';

export default function TutorPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6 pb-20">
      {/* Perfil del tutor */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-300" />
        <h1 className="text-2xl font-bold mt-4">Alvaro Agüero</h1>
        <p className="text-gray-600">Análisis | Ingles</p>
        <p className="text-yellow-500 font-semibold mt-1">4.7 ★</p>
        <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Agendar tutoría
        </button>
      </div>

      {/* Biografía */}
      <TutorBio bio="¡Hola! Soy un tutor apasionado por enseñar matemáticas y ayudar a estudiantes a alcanzar su maximo potencial." />

      {/* Conocimientos y precios */}
      <div className="grid md:grid-cols-2 gap-4">
        <KnowledgeCard knowledge={['Analítico secundario', 'Certificado de inglés']} />
        <PriceCard prices={[
          { duration: '30min', price: '$5000' },
          { duration: '1hr', price: '$5000' },
          { duration: '+1hr', price: '$11000' }
        ]} />
      </div>

      {/* Comentarios */}
      <CommentsSection comments={[
        {
          name: 'Carlitos Rodríguez',
          date: '10/04/25',
          rating: 5,
          text: 'Excelente tutor, muy claro y paciente.'
        },
        {
          name: 'Federico Martorell',
          date: '01/04/25',
          rating: 4,
          text: 'Me ayudó bastante con los temas difíciles.'
        }
      ]} />
    </div>
  );
}