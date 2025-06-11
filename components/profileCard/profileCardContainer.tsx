"use client";

import React, { useEffect, useState } from "react";
import { supabase, getUserProfile, Profile, PriceOption } from "@/lib/supabase";

import ProfileBanner from "./profileBanner";
import ProfileHeader from "./profileHeader";
import AboutMe from "./aboutMe";
import PricingSection from "./pricingSection";
import KnowledgeSection, { TutorFile } from "./knowledgeSection";
import ProfileActions from "./profileActions";

// Import the dialog components
import EditAboutDialog from "./dialogs/EditAboutDialog";
import EditKnowledgeDialog from "./dialogs/EditKnowledgeDialog";
import EditPricesDialog from "./dialogs/EditPriceDialog";

const ProfileCardContainer: React.FC = () => {
	// Main profile data
	const [userData, setUserData] = useState<Profile | null>(null);
	const [userId, setUserId] = useState<string | null>(null);

	// Additional data that needs to be fetched separately
	const [tutorFiles, setTutorFiles] = useState<TutorFile[]>([]);
	const [prices, setPrices] = useState<PriceOption[]>([]);

	// Dialog visibility state
	const [isAboutDialogOpen, setIsAboutDialogOpen] = useState(false);
	const [isKnowledgeDialogOpen, setIsKnowledgeDialogOpen] = useState(false);
	const [isPricesDialogOpen, setIsPricesDialogOpen] = useState(false);

	// Fetch user profile and related data
	useEffect(() => {
		const fetchUserData = async () => {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (!user) return;

			setUserId(user.id);

			// Fetch main profile
			const profile = await getUserProfile(user.id);
			if (profile) {
				setUserData(profile);

				// Set prices from profile or default values
				if (profile.prices) {
					// Convert single PriceOption to array if needed
					setPrices(
						Array.isArray(profile.prices) ? profile.prices : [profile.prices]
					);
				} else {
					// Default prices if none exist
					setPrices([
						{ price: "ARS 3500", duration: "30 min" },
						{ price: "ARS 5000", duration: "60 min" },
						{ price: "ARS 7500", duration: "90 min" },
					]);
				}
			}

			// Fetch tutor files if user is a tutor
			if (profile?.role === "tutor" || profile?.role === "ambos") {
				const { data: filesData, error: filesError } = await supabase
					.from("tutor_files")
					.select("*")
					.eq("tutor_id", user.id)
					.order("created_at", { ascending: false });

				if (filesError) {
					console.error("Error fetching tutor files:", filesError);
				} else {
					setTutorFiles(filesData || []);
				}
			}
		};

		fetchUserData();
	}, []);

	// Dialog handlers
	const handleOpenAboutDialog = () => setIsAboutDialogOpen(true);
	const handleCloseAboutDialog = () => setIsAboutDialogOpen(false);

	const handleOpenKnowledgeDialog = () => setIsKnowledgeDialogOpen(true);
	const handleCloseKnowledgeDialog = () => setIsKnowledgeDialogOpen(false);

	const handleOpenPricesDialog = () => setIsPricesDialogOpen(true);
	const handleClosePricesDialog = () => setIsPricesDialogOpen(false);

	// Update handlers - these will be called when dialogs successfully save
	const handleAboutUpdate = (newAbout: string) => {
		setUserData((prev) => (prev ? { ...prev, about_me: newAbout } : null));
	};

	const handleKnowledgeUpdate = (newFiles: TutorFile[]) => {
		setTutorFiles(newFiles);
	};

	const handlePricesUpdate = (newPrices: PriceOption[]) => {
		setPrices(newPrices);
		// Also update the userData to keep it in sync
		setUserData((prev) => (prev ? { ...prev, prices: newPrices } : null));
	};

	// Loading state
	if (!userData || !userId) {
		return <p className="text-center mt-10">Cargando perfil...</p>;
	}

	// Check if user is a tutor to show tutor-specific sections
	const isTutor = userData.role === "tutor" || userData.role === "ambos";

	return (
		<>
			<div className="flex justify-center items-start min-h-screen">
				<div className="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col gap-4 pb-10 p-4">
					<ProfileBanner
						bannerUrl=""
						avatarUrl={userData.profile_picture ?? ""}
					/>

					<ProfileHeader
						name={userData.full_name ?? "Sin nombre"}
						title={userData.degree ?? ""}
					/>

					<AboutMe
						content={
							userData.about_me ??
							"Aún no has agregado información sobre ti. Haz clic en editar para agregar una descripción."
						}
						onEdit={handleOpenAboutDialog}
					/>

					{/* Only show pricing section for tutors */}
					{isTutor && (
						<PricingSection prices={prices} onEdit={handleOpenPricesDialog} />
					)}

					{/* Only show knowledge section for tutors */}
					{isTutor && (
						<KnowledgeSection
							files={tutorFiles}
							onEdit={handleOpenKnowledgeDialog}
						/>
					)}

					<div className="mt-4 px-4">
						<ProfileActions />
					</div>
				</div>
			</div>

			{/* Edit Dialogs */}
			<EditAboutDialog
				isOpen={isAboutDialogOpen}
				onClose={handleCloseAboutDialog}
				currentAbout={userData.about_me ?? ""}
				userId={userId}
				onUpdate={handleAboutUpdate}
			/>

			{isTutor && (
				<>
					<EditKnowledgeDialog
						isOpen={isKnowledgeDialogOpen}
						onClose={handleCloseKnowledgeDialog}
						currentFiles={tutorFiles}
						userId={userId}
						onUpdate={handleKnowledgeUpdate}
					/>

					<EditPricesDialog
						isOpen={isPricesDialogOpen}
						onClose={handleClosePricesDialog}
						currentPrices={prices}
						userId={userId}
						onUpdate={handlePricesUpdate}
					/>
				</>
			)}
		</>
	);
};

export default ProfileCardContainer;
