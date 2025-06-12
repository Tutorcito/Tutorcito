// app/components/classCard.tsx
"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface ClassCardProps {
  subject: string;
  students: number;
  tutors: number;
  classImage: string;
  onClick?: (subject: string) => void;
}

function ClassCard({ subject, students, tutors, classImage, onClick }: ClassCardProps) {
  return (
    <Card
      className="relative overflow-hidden bg-white shadow-sm border border-gray-200 max-w-md h-64 cursor-pointer hover:shadow-md transition"
      onClick={() => onClick?.(subject)}
    >
      <div className="absolute inset-0">
        <Image
          src={classImage}
          alt={`${subject} background`}
          fill
          className="object-cover opacity-75"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative h-full flex flex-col justify-between p-6">
        <CardHeader className="p-0">
          <CardTitle className="text-2xl font-bold text-white mb-2">
            {subject}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-0 mt-auto">
          <div className="flex items-center gap-1 text-white font-medium">
            <span>{new Intl.NumberFormat("es-AR").format(students)} estudiantes</span>
            <span className="mx-1">|</span>
            <span>{new Intl.NumberFormat("es-AR").format(tutors)} tutores</span>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}

export default ClassCard;
