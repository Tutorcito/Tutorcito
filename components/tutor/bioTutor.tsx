import React from "react";

interface TutorBioProps {
  bio: string;
}

const TutorBio: React.FC<TutorBioProps> = ({ bio }) => {
  return (
    <div className="bg-white rounded-md shadow-md p-4 w-full">
      <h2 className="text-lg font-semibold mb-2">Sobre mí:</h2>
      <p className="text-sm text-gray-700">{bio}</p>
    </div>
  );
};

export default TutorBio;
