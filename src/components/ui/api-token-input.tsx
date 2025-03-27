
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ApiTokenInputProps {
  buttonText?: string;
}

export const ApiTokenInput: React.FC<ApiTokenInputProps> = ({
  buttonText = "API Beds24 Conectada"
}) => {
  const handleButtonClick = () => {
    toast.info("A conexão com a API Beds24 já está configurada no backend");
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleButtonClick}
      className="flex items-center gap-2"
    >
      <div className="h-2 w-2 rounded-full bg-green-500"></div>
      {buttonText}
    </Button>
  );
};
