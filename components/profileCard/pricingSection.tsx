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

const PricingSection: React.FC<PricingSectionProps> = ({ prices, onEdit }) => {
  return (
    <ProfileSection 
      title="Mis precios" 
      onEdit={onEdit} 
      containerClassName="bg-[#D9EBF4]" 
      titleClassName="text-black text-sm sm:text-base md:text-lg font-medium"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-0 sm:divide-x sm:divide-gray-300">
        {prices.map((option, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center justify-center text-center
                       p-2 sm:p-3 md:p-4
                       min-h-[4rem] sm:min-h-[4.5rem] md:min-h-[5rem]
                       bg-white sm:bg-transparent
                       rounded-md sm:rounded-none
                       border sm:border-none border-gray-200
                       shadow-sm sm:shadow-none
                       transition-all duration-200 ease-in-out
                       hover:bg-white/50 sm:hover:bg-white/30"
          >
            <p className="font-medium sm:font-semibold md:font-bold
                          text-sm sm:text-base md:text-lg lg:text-xl
                          text-gray-900 mb-1 sm:mb-1.5 md:mb-2
                          leading-tight">
              {option.price}
            </p>
            <p className="text-xs sm:text-sm md:text-base
                          text-gray-600 sm:text-gray-700
                          leading-relaxed
                          px-1 sm:px-0">
              {option.duration}
            </p>
          </div>
        ))}
      </div>
      
      {/* Alternative layout for many items on small screens */}
      {prices.length > 4 && (
        <div className="block sm:hidden mt-4">
          <div className="grid grid-cols-2 gap-2">
            {prices.map((option, index) => (
              <div 
                key={`mobile-${index}`}
                className="flex flex-col items-center justify-center text-center
                           p-3 bg-white rounded-lg border border-gray-200 shadow-sm
                           min-h-[3.5rem]"
              >
                <p className="font-semibold text-sm text-gray-900 mb-1">
                  {option.price}
                </p>
                <p className="text-xs text-gray-600 leading-tight">
                  {option.duration}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </ProfileSection>
  )
}

export default PricingSection;
