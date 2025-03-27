
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Beds24Token, saveBeds24Token } from "@/services/beds24Api";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { ptBR } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface ApiTokenInputProps {
  onSave?: (token: Beds24Token) => void;
  buttonText?: string;
  savedToken?: Beds24Token | null;
}

export const ApiTokenInput: React.FC<ApiTokenInputProps> = ({
  onSave,
  buttonText = "Conectar API Beds24",
  savedToken = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(savedToken?.token || "");
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(
    savedToken?.expires_at ? new Date(savedToken.expires_at) : undefined
  );

  const handleSave = async () => {
    if (!token.trim()) {
      toast.error("Por favor, insira um token válido.");
      return;
    }

    if (!expiresAt) {
      toast.error("Por favor, selecione a data de expiração do token.");
      return;
    }

    try {
      const tokenData: Partial<Beds24Token> = {
        token,
        expires_at: expiresAt.toISOString(),
      };

      const savedData = await saveBeds24Token(tokenData);
      
      if (onSave) {
        onSave(savedData);
      }
      
      setIsOpen(false);
    } catch (error) {
      console.error("Erro ao salvar token:", error);
    }
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
          
          <div className="space-y-2">
            <Label htmlFor="expires-at">Data de Expiração</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="expires-at"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !expiresAt && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {expiresAt ? (
                    format(expiresAt, "PPP", { locale: ptBR })
                  ) : (
                    <span>Selecione a data de expiração</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={expiresAt}
                  onSelect={setExpiresAt}
                  initialFocus
                  disabled={(date) => date < new Date()}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground">
              Os tokens da API Beds24 v2 normalmente expiram em 24 horas após a geração.
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
