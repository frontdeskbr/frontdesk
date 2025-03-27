
import React from "react";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ColorPickerMenuProps {
  triggerClassName?: string;
}

export const ColorPickerMenu: React.FC<ColorPickerMenuProps> = ({ triggerClassName }) => {
  // Function to set theme color
  const setThemeColor = (color: string) => {
    document.documentElement.style.setProperty("--primary", color);
    localStorage.setItem("theme-color", color);
  };

  // Predefined colors
  const colors = [
    { name: "Default Blue", value: "214 80% 56%" },
    { name: "Purple", value: "262 80% 56%" },
    { name: "Green", value: "142 76% 36%" },
    { name: "Red", value: "0 72% 51%" },
    { name: "Orange", value: "24 95% 53%" },
    { name: "Pink", value: "330 81% 60%" },
    { name: "Teal", value: "174 75% 37%" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={triggerClassName}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colors.map((color) => (
          <DropdownMenuItem
            key={color.name}
            onClick={() => setThemeColor(color.value)}
            className="flex items-center gap-2"
          >
            <div
              className="h-4 w-4 rounded-full border"
              style={{ backgroundColor: `hsl(${color.value})` }}
            />
            <span>{color.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
