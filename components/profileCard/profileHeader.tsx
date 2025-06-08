import React from 'react'

type ProfileHeaderProps = {
    name: string;
    title: string;
    year: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, title, year }) => {
    return (
        <div className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28
                       pb-3 sm:pb-4 md:pb-5 lg:pb-6
                       px-2 sm:px-4 md:px-6
                       text-center">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl
                          font-bold sm:font-extrabold
                          text-gray-900
                          leading-tight sm:leading-tight md:leading-snug
                          mb-2 sm:mb-3 md:mb-4
                          break-words
                          transition-all duration-200 ease-in-out">
                {name}
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl
                         text-gray-600 sm:text-gray-700
                         font-medium sm:font-semibold
                         leading-relaxed sm:leading-normal
                         mb-1 sm:mb-2 md:mb-3
                         break-words
                         max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto">
                {title}
            </p>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg
                         text-gray-500 sm:text-gray-600
                         font-normal sm:font-medium
                         leading-relaxed
                         break-words">
                {year}
            </p>
        </div>
    )
}

export default ProfileHeader
