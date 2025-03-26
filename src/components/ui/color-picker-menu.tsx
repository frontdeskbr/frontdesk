
import React from 'react';
import { Palette } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/theme-context';

export function ColorPickerMenu() {
  const { setPrimaryColor } = useTheme();
  
  const colorOptions = [
    { name: 'Azul', value: 'blue', class: 'bg-blue-500' },
    { name: 'Roxo', value: 'purple', class: 'bg-purple-500' },
    { name: 'Verde', value: 'green', class: 'bg-green-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
    { name: 'Âmbar', value: 'amber', class: 'bg-amber-500' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8">
          <Palette size={18} />
          <span className="sr-only">Alterar cores</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {colorOptions.map((color) => (
          <DropdownMenuItem
            key={color.value}
            onClick={() => setPrimaryColor(color.value as any)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className={`w-4 h-4 rounded-full ${color.class}`} />
            <span>{color.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
