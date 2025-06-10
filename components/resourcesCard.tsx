
import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";

interface resourcesCardProps {
  icon: any;
  description1: string;
  description2: string;
  description3: string;
  sitelink: string;
}

function ResourcesCard({
  icon,
  description1,
  description2,
  description3,
  sitelink,
}: resourcesCardProps) {
  const imageSrc = typeof icon === "object" && icon.src ? icon.src : icon;

  return (
    <Card className="w-full max-w-[280px] bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center justify-center h-12 mb-4">
          <img
            src={imageSrc}
            alt="Resource Logo"
            className="max-h-12 max-w-full object-contain"
          />
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6">
        <div className="space-y-3 mb-8">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{description1}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{description2}</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{description3}</span>
          </div>
        </div>

        <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-md font-medium transition-colors">
          <Link target="_blank" href={sitelink} className="block w-full">
            ir al sitio
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default ResourcesCard;