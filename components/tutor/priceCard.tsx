// components/tutor/priceCard.tsx
interface PriceOption {
    duration: string;
    price: string;
  }
  
  interface PriceCardProps {
    prices: PriceOption[];
  }
  
  export default function PriceCard({ prices }: PriceCardProps) {
    return (
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Mis precios</h2>
        <ul className="space-y-1 text-gray-700">
          {prices.map((p, i) => (
            <li key={i}>
              {p.duration}: <span className="font-medium">{p.price}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }