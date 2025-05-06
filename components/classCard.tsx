import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface classCardProps {
  subject: string; //nombre de clase o asignatura
  students: number; //cantidad de estudiantes de la asignatura
  tutors: number; //cantidad de tutores en la asignatura
  classImage: string; //imagen de la asignatura
}

function ClassCard({ subject, students, tutors, classImage }: classCardProps) {
  return (
    <Card>
      <CardHeader>
        <Image src={classImage} width={280} height={56} alt="Class Image"/>
        <CardTitle>{subject}</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-2">
          <p>{students}</p>
          <p>{tutors}</p>
        </div>
        
      </CardContent>
    </Card>
  );
}

export default ClassCard;
