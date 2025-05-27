import React from "react";

const Step4 = () => {
	return (
        <div className="flex flex-col items-center">
            {/* Progress bar */}
			<div className="w-full flex justify-between mb-8 gap-1">
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
				<div className="h-1 bg-blue-500 w-1/4 rounded-full"></div>
			</div>
			<div className="text-center mb-4">
				<h1 className="text-3xl font-bold mb-2">Bienvenido a Tutorcito</h1>
			</div>

			<h2 className="text-xl font-semibold text-gray-500 mb-6">
				Últimos pasos
			</h2>
        </div>
    );
};

export default Step4;
