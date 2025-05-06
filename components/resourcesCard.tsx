import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface resourcesCardProps {
  icon: string;
  description1: string;
  description2: string;
  description3: string;
}

function ResourcesCard({ icon, description1, description2, description3 }: resourcesCardProps) {
  return (
    <Card>
      <CardHeader>
        <Image src={icon} width={280} height={56} alt="Icon Resource"/>
      </CardHeader>
      <CardContent>
      {/* //seria la parte del figma que esta en puntos. */}
        <ul>
          <li>{description1}</li> 
          <li>{description2}</li>
          <li>{description3}</li>
        </ul>

      </CardContent>
    </Card>
  );
}

export default ResourcesCard;
