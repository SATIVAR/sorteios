

"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Trophy, Users, Ticket, Loader2, Calendar as CalendarIcon, X } from 'lucide-react';
import type { Participant, Raffle } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { RaffleFormBuilder } from '@/components/raffle-form-builder';

function RaffleConfigComponent() {
  const searchParams = useSearchParams();
  const raffleId = searchParams.get('id');
  const { toast } = useToast();

  const [raffleData, setRaffleData] = useState<Raffle | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [numToDraw, setNumToDraw] = useState(1);
  const [drawDates, setDrawDates] = useState<(Date | undefined)[]>([]);
  const [savingDates, setSavingDates] = useState(false);

  const fetchRaffle = async () => {
    if (!raffleId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const raffleRef = doc(db, 'raffles', raffleId);
      const docSnap = await getDoc(raffleRef);

      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Raffle;
        setRaffleData(data);
        const winnerIds = new Set((data.winners || []).map(w => w.id));
        setParticipants((data.participants || []).filter(p => !winnerIds.has(p.id)));
        setWinners(data.winners || []);
        setDrawDates((data.drawDates || []).map(d => new Date(d)));
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching raffle:", error)
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRaffle();
  }, [raffleId]);

  const handleDateChange = (date: Date | undefined, index: number) => {
    const newDates = [...drawDates];
    newDates[index] = date;
    setDrawDates(newDates);
  };
  
  const addDateField = () => {
    if (raffleData && drawDates.length < raffleData.totalWinners) {
      setDrawDates([...drawDates, undefined]);
    }
  };

  const removeDateField = (index: number) => {
    const newDates = [...drawDates];
    newDates.splice(index, 1);
    setDrawDates(newDates);
  };
  
  const handleSaveDates = async () => {
    if (!raffleId) return;
    setSavingDates(true);
    try {
        const raffleRef = doc(db, 'raffles', raffleId);
        const datesToSave = drawDates.map(date => date ? date.toISOString() : null).filter(Boolean);
        await updateDoc(raffleRef, {
            drawDates: datesToSave
        });
        toast({
            title: "Sucesso!",
            description: "Datas do sorteio salvas com sucesso.",
            variant: "success"
        });
    } catch (error) {
        console.error("Error saving dates:", error);
        toast({
            title: "Erro",
            description: "Não foi possível salvar as datas.",
            variant: "destructive"
        });
    } finally {
        setSavingDates(false);
    }
  };


  const isRaffleOver = useMemo(() => {
    if (!raffleData) return false;
    return raffleData.status === 'Concluído' || (raffleData.totalWinners > 0 && winners.length >= raffleData.totalWinners);
  }, [winners, raffleData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando dados do sorteio...</p>
      </div>
    );
  }

  if (!raffleData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p>Sorteio não encontrado ou ID inválido.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold font-headline tracking-tight">{raffleData.title}</h1>
        <p className="text-muted-foreground">{raffleData.description}</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-background shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Piscina de Participantes</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{participants.length}</div></CardContent>
        </Card>
        <Card className="bg-background shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencedores Sorteados</CardTitle>
            <Trophy className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{winners.length} / {raffleData.totalWinners}</div></CardContent>
        </Card>
        <Card className="bg-background shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Vagas</CardTitle>
            <Ticket className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{raffleData.totalParticipants === 0 ? '∞' : raffleData.totalParticipants}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-background shadow-lg">
            <CardHeader>
              <CardTitle>Configurar Sorteio</CardTitle>
              <CardDescription>Defina os parâmetros antes de iniciar a execução do sorteio.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-end gap-4">
                    <div className="w-full sm:w-auto flex-grow">
                        <Label htmlFor="num-draw">Quantidade de Sorteados por rodada</Label>
                        <Input
                        id="num-draw"
                        type="number"
                        value={numToDraw}
                        onChange={(e) => setNumToDraw(Math.max(1, parseInt(e.target.value, 10) || 1))}
                        min="1"
                        max={raffleData ? raffleData.totalWinners - winners.length : 1}
                        disabled={isRaffleOver}
                        className="bg-background"
                        />
                    </div>
                    <Button
                        asChild={!isRaffleOver}
                        className="w-full sm:w-auto text-lg py-6 rounded-full font-bold"
                        disabled={isRaffleOver}
                        size="lg"
                    >
                        {isRaffleOver ? (
                            <span>Rodar Sorteio</span>
                        ) : (
                        <Link href={`/dashboard/raffle/run?id=${raffleId}&numToDraw=${numToDraw}`}>
                            Rodar Sorteio
                        </Link>
                        )}
                    </Button>
                </div>
                 <div className="space-y-4 pt-4 border-t">
                    <Label>
                        {raffleData.totalWinners > 1 ? 'Datas dos Sorteios' : 'Data do Sorteio'}
                    </Label>
                    {raffleData.totalWinners === 1 ? (
                        <DatePicker date={drawDates[0]} setDate={(d) => handleDateChange(d, 0)} />
                    ) : (
                        <div className="space-y-3">
                        {drawDates.map((date, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <DatePicker 
                                    date={date} 
                                    setDate={(d) => handleDateChange(d, index)} 
                                />
                                <Button variant="ghost" size="icon" onClick={() => removeDateField(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                         {drawDates.length < raffleData.totalWinners && (
                            <Button variant="outline" size="sm" onClick={addDateField}>Adicionar Data</Button>
                         )}
                        </div>
                    )}
                    <Button onClick={handleSaveDates} disabled={savingDates}>
                        {savingDates ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                        Salvar Datas
                    </Button>
                </div>
            </CardContent>
          </Card>
          
          <RaffleFormBuilder raffle={raffleData} onFormSaved={fetchRaffle} />

          <Card className="shadow-lg bg-background">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" />
                Vencedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {winners.length === 0 && <p className="text-muted-foreground text-center py-8">Os vencedores aparecerão aqui.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {winners.map((winner) => (
                  <div key={winner.id} className="p-4 border rounded-lg bg-background shadow-md flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">{winner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-lg">{winner.name}</p>
                      <p className="text-sm text-muted-foreground">{winner.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-lg bg-background">
            <CardHeader>
              <CardTitle>Participantes Restantes</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {participants.map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-2 rounded-md hover:bg-muted">
                      <Avatar>
                        <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.email}</p>
                      </div>
                    </div>
                  ))}
                  {participants.length === 0 && !loading && (
                    <p className="text-muted-foreground text-center py-8">Nenhum participante restante.</p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function RafflePage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="ml-2">Carregando...</p>
      </div>
    }>
      <RaffleConfigComponent />
    </Suspense>
  )
}
