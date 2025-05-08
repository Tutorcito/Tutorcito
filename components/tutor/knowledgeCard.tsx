// components/tutor/KnowledgeCard.tsx
interface KnowledgeCardProps {
    knowledge: string[];
  }
  
  export default function KnowledgeCard({ knowledge }: KnowledgeCardProps) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Mis conocimientos</h2>
        <ul className="list-disc list-inside text-gray-700">
          {knowledge.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }