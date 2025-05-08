import React from 'react'
type ProfileBannerProps = {
    bannerUrl?: string;
    avatarUrl?: string;
};

const ProfileBanner: React.FC<ProfileBannerProps> = ({ bannerUrl, avatarUrl }) => {
    return (
        <div className="relative">
            {/* Banner */}
            <div
                className="h-32 bg-blue-600"
                style={bannerUrl ? { backgroundImage: `url(${bannerUrl})`, backgroundSize: 'cover' } : {}}
            ></div>

            {/* Foto de perfil */}
            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-12">
                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-200 overflow-hidden">
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

export default ProfileBanner