import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Ticket, Users, CheckCircle, PlusCircle } from "lucide-react";
import { raffles } from "@/lib/data";

export default function DashboardPage() {
  const totalParticipants = raffles.reduce((acc, r) => acc + r.participants.length, 0);

  return (
    <div className="flex flex-col gap-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold font-headline tracking-tight">Painel</h1>
          <p className="text-muted-foreground">Bem-vindo(a) de volta! Aqui está um resumo dos seus sorteios.</p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Sorteio
        </Button>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorteios Totais</CardTitle>
            <Ticket className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{raffles.length}</div>
            <p className="text-xs text-muted-foreground">+2 desde o mês passado</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes Totais</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalParticipants}</div>
            <p className="text-xs text-muted-foreground">Em todos os sorteios ativos</p>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sorteios Concluídos</CardTitle>
            <CheckCircle className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{raffles.filter(r => r.status === 'Concluído').length}</div>
            <p className="text-xs text-muted-foreground">Todos os vencedores sorteados</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Gerenciamento de Sorteios</CardTitle>
                <CardDescription>Visualize, gerencie e execute seus sorteios.</CardDescription>
            </CardHeader>
            <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Participantes</TableHead>
                <TableHead className="text-right">Vencedores</TableHead>
                <TableHead><span className="sr-only">Ações</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {raffles.map((raffle) => (
                <TableRow key={raffle.id}>
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
                  <TableCell className="text-right">{raffle.participants.length} / {raffle.totalParticipants}</TableCell>
                  <TableCell className="text-right">{raffle.winners.length} / {raffle.totalWinners}</TableCell>
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
                            <Link href={`/dashboard/raffle?id=${raffle.id}`}>Executar Sorteio</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Gerenciar Participantes</DropdownMenuItem>
                        <DropdownMenuItem>Ver Vencedores</DropdownMenuItem>
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
    </div>
  );
}
