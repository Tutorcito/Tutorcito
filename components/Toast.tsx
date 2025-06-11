"use client";

import React, { useState, useEffect } from "react";
import { X, AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	message: string;
	type: ToastType;
	duration?: number;
}

interface ToastComponentProps {
	toast: Toast;
	onRemove: (id: string) => void;
}

const ToastComponent: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
	useEffect(() => {
		const timer = setTimeout(() => {
			onRemove(toast.id);
		}, toast.duration || 5000);

		return () => clearTimeout(timer);
	}, [toast.id, toast.duration, onRemove]);

	const getToastStyles = () => {
		switch (toast.type) {
			case "success":
				return "bg-green-50 border-green-200 text-green-800";
			case "error":
				return "bg-red-50 border-red-200 text-red-800";
			case "warning":
				return "bg-yellow-50 border-yellow-200 text-yellow-800";
			case "info":
				return "bg-blue-50 border-blue-200 text-blue-800";
			default:
				return "bg-gray-50 border-gray-200 text-gray-800";
		}
	};

	const getIcon = () => {
		switch (toast.type) {
			case "success":
				return <CheckCircle className="w-5 h-5 text-green-500" />;
			case "error":
				return <XCircle className="w-5 h-5 text-red-500" />;
			case "warning":
				return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
			case "info":
				return <Info className="w-5 h-5 text-blue-500" />;
			default:
				return <Info className="w-5 h-5" />;
		}
	};

	return (
		<div
			className={`
      flex items-center p-4 mb-3 rounded-lg border shadow-sm
      transform transition-all duration-300 ease-in-out
      animate-in slide-in-from-right-full
      ${getToastStyles()}
    `}
		>
			<div className="flex-shrink-0 mr-3">{getIcon()}</div>
			<div className="flex-1 text-sm font-medium">{toast.message}</div>
			<button
				onClick={() => onRemove(toast.id)}
				className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
			>
				<X className="w-4 h-4" />
			</button>
		</div>
	);
};

interface ToastContainerProps {
	toasts: Toast[];
	onRemove: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
	toasts,
	onRemove,
}) => {
	return (
		<div className="fixed top-4 right-4 z-50 max-w-sm w-full space-y-2">
			{toasts.map((toast) => (
				<ToastComponent key={toast.id} toast={toast} onRemove={onRemove} />
			))}
		</div>
	);
};
