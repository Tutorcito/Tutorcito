import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ClassCard from './classCard';

interface Class {
  id: number;
  subject: string;
  students: number;
  tutors: number;
  classImage: string;
}

interface ClassCardCarouselProps {
  classes: Class[];
  title?: string;
  onSelectSubject?: (subject: string) => void;
}

const ClassCardCarousel = ({ classes, title = "Materias Disponibles", onSelectSubject }: ClassCardCarouselProps) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-10">
      {title && (
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          {title}
        </h2>
      )}
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {classes.map((classItem) => (
            <CarouselItem 
              key={classItem.id} 
              className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <ClassCard
                subject={classItem.subject}
                students={classItem.students}
                tutors={classItem.tutors}
                classImage={classItem.classImage}
                onClick={onSelectSubject}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    </div>
  );
};

export default ClassCardCarousel;