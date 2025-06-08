import React from 'react'

type ProfileBannerProps = {
    bannerUrl?: string;
    avatarUrl?: string;
};

const ProfileBanner: React.FC<ProfileBannerProps> = ({ bannerUrl, avatarUrl }) => {
    return (
        <div className="relative w-full">
            {/* Banner */}
            <div
                className={`
                    h-24 sm:h-32 md:h-40 lg:h-48 xl:h-52
                    w-full
                    bg-blue-600 bg-cover bg-center bg-no-repeat
                    transition-all duration-300 ease-in-out
                    ${bannerUrl ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-blue-700'}
                `}
                style={bannerUrl ? { 
                    backgroundImage: `linear-gradient(rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.1)), url(${bannerUrl})` 
                } : {}}
            />

            {/* Avatar Container */}
            <div className="absolute left-1/2 transform -translate-x-1/2 
                           -bottom-8 sm:-bottom-10 md:-bottom-12 lg:-bottom-14 xl:-bottom-16">
                <div className="relative">
                    {/* Avatar */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32
                                   rounded-full 
                                   border-2 sm:border-3 md:border-4 lg:border-4 xl:border-4
                                   border-white 
                                   bg-gray-200 
                                   overflow-hidden
                                   shadow-lg sm:shadow-xl
                                   transition-all duration-300 ease-in-out
                                   hover:shadow-2xl hover:scale-105">
                        {avatarUrl ? (
                            <img 
                                src={avatarUrl} 
                                alt="Profile" 
                                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110" 
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 
                                           flex items-center justify-center">
                                <svg 
                                    className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 
                                              text-gray-500"
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                        )}
                    </div>

                    {/* Online indicator (optional enhancement) */}
                    <div className="absolute bottom-0 right-0 
                                   w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6
                                   bg-green-500 
                                   border-1 sm:border-2 border-white 
                                   rounded-full
                                   shadow-sm
                                   transition-all duration-300 ease-in-out">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileBanner