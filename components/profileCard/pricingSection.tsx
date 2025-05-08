import React from 'react'
import { ProfileSection } from "./profileSection";

type PriceOption = {
  price: string;
  duration: string;
};

type PricingSectionProps = {
  prices: PriceOption[];
  onEdit?: () => void;
};
const  PricingSection: React.FC<PricingSectionProps> = ({ prices, onEdit }) => {
  return (
    <ProfileSection title="Mis precios" onEdit={onEdit} containerClassName="bg-[#D9EBF4]" titleClassName="text-black">
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
    </ProfileSection>
  )
}

export default PricingSection;
