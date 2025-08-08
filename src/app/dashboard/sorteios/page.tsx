"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Raffle } from "@/lib/types";

export default function SorteiosPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRaffles = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "raffles"));
        const rafflesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Raffle));
        setRaffles(rafflesData);
      } catch (error) {
        console.error("Error fetching raffles: ", error);
      }
      setLoading(false);
    };

    fetchRaffles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando sorteios...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Gerenciar Sorteios</h1>
          <p className="text-muted-foreground">Crie, visualize e gerencie seus sorteios.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Sorteio
        </Button>
      </header>

      <Card className="shadow-lg bg-background">
        <CardHeader>
          <CardTitle>Sorteios Existentes</CardTitle>
          <CardDescription>
            Aqui está uma lista de todos os seus sorteios.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Participantes</TableHead>
                <TableHead className="text-right">Vencedores</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.length === 0 && !loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24">
                    Nenhum sorteio encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                raffles.map((raffle, index) => (
                  <TableRow key={raffle.id}>
                    <TableCell className="font-mono text-muted-foreground">{index + 1}</TableCell>
                    <TableCell className="font-medium">{raffle.title}</TableCell>
                    <TableCell>
                       <Badge variant={raffle.status === 'Ativo' ? 'default' : raffle.status === 'Concluído' ? 'secondary' : 'outline'}
                        className={`${
                            raffle.status === 'Ativo' ? 'bg-green-500 text-white' : 
                            raffle.status === 'Concluído' ? 'bg-gray-500 text-white' : 
                            'bg-yellow-500 text-white'
                        } border-transparent`}
                        >
                            {raffle.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">{(raffle.participants?.length || 0)} / {raffle.totalParticipants}</TableCell>
                    <TableCell className="text-right">{(raffle.winners?.length || 0)} / {raffle.totalWinners}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                              <Link href={`/dashboard/raffle?id=${raffle.id}`}>Visualizar Sorteio</Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Editar</DropdownMenuItem>
                          <DropdownMenuItem>Gerenciar Participantes</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Excluir</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
