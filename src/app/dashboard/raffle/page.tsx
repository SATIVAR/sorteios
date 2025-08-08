"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Trophy, Users, Ticket, Loader2 } from 'lucide-react';
import type { Participant, Raffle } from '@/lib/types';
import { raffles } from '@/lib/data';


function RaffleComponent() {
  const searchParams = useSearchParams();
  const raffleId = searchParams.get('id') || '1';
  const raffleData = useMemo(() => raffles.find(r => r.id === raffleId)!, [raffleId]);

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [numToDraw, setNumToDraw] = useState(1);
  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    if (raffleData) {
      setParticipants(raffleData.participants);
      setWinners(raffleData.winners);
    }
  }, [raffleData]);

  const drawWinners = () => {
    if (drawing || participants.length === 0) return;

    setDrawing(true);
    const toDraw = Math.min(numToDraw, participants.length, raffleData.totalWinners - winners.length);
    if(toDraw <= 0) {
        setDrawing(false);
        return;
    }
    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const newWinners = shuffled.slice(0, toDraw);

    const remainingParticipants = participants.filter(p => !newWinners.some(w => w.id === p.id));

    setTimeout(() => {
      setWinners(prev => [...prev, ...newWinners]);
      setParticipants(remainingParticipants);
      setDrawing(false);
      
      newWinners.forEach((_, i) => {
        setTimeout(() => {
          confetti({
            particleCount: 200,
            spread: 90,
            origin: { y: 0.6 },
            gravity: 0.8
          });
        }, i * 200);
      });

    }, 2500); 
  };

  const isRaffleOver = useMemo(() => winners.length >= raffleData.totalWinners || participants.length === 0, [winners, participants, raffleData.totalWinners]);

  if (!raffleData) {
    return (
        <div className="flex items-center justify-center h-full">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="ml-2">Carregando dados do sorteio...</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold font-headline tracking-tight">{raffleData.title}</h1>
        <p className="text-muted-foreground">{raffleData.description}</p>
      </header>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Piscina de Participantes</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{participants.length}</div></CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencedores Sorteados</CardTitle>
            <Trophy className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{winners.length} / {raffleData.totalWinners}</div></CardContent>
        </Card>
         <Card className="bg-background">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Participantes</CardTitle>
            <Ticket className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent><div className="text-3xl font-bold">{raffleData.totalParticipants}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="bg-background shadow-lg">
            <CardHeader>
              <CardTitle>Sortear Vencedores</CardTitle>
              <CardDescription>Selecione quantos vencedores sortear e inicie o sorteio.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:w-auto flex-grow">
                <Label htmlFor="num-draw">Vencedores a sortear</Label>
                <Input 
                  id="num-draw" 
                  type="number" 
                  value={numToDraw} 
                  onChange={(e) => setNumToDraw(Math.max(1, parseInt(e.target.value, 10)))}
                  min="1"
                  max={raffleData.totalWinners - winners.length}
                  disabled={drawing || isRaffleOver}
                  className="bg-background"
                />
              </div>
              <Button 
                onClick={drawWinners} 
                className="w-full sm:w-auto text-lg py-6 rounded-full font-bold"
                disabled={drawing || isRaffleOver}
              >
                {drawing ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sorteando...</> : isRaffleOver ? 'Sorteio Concluído' : `Sortear ${numToDraw} Vencedor(es)`}
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-background">
            <CardHeader>
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="text-yellow-500" /> 
                Vencedores
              </CardTitle>
            </CardHeader>
            <CardContent>
              {winners.length === 0 && <p className="text-muted-foreground text-center py-8">Os vencedores aparecerão aqui assim que forem sorteados.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {winners.map((winner, index) => (
                  <div key={winner.id} className="p-4 border rounded-lg bg-background shadow-md flex items-center gap-4 animate-in fade-in zoom-in-95" style={{animationDelay: `${index * 100}ms`}}>
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
                    <CardTitle>Participantes</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
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
        <Suspense fallback={<div>Carregando...</div>}>
            <RaffleComponent />
        </Suspense>
    )
}
