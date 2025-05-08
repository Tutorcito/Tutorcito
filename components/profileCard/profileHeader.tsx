import React from 'react'
type ProfileHeaderProps = {
    name: string;
    title: string;
    year: string;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, title, year }) => {
    return (
        <div className="pt-16 pb-2 text-center">
            <h2 className="text-xl font-bold">{name}</h2>
            <p className="text-gray-600 text-sm">{title}</p>
            <p className="text-gray-500 text-sm">{year}</p>
        </div>
    )
}

export default ProfileHeader

