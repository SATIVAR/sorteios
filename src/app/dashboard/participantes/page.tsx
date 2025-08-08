"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Upload, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const participantes = [
  { id: 1, nome: "Carlos Silva", email: "carlos.silva@example.com", sorteio: "Sorteio Anual" },
  { id: 2, nome: "Mariana Costa", email: "mariana.costa@example.com", sorteio: "Sorteio Anual" },
  { id: 3, nome: "João Pereira", email: "joao.pereira@example.com", sorteio: "Giveaway de Tecnologia" },
  { id: 4, nome: "Ana Oliveira", email: "ana.oliveira@example.com", sorteio: "Sorteio Anual" },
];

export default function ParticipantesPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold font-headline tracking-tight">Participantes</h1>
        <p className="text-muted-foreground">Gerencie os participantes dos seus sorteios.</p>
      </header>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Input placeholder="Buscar participante por nome ou e-mail..." className="bg-background"/>
          <Select>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Filtrar por sorteio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos Sorteios</SelectItem>
              <SelectItem value="sorteio-anual">Sorteio Anual</SelectItem>
              <SelectItem value="giveaway-tech">Giveaway de Tecnologia</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline"><Search className="h-4 w-4"/></Button>
        </div>
        <div className="flex items-center gap-2">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar
            </Button>
        </div>
      </div>

       <Card className="shadow-lg bg-background">
        <CardHeader>
          <CardTitle>Lista de Participantes</CardTitle>
          <CardDescription>
            Visualize e gerencie todos os participantes cadastrados nos sorteios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Sorteio Associado</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participantes.map((participante, index) => (
                <TableRow key={participante.id}>
                  <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{participante.nome}</TableCell>
                  <TableCell>{participante.email}</TableCell>
                  <TableCell className="text-muted-foreground">{participante.sorteio}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Editar</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Remover</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
