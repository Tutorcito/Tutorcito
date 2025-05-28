import CardsCta from "@/components/cardsCta";
import ClassCardCarousel from "@/components/classCardCarrusel";
import ResourceCarrusel from "@/components/ResourceCarrusel";
import TutorCarousel from "@/components/tutorCarrusel";
const tutorsData = [
    {
      id: 1,
      name: "Pepe Juan",
      profileImage: "/images/tutor1.jpg",
      subjects: "Programación I | Programación II",
      rating: 5
    },
    {
      id: 2,
      name: "María García",
      profileImage: "/images/tutor2.jpg",
      subjects: "Matemáticas | Cálculo",
      rating: 4
    },
    {
      id: 3,
      name: "Carlos López",
      profileImage: "/images/tutor3.jpg",
      subjects: "Física | Química",
      rating: 5
    },
    {
      id: 4,
      name: "Ana Martínez",
      profileImage: "/images/tutor4.jpg",
      subjects: "Inglés | Literatura",
      rating: 4
    },
    {
      id: 5,
      name: "Diego Rodríguez",
      profileImage: "/images/tutor5.jpg",
      subjects: "Historia | Geografía",
      rating: 5
    },
    {
      id: 6,
      name: "Laura Sánchez",
      profileImage: "/images/tutor6.jpg",
      subjects: "Biología | Anatomía",
      rating: 4
    }
  ];
const classesData = [
    {
      id: 1,
      subject: "Análisis Matemático II",
      students: 18500,
      tutors: 12430,
      classImage: "/images/math-analysis.jpg"
    },
    {
      id: 2,
      subject: "Programación I",
      students: 15200,
      tutors: 8950,
      classImage: "/images/programming1.jpg"
    },
    {
      id: 3,
      subject: "Física General",
      students: 12800,
      tutors: 6720,
      classImage: "/images/physics.jpg"
    },
    {
      id: 4,
      subject: "Química Orgánica",
      students: 9500,
      tutors: 4320,
      classImage: "/images/chemistry.jpg"
    },
    {
      id: 5,
      subject: "Cálculo Diferencial",
      students: 14600,
      tutors: 7890,
      classImage: "/images/calculus.jpg"
    },
    {
      id: 6,
      subject: "Inglés Técnico",
      students: 11200,
      tutors: 5670,
      classImage: "/images/english.jpg"
    }
  ];


export default function Home() {
  return (
    <>
    <TutorCarousel 
          tutors={tutorsData}
          title="Nuestros Mejores Tutores"
        />
      <ClassCardCarousel 
          classes={classesData}
          title="Explora Nuestras Materias"
        />
    <ResourceCarrusel />
    <CardsCta />
    </>
    
  );
}
