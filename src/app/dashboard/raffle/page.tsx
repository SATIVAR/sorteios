"use client";

import { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User, Trophy, Ticket, Users } from 'lucide-react';
import type { Participant, Raffle } from '@/lib/types';
import { raffles } from '@/lib/data';

const raffleData: Raffle = raffles.find(r => r.id === '1')!;

export default function RafflePage() {
  const [participants, setParticipants] = useState<Participant[]>(raffleData.participants);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [numToDraw, setNumToDraw] = useState(1);
  const [drawing, setDrawing] = useState(false);

  const drawWinners = () => {
    if (drawing || participants.length === 0) return;

    setDrawing(true);
    const toDraw = Math.min(numToDraw, participants.length, raffleData.totalWinners - winners.length);
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
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          });
        }, i * 200);
      });

    }, 2000); 
  };

  const isRaffleOver = useMemo(() => winners.length >= raffleData.totalWinners || participants.length === 0, [winners, participants, raffleData.totalWinners]);

  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-4xl font-bold font-headline tracking-tight">{raffleData.title}</h1>
        <p className="text-muted-foreground">{raffleData.description}</p>
      </header>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants Pool</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{participants.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Winners Drawn</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{winners.length} / {raffleData.totalWinners}</div></CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-accent">
            <CardHeader>
              <CardTitle>Draw Winners</CardTitle>
              <CardDescription>Select how many winners to draw and start the raffle.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row items-end gap-4">
              <div className="w-full sm:w-auto flex-grow">
                <Label htmlFor="num-draw">Winners to draw</Label>
                <Input 
                  id="num-draw" 
                  type="number" 
                  value={numToDraw} 
                  onChange={(e) => setNumToDraw(Math.max(1, parseInt(e.target.value, 10)))}
                  min="1"
                  disabled={drawing || isRaffleOver}
                />
              </div>
              <Button 
                onClick={drawWinners} 
                className="w-full sm:w-auto text-lg py-6"
                disabled={drawing || isRaffleOver}
              >
                {drawing ? 'Drawing...' : isRaffleOver ? 'Raffle Completed' : `Draw ${numToDraw} Winner(s)`}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>🎉 Winners 🎉</CardTitle>
            </CardHeader>
            <CardContent>
              {winners.length === 0 && <p className="text-muted-foreground">Winners will appear here once drawn.</p>}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {winners.map((winner, index) => (
                  <div key={winner.id} className="p-4 border rounded-lg bg-background shadow-md flex items-center gap-4 animate-in fade-in zoom-in-95" style={{animationDelay: `${index * 100}ms`}}>
                    <Trophy className="h-8 w-8 text-yellow-500" />
                    <div>
                      <p className="font-bold">{winner.name}</p>
                      <p className="text-sm text-muted-foreground">{winner.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Participants</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-96">
                        <div className="space-y-4">
                            {participants.map(p => (
                                <div key={p.id} className="flex items-center gap-4">
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
