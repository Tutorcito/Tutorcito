import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface resourcesCardProps {
  icon: string;
  description1: string;
  description2: string;
  description3: string;
}

function resourcesCard({ icon, description1, description2, description3 }: resourcesCardProps) {
  return (
    <Card>
      <CardHeader>
        <Image src={icon} alt="Icon Resource"/>
      </CardHeader>
      <CardContent>
        <p>{description1}</p> //seria la parte del figma que esta en puntos.
        <p>{description2}</p>
        <p>{description3}</p>
      </CardContent>
    </Card>
  );
}

export default resourcesCard;
