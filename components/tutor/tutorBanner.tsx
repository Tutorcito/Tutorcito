import React from 'react'

type TutorBannerProps = {
    bannerUrl?: string;
    avatarUrl?: string;
};

const TutorBanner: React.FC<TutorBannerProps> = ({ bannerUrl, avatarUrl }) => {
    return (
        <div className="relative">
            {/* Banner */}
            <div
                className="h-40 sm:h-48 md:h-56 lg:h-64 bg-blue-600"
                style={bannerUrl ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            ></div>

            {/* Foto de perfil */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 sm:-bottom-16 md:-bottom-20 lg:-bottom-24">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
                    {avatarUrl ? (
                        <img src={avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gray-300"></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TutorBanner