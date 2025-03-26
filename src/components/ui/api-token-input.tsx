
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface ApiTokenInputProps {
  onSave?: (token: string) => void;
  buttonText?: string;
  savedToken?: string;
}

export const ApiTokenInput: React.FC<ApiTokenInputProps> = ({
  onSave,
  buttonText = "Conectar API Beds24",
  savedToken = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(savedToken);

  const handleSave = () => {
    if (!token.trim()) {
      toast.error("Por favor, insira um token válido.");
      return;
    }

    if (onSave) {
      onSave(token);
    } else {
      toast.success("Token da API salvo com sucesso!");
    }
    
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={savedToken ? "outline" : "default"}>
          {savedToken ? "Editar Token API" : buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle>Conectar com Beds24 API v2</DialogTitle>
          <DialogDescription>
            Cole seu Access Token da API Beds24 v2 abaixo. 
            Você pode encontrar seu token no painel Beds24 em Configurações &rarr; API.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token">Access Token</Label>
            <Input
              id="token"
              type="password"
              placeholder="Cole seu token aqui..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Nota: Use Access Token e NÃO LongLife Token para maior segurança.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Token
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
