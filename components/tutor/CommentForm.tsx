import React, { useState } from "react";

export type CommentFormProps = {
	onSubmit: (comment: string, rating: number) => Promise<void>;
	loading?: boolean;
	userName?: string; // Para mostrar el nombre del usuario si se desea
};

const CommentForm: React.FC<CommentFormProps> = ({
	onSubmit,
	loading = false,
	userName,
}) => {
	const [comment, setComment] = useState("");
	const [rating, setRating] = useState(5);
	const [error, setError] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setSubmitted(false);

		if (!comment.trim()) {
			setError("Por favor escribe un comentario.");
			return;
		}

		if (rating < 1 || rating > 5) {
			setError("La puntuación debe estar entre 1 y 5.");
			return;
		}

		try {
			await onSubmit(comment, rating);
			setSubmitted(true);
			setComment("");
			setRating(5);
		} catch (err) {
			setError("Error al enviar el comentario. Intenta nuevamente.");
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="bg-white p-4 rounded-2xl shadow-md space-y-4"
		>
			<h3 className="text-xl font-semibold">Deja tu comentario</h3>

			<textarea
				className="w-full h-28 p-3 border rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
				placeholder="Escribe tu experiencia con el tutor..."
				value={comment}
				onChange={(e) => setComment(e.target.value)}
			/>

			<div className="flex items-center gap-2">
				<label className="font-medium">Puntuación:</label>
				<select
					className="border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-yellow-300"
					value={rating}
					onChange={(e) => setRating(Number(e.target.value))}
				>
					{[5, 4, 3, 2, 1].map((r) => (
						<option key={r} value={r}>
							{r} ★
						</option>
					))}
				</select>
			</div>

			{error && <p className="text-red-500 text-sm">{error}</p>}
			{submitted && (
				<p className="text-green-600 text-sm">
					¡Comentario enviado correctamente!
				</p>
			)}

			<button
				type="submit"
				disabled={loading}
				className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-xl disabled:opacity-50"
			>
				{loading ? "Enviando..." : "Enviar comentario"}
			</button>
		</form>
	);
};

export default CommentForm;
