"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileDown, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// Mock data
const resultados = [
  { id: '3', title: "Especial de Fim de Ano 2023", status: "Concluído", totalWinners: 3, winners: [
    { name: 'Vencedor Um', email: 'vencedor1@example.com' },
    { name: 'Vencedor Dois', email: 'vencedor2@example.com' },
    { name: 'Vencedor Três', email: 'vencedor3@example.com' },
  ]},
  { id: '1', title: "Sorteio Anual de Grande Prêmio", status: "Ativo", totalWinners: 5, winners: [] },
  { id: '2', title: "Giveaway de Tecnologia Q2", status: "Rascunho", totalWinners: 10, winners: [] },
];

export default function ResultadosPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold font-headline tracking-tight">Resultados</h1>
            <p className="text-muted-foreground">Visualize os resultados dos seus sorteios concluídos.</p>
        </div>
         <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Todos
        </Button>
      </header>

       <div className="flex items-center gap-2">
           <Select defaultValue="concluido">
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="rascunho">Rascunho</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Search className="h-4 w-4"/></Button>
        </div>


        <div className="space-y-8">
            {resultados.filter(r => r.status === 'Concluído').map(sorteio => (
                <Card key={sorteio.id} className="shadow-lg bg-background">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle>{sorteio.title}</CardTitle>
                            <CardDescription>
                                {sorteio.winners.length} de {sorteio.totalWinners} vencedores sorteados.
                            </CardDescription>
                        </div>
                         <Button variant="secondary">
                            <FileDown className="mr-2 h-4 w-4" />
                            Exportar Vencedores
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Pos.</TableHead>
                                    <TableHead>Vencedor</TableHead>
                                    <TableHead>E-mail</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sorteio.winners.length > 0 ? sorteio.winners.map((winner, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-9 w-9">
                                                    <AvatarFallback className="bg-primary text-primary-foreground">{winner.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{winner.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{winner.email}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                                            Ainda não há vencedores para este sorteio.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            ))}
        </div>
    </div>
  );
}
