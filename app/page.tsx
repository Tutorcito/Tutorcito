import ClassCard from "@/components/classCard";
import ResourcesCard from "@/components/resourcesCard";

export default function Home() {
  return (
    <div className="flex  gap-4 min-w-screen">
      <ResourcesCard icon="/Excalidraw.png" description1="Hola wachin" description2="Que tal wachin" description3="chau wachin" />
      <ClassCard subject="comunicaciones" students={2000} tutors={6500} classImage="/Excalidraw.png" />
    </div>
  );
}
