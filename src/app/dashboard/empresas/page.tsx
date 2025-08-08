"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";

// Mock data
const empresas = [
  { id: 1, nome: "Empresa Alpha", cnpj: "11.222.333/0001-44", status: "Ativo", sorteios: 5 },
  { id: 2, nome: "Soluções Beta", cnpj: "44.555.666/0001-77", status: "Ativo", sorteios: 2 },
  { id: 3, nome: "Tecnologia Gamma", cnpj: "77.888.999/0001-00", status: "Inativo", sorteios: 0 },
];

export default function EmpresasPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Empresas (Clientes)</h1>
          <p className="text-muted-foreground">Gerencie suas empresas clientes aqui.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nova Empresa
        </Button>
      </header>
       <Card className="shadow-lg bg-background">
        <CardHeader>
          <CardTitle>Empresas Cadastradas</CardTitle>
          <CardDescription>
            Visualize e gerencie as empresas que utilizam o sistema de sorteios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Nome da Empresa</TableHead>
                <TableHead>CNPJ</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Sorteios Vinculados</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {empresas.map((empresa, index) => (
                <TableRow key={empresa.id}>
                  <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                  <TableCell className="font-medium">{empresa.nome}</TableCell>
                   <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell>
                    <Badge variant={empresa.status === 'Ativo' ? 'default' : 'secondary'}
                      className={empresa.status === 'Ativo' ? 'bg-green-500 text-white border-transparent' : 'bg-gray-500 text-white border-transparent'}
                    >
                      {empresa.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{empresa.sorteios}</TableCell>
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
                        <DropdownMenuItem>Ver Sorteios</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
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
