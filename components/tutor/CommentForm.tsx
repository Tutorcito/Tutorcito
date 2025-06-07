"use client";

import React, { useState } from "react";

type CommentFormProps = {
    onSubmit: (content: string, rating: number) => void;
};

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            setError("El comentario no puede estar vacío");
            return;
        }
        setError("");
        onSubmit(content.trim(), rating);
        setContent("");
        setRating(5);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
            <h2 className="text-lg font-semibold">Dejar un comentario</h2>
            <textarea
                className="w-full border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
                placeholder="Escribe tu opinión sobre el tutor..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <label htmlFor="rating" className="text-sm font-medium">Puntaje:</label>
                    <select
                        id="rating"
                        className="border border-gray-300 rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                    >
                        {[1, 2, 3, 4, 5].map((val) => (
                            <option key={val} value={val}>
                                {val} ★
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    Enviar comentario
                </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
        </form>
    );
};

export default CommentForm;
