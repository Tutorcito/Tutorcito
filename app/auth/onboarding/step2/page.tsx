"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Step2() {
	const router = useRouter();
	const [user, setUser] = useState<any>(null);
	const [profile, setProfile] = useState<any>(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [degree, setDegree] = useState("");
	const [year, setYear] = useState("");
	const [isLoading, setIsLoading] = useState(false);

    const getProfile = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/auth/login');
            return;
        };
        
        setUser(user);

        const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

        if (data) {
            setProfile(data);
        };

        if (!data.role) {
            router.push('/auth/onboarding/step1');
            return;
        }

        if (data.full_name) {
            const nameParts = data.full_name.split(" ");
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
        }
        setDegree(data.degree || "");
        setYear(data.year_in_degree ? data.year_in_degree.toString() : "");
    };

    useEffect(() => {
        getProfile()
    }, [router]);

    const handleNext = async () => {
        if (!user) return;

        setIsLoading(true);

        try {
            const fullName = `${firstName} ${lastName}`.trim()
            const yearNumber = parseInt(year, 10);

            await supabase
            .from('profiles')
            .update({
                full_name: fullName,
                degree: degree,
                year_in_degree: yearNumber
            })
        } catch (error) {
            
        }
    }

}
