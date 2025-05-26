import CardsCta from "@/components/cardsCta";
import ClassCard from "@/components/classCard";
import ProfileCardConteainer from "@/components/profileCard/profileCardContainer";
import ResourceCarrusel from "@/components/ResourceCarrusel";
import TutorCard from "@/components/tutorCard";

export default function Home() {
  return (
    <>
    <TutorCard name="Javier Milei" profileImage="/javier-milei.jpg" subjects="Economia" />
    <ClassCard subject="Matematicas" students={10} tutors={2} classImage="/tutorperfil.jpg" />
    <ProfileCardConteainer />
    <ResourceCarrusel />
    <CardsCta />
    </>
    
  );
}
