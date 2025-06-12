import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import TutorCard from './tutorCard';
import { motion, AnimatePresence } from "framer-motion";

interface Tutor {
  id: number;
  name: string;
  profileImage: string;
  subjects: string;
  rating?: number;
}

interface TutorCarouselProps {
  tutors: Tutor[];
  title?: string;
}

const TutorCarousel = ({ tutors, title = "Tutores Destacados" }: TutorCarouselProps) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={title}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-7xl mx-auto px-4 py-10"
      >
        {/* Título del carrusel */}
        {title && (
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {title}
          </h2>
        )}

        {/* Carrusel */}
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {tutors.map((tutor) => (
              <CarouselItem
                key={tutor.id}
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <TutorCard
                  name={tutor.name}
                  profileImage={tutor.profileImage}
                  subjects={tutor.subjects}
                  rating={tutor.rating}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Controles de navegación */}
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>
      </motion.div>
    </AnimatePresence>
  );
};

export default TutorCarousel;
