// app/materias/[subjectName]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import TutorCard from "@/components/tutorCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, BookOpen } from "lucide-react";

interface Tutor {
  id: string;
  full_name: string;
  profile_picture: string | null;
  rating: number;
  about_me: string | null;
  degree: string | null;
  year_of_degree: number | null;
  subjects?: string[];
}

interface SubjectData {
  id: string;
  name: string;
  code: string;
}

export default function TutorsBySubjectPage() {
  const params = useParams();
  const router = useRouter();
  const subjectName = decodeURIComponent(params.subjectName as string);
  
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [subjectData, setSubjectData] = useState<SubjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const fetchTutorsBySubject = async () => {
    try {
      setLoading(true);
      setDebugInfo(`Buscando materia: "${subjectName}"`);
      
      // Primero buscar la materia por nombre (búsqueda más flexible)
      const { data: subjects, error: subjectError } = await supabase
        .from("subjects")
        .select("id, name, code")
        .ilike("name", `%${subjectName}%`);

      console.log("Subjects found:", subjects);
      setDebugInfo(prev => prev + `\nMaterias encontradas: ${subjects?.length || 0}`);

      if (subjectError) {
        console.error("Subject error:", subjectError);
        throw new Error(`Error al buscar materia: ${subjectError.message}`);
      }

      if (!subjects || subjects.length === 0) {
        // Si no encuentra por nombre completo, intentar buscar por palabras clave
        const keywords = subjectName.split(' ').filter(word => word.length > 2);
        let foundSubject = null;
        
        for (const keyword of keywords) {
          const { data: keywordSubjects } = await supabase
            .from("subjects")
            .select("id, name, code")
            .ilike("name", `%${keyword}%`);
          
          if (keywordSubjects && keywordSubjects.length > 0) {
            foundSubject = keywordSubjects[0];
            break;
          }
        }
        
        if (!foundSubject) {
          throw new Error(`Materia "${subjectName}" no encontrada en la base de datos`);
        }
        
        setSubjectData(foundSubject);
        setDebugInfo(prev => prev + `\nMateria encontrada por palabra clave: ${foundSubject.name}`);
      } else {
        // Usar la primera materia encontrada
        setSubjectData(subjects[0]);
        setDebugInfo(prev => prev + `\nMateria encontrada: ${subjects[0].name}`);
      }

      const selectedSubject = subjects?.[0] || subjectData;
      if (!selectedSubject) {
        throw new Error("No se pudo determinar la materia");
      }

      // Buscar tutores que dictan esta materia
      const { data: tutorSubjects, error: tutorSubjectsError } = await supabase
        .from("tutor_subjects")
        .select(`
          tutor_id,
          profiles!tutor_subjects_tutor_id_fkey (
            id,
            full_name,
            profile_picture,
            about_me,
            degree,
            year_of_degree,
            role
          )
        `)
        .eq("subject_id", selectedSubject.id);

      console.log("Tutor subjects found:", tutorSubjects);
      setDebugInfo(prev => prev + `\nRelaciones tutor-materia encontradas: ${tutorSubjects?.length || 0}`);

      if (tutorSubjectsError) {
        console.error("Tutor subjects error:", tutorSubjectsError);
        throw new Error(`Error al buscar tutores: ${tutorSubjectsError.message}`);
      }

      if (!tutorSubjects || tutorSubjects.length === 0) {
        setTutors([]);
        setDebugInfo(prev => prev + "\nNo se encontraron tutores para esta materia");
        return;
      }

      // Buscar las calificaciones promedio de cada tutor
      const tutorIds = tutorSubjects.map(ts => ts.tutor_id);
      
      const { data: ratings, error: ratingsError } = await supabase
        .from("tutor_comments")
        .select("tutor_id, rating")
        .in("tutor_id", tutorIds);

      console.log("Ratings found:", ratings);
      setDebugInfo(prev => prev + `\nCalificaciones encontradas: ${ratings?.length || 0}`);

      // Calcular rating promedio por tutor
      const avgRatings: { [key: string]: number } = {};
      if (ratings && ratings.length > 0) {
        const ratingsPerTutor: { [key: string]: number[] } = {};
        ratings.forEach(rating => {
          if (!ratingsPerTutor[rating.tutor_id]) {
            ratingsPerTutor[rating.tutor_id] = [];
          }
          ratingsPerTutor[rating.tutor_id].push(rating.rating);
        });

        Object.keys(ratingsPerTutor).forEach(tutorId => {
          const tutorRatings = ratingsPerTutor[tutorId];
          avgRatings[tutorId] = tutorRatings.reduce((a, b) => a + b, 0) / tutorRatings.length;
        });
      }

      // Mapear los datos de tutores (solo incluir tutores o ambos)

      // console.log("Final tutors data:", tutorSubjects);
      // setTutors(tutorSubjects);
      // setDebugInfo(prev => prev + `\nTutores finales: ${ttutorSubjects.length}`);

    } catch (err) {
      console.error("Error fetching tutors:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      setDebugInfo(prev => prev + `\nError: ${err instanceof Error ? err.message : "Error desconocido"}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (subjectName) {
      fetchTutorsBySubject();
    }
  }, [subjectName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tutores...</p>
          <p className="text-xs text-gray-400 mt-2">Buscando: {subjectName}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <p className="text-red-600 mb-4 font-semibold">{error}</p>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 font-mono whitespace-pre-line">
              {debugInfo}
            </p>
          </div>
          <Button onClick={() => router.back()} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="mb-4 hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {subjectData?.name || subjectName}
                </h1>
                {subjectData?.code && (
                  <p className="text-gray-600 mt-1">Código: {subjectData.code}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="w-5 h-5" />
              <span className="font-medium">
                {tutors.length} {tutors.length === 1 ? 'tutor disponible' : 'tutores disponibles'}
              </span>
            </div>

            {/* Debug info - remover en producción */}
            <details className="mt-4">
              <summary className="text-xs text-gray-400 cursor-pointer">Debug Info</summary>
              <pre className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                {debugInfo}
              </pre>
            </details>
          </div>
        </div>

        {/* Tutors Grid */}
        {tutors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* {tutors.map((tutor) => (
              <TutorCard
                key={tutor.id}
                // id={tutor.id}
                name={tutor.full_name}
                profileImage={tutor.profile_picture || '/default-avatar.jpg'}
                subjects={subjectData?.name || subjectName}
                rating={Math.round(tutor.rating * 10) / 10}
                degree={tutor.degree}
                yearOfDegree={tutor.year_of_degree}
                aboutMe={tutor.about_me}
              />
            ))} */}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No hay tutores disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Actualmente no hay tutores registrados para esta materia.
            </p>
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}