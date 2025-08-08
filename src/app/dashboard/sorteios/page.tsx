import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function SorteiosPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold font-headline tracking-tight">Sorteios</h1>
        <p className="text-muted-foreground">Gerencie seus sorteios aqui.</p>
      </header>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <Ticket className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-2xl font-bold tracking-tight">
            Em Breve
          </h3>
          <p className="text-sm text-muted-foreground">
            Esta seção está em desenvolvimento e estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  );
}
