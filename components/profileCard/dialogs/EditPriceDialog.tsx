"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { supabase, PriceOption } from "@/lib/supabase";
import { useToast } from "@/hooks/useToast";

interface EditPricesDialogProps {
	isOpen: boolean;
	onClose: () => void;
	currentPrices: PriceOption[];
	userId: string;
	onUpdate: (newPrices: PriceOption[]) => void;
}

const EditPricesDialog: React.FC<EditPricesDialogProps> = ({
	isOpen,
	onClose,
	currentPrices,
	userId,
	onUpdate,
}) => {
	const [prices, setPrices] = useState<PriceOption[]>(
		currentPrices.length > 0 ? currentPrices : [{ price: "", duration: "" }]
	);
	const [isLoading, setIsLoading] = useState(false);
	const { success, error } = useToast();

	const addPriceOption = () => {
		setPrices([...prices, { price: "", duration: "" }]);
	};

	const removePriceOption = (index: number) => {
		if (prices.length > 1) {
			setPrices(prices.filter((_, i) => i !== index));
		}
	};

	const updatePriceOption = (
		index: number,
		field: keyof PriceOption,
		value: string
	) => {
		const updatedPrices = prices.map((price, i) =>
			i === index ? { ...price, [field]: value } : price
		);
		setPrices(updatedPrices);
	};

	const validatePrices = () => {
		return prices.every(
			(price) => price.price.trim() !== "" && price.duration.trim() !== ""
		);
	};

	const handleSave = async () => {
		if (!validatePrices()) {
			error("Por favor completa todos los campos de precio y duración");
			return;
		}

		setIsLoading(true);

		try {
			const { error: updateError } = await supabase
				.from("profiles")
				.update({ prices: prices })
				.eq("id", userId);

			if (updateError) {
				throw updateError;
			}

			onUpdate(prices);
			success("Precios actualizados correctamente");
			onClose();
		} catch (err) {
			console.error("Error updating prices:", err);
			error("Error al actualizar los precios");
		} finally {
			setIsLoading(false);
		}
	};

	const handleCancel = () => {
		setPrices(
			currentPrices.length > 0 ? currentPrices : [{ price: "", duration: "" }]
		);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[600px] bg-white max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Editar Precios</DialogTitle>
					<DialogDescription>
						Configura los precios de tus tutorías según la duración.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{prices.map((price, index) => (
						<div key={index} className="flex gap-3 items-end">
							<div className="flex-1">
								<Label htmlFor={`price-${index}`}>Precio (ej: ARS 3.500)</Label>
								<Input
									id={`price-${index}`}
									placeholder="ARS 3.500"
									value={price.price}
									onChange={(e) =>
										updatePriceOption(index, "price", e.target.value)
									}
                                    className="mt-2"
								/>
							</div>

							<div className="flex-1">
								<Label htmlFor={`duration-${index}`}>
									Duración (ej: 60 min)
								</Label>
								<Input
									id={`duration-${index}`}
									placeholder="60 min"
									value={price.duration}
									onChange={(e) =>
										updatePriceOption(index, "duration", e.target.value)
									}
                                    className="mt-2"
								/>
							</div>

							<Button
								variant="outline"
								size="icon"
								onClick={() => removePriceOption(index)}
								disabled={prices.length <= 1}
								className="flex-shrink-0"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</div>
					))}

					<Button
						variant="outline"
						onClick={addPriceOption}
						className="w-full mt-2"
						disabled={prices.length >= 5}
					>
						<Plus className="h-4 w-4 mr-2" />
						Agregar opción de precio
					</Button>

					{prices.length >= 5 && (
						<p className="text-sm text-gray-500 text-center">
							Máximo 5 opciones de precio
						</p>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleCancel} disabled={isLoading}>
						Cancelar
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "Guardando..." : "Guardar"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default EditPricesDialog;
