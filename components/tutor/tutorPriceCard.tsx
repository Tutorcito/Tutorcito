import React from 'react'
import { TutorSection } from './tutorSection';


type PriceOption = {
  price: string;
  duration: string;
};

type PriceCardProps = {
  prices: PriceOption[];
  onEdit?: () => void;
};
const  PriceCard: React.FC<PriceCardProps> = ({ prices, onEdit }) => {
  return (
    <TutorSection title="Mis precios" onEdit={onEdit} containerClassName="bg-[#D9EBF4]" titleClassName="text-black">
      <div className="flex justify-between text-center">
        {prices.map((option, index) => (
          <div 
            key={index} 
            className={`flex-1 p-2 ${
              index < prices.length - 1 ? "border-r border-gray-300" : ""
            }`}
          >
            <p className="font-medium">{option.price}</p>
            <p className="text-xs text-gray-600">{option.duration}</p>
          </div>
        ))}
      </div>
    </TutorSection>
  )
}

export default PriceCard;