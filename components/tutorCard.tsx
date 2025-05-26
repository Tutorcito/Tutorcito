import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, } from "./ui/card";
import Image from "next/image";
//paso 1; usar el comando rafce para inicializar el componente
//paso 2; ver si uso estado o no
//paso 3; ver si necesito props
interface tutorCardProps {
  name: string;
  profileImage: string ; //propiedad no obligatoria.
  subjects: string;
}

const TutorCard = ({ name, profileImage, subjects }: tutorCardProps) => {
  //destructuracion

  return (
    <Card>
      <CardHeader>
        <Image src={profileImage} alt="Profile Image" width={156} height={24}/>
        <CardTitle>{name}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{subjects}</p>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
