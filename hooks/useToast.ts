"use client";

import { toast } from "sonner";

export const useToast = () => {
	const success = (message: string, duration?: number) => {
		return toast.success(message, {
			duration: duration || 5000,
		});
	};

	const error = (message: string, duration?: number) => {
		return toast.error(message, {
			duration: duration || 5000,
		});
	};

	const warning = (message: string, duration?: number) => {
		return toast.warning(message, {
			duration: duration || 5000,
		});
	};

	const info = (message: string, duration?: number) => {
		return toast.info(message, {
			duration: duration || 5000,
		});
	};

	const addToast = (
		message: string,
		type: "success" | "error" | "warning" | "info" = "info",
		duration?: number
	) => {
		switch (type) {
			case "success":
				return success(message, duration);
			case "error":
				return error(message, duration);
			case "warning":
				return warning(message, duration);
			case "info":
				return info(message, duration);
			default:
				return info(message, duration);
		}
	};

	return {
		success,
		error,
		warning,
		info,
		addToast,
	};
};
