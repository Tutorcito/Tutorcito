"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProfileCardContainer from "@/components/profileCard/profileCardContainer";

const Profile = () => {
    const router = useRouter();
    const { id } = useParams();

    //Users can only access their own profiles.
    const checkAccess = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user || user.id === id) {
            router.replace("/");
        };
    };
    
    //Always is checking for changes in the search query.
    useEffect(() => {
        checkAccess();
    }, [id, router]);

    return (
        <div className="flex flex-col items-center justify-center p-12">
            <h1 className="text-2xl font-bold text-center mb-8">Mi perfil</h1>
            <ProfileCardContainer />
        </div>
    );
};

export default Profile