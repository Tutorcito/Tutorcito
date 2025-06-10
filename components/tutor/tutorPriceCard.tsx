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

const PriceCard: React.FC<PriceCardProps> = ({ prices, onEdit }) => {
  return (
    <TutorSection 
      title="Mis precios" 
      onEdit={onEdit} 
      containerClassName="bg-blue-100" 
      titleClassName="font-medium mb-3"
    >
      <div className="flex flex-col sm:flex-row justify-between text-center">
        {prices.map((option, index) => (
          <div 
            key={index} 
            className={`flex-1 space-x-2${index < prices.length - 1 ? "border-b sm:border-b-0 sm:border-r border-gray-300" : ""}`}
          >
            <p className="font-bold text-lg sm:text-xl">{option.price}</p>
            <p className="text-xs text-gray-600">{option.duration}</p>
          </div>
        ))}
      </div>
    </TutorSection>
  )
}

export default PriceCard;