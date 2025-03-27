
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      setIsSubmitting(true);
      
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
      toast.error("Erro ao salvar token. Tente novamente.");
    } finally {
      setIsSubmitting(false);
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
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Salvando...
              </span>
            ) : (
              "Salvar Token"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
