"use client";

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { Button } from "@/components/ui/button";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Trophy, Users, Loader2, Sparkles, Zap } from 'lucide-react';
import type { Participant, Raffle } from '@/lib/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

function RaffleRunComponent() {
  const searchParams = useSearchParams();
  const raffleId = searchParams.get('id');
  const numToDrawParam = searchParams.get('numToDraw');

  const [raffleData, setRaffleData] = useState<Raffle | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Participant[]>([]);
  const [numToDraw, setNumToDraw] = useState(1);
  const [drawing, setDrawing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (numToDrawParam) {
      setNumToDraw(parseInt(numToDrawParam, 10) || 1);
    }
  }, [numToDrawParam]);

  const fetchRaffle = async () => {
    if (!raffleId) {
      setLoading(false);
      return;
    };
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

  const drawWinners = async () => {
    if (drawing || !raffleId || !raffleData || participants.length === 0) return;

    setDrawing(true);
    const remainingWinnerSlots = raffleData.totalWinners - winners.length;
    const toDraw = Math.min(numToDraw, participants.length, remainingWinnerSlots);

    if (toDraw <= 0) {
      setDrawing(false);
      return;
    }

    const shuffled = [...participants].sort(() => 0.5 - Math.random());
    const newWinners = shuffled.slice(0, toDraw);
    const newWinnerIds = new Set(newWinners.map(w => w.id));
    const remainingParticipants = participants.filter(p => !newWinnerIds.has(p.id));

    try {
      const raffleRef = doc(db, 'raffles', raffleId);

      await updateDoc(raffleRef, {
        winners: arrayUnion(...newWinners),
      });

      setTimeout(() => {
        setWinners(prev => [...prev, ...newWinners]);
        setParticipants(remainingParticipants);
        setDrawing(false);

        // Enhanced confetti celebration
        newWinners.forEach((_, i) => {
          setTimeout(() => {
            // Main confetti burst
            confetti({
              particleCount: 150,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#3B82F6', '#8B5CF6', '#F59E0B', '#EF4444', '#10B981']
            });

            // Side confetti bursts
            confetti({
              particleCount: 50,
              angle: 60,
              spread: 55,
              origin: { x: 0 },
              colors: ['#3B82F6', '#8B5CF6']
            });

            confetti({
              particleCount: 50,
              angle: 120,
              spread: 55,
              origin: { x: 1 },
              colors: ['#F59E0B', '#EF4444']
            });
          }, i * 300);
        });

        // Final celebration burst
        setTimeout(() => {
          confetti({
            particleCount: 100,
            spread: 160,
            origin: { y: 0.6 },
            gravity: 0.5,
            colors: ['#FFD700', '#FFA500', '#FF6347']
          });
        }, newWinners.length * 300 + 500);

      }, 2000);

    } catch (error) {
      console.error("Error updating raffle:", error);
      setDrawing(false);
    }
  };

  const isRaffleOver = useMemo(() => {
    if (!raffleData) return false;
    return winners.length >= raffleData.totalWinners || participants.length === 0;
  }, [winners, participants, raffleData]);

  const getButtonText = () => {
    if (drawing) {
      return <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Sorteando...</>;
    }
    if (isRaffleOver) {
      return "Sorteio Concluído";
    }
    const drawCount = Math.min(numToDraw, raffleData?.totalWinners ? raffleData.totalWinners - winners.length : numToDraw);
    return `Sortear ${drawCount} Vencedor(es)`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-slate-700 relative z-10" />
        </div>
        <p className="mt-6 text-slate-600 text-lg">Carregando dados do sorteio...</p>
      </div>
    );
  }

  if (!raffleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <Zap className="h-8 w-8 text-red-600" />
          </div>
          <p className="text-slate-700 text-lg">Sorteio não encontrado ou ID inválido.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 relative overflow-hidden">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30"></div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse animate-float"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-500/3 rounded-full blur-3xl animate-pulse animate-float" style={{ animationDelay: '4s' }}></div>

        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="text-center py-12 px-6">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full bg-slate-100/80 backdrop-blur-sm border border-slate-200 px-4 py-2 mb-6">
                <Sparkles className="h-4 w-4 text-blue-600 mr-2" />
                <span className="text-slate-700 text-sm font-medium">Sorteio ao Vivo</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4 tracking-tight">
                {raffleData.title}
              </h1>
              <p className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                {raffleData.description}
              </p>
            </div>
          </header>

          {/* Stats Cards */}
          <div className="px-6 mb-12">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:bg-white hover:border-slate-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                  <Users className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-blue-900 transition-colors duration-300">{participants.length}</div>
                <div className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-300">Participantes Restantes</div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:bg-white hover:border-slate-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-yellow-500/10">
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors duration-300">
                  <Trophy className="h-6 w-6 text-yellow-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-yellow-900 transition-colors duration-300">{winners.length} / {raffleData.totalWinners}</div>
                <div className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-300">Vencedores Sorteados</div>
              </div>

              <div className="group bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 text-center hover:bg-white hover:border-slate-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors duration-300">
                  <Zap className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2 group-hover:text-purple-900 transition-colors duration-300">{numToDraw}</div>
                <div className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-300">Por Rodada</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 px-6 pb-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left Column - Draw Button & Winners */}
              <div className="lg:col-span-2 space-y-8">
                {/* Draw Button */}
                <div className="text-center relative">
                  {/* Glow effect behind button */}
                  {!drawing && !isRaffleOver && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-64 h-20 bg-gradient-to-r from-blue-200/50 to-purple-200/50 rounded-full blur-2xl animate-pulse"></div>
                    </div>
                  )}

                  <Button
                    onClick={drawWinners}
                    className={`
                    relative overflow-hidden px-12 py-6 text-xl font-bold rounded-full
                    transition-all duration-500 transform hover:scale-110 active:scale-95
                    ${drawing || isRaffleOver
                        ? 'bg-gray-300 cursor-not-allowed border border-gray-400 text-gray-600'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 border border-blue-400/30 text-white'
                      }
                  `}
                    disabled={drawing || isRaffleOver}
                    size="lg"
                  >
                    {drawing && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 animate-pulse"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
                      </>
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      {getButtonText()}
                    </span>

                    {/* Sparkle effects */}
                    {!drawing && !isRaffleOver && (
                      <>
                        <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
                        <div className="absolute bottom-3 left-6 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                        <div className="absolute top-4 left-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
                      </>
                    )}
                  </Button>
                </div>

                {/* Winners Section */}
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-8 hover:bg-white hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center relative">
                      <Trophy className="h-5 w-5 text-yellow-600" />
                      {winners.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Vencedores</h2>
                    {winners.length > 0 && (
                      <div className="ml-auto bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium">
                        {winners.length} sorteado{winners.length !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>

                  {winners.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                        <Trophy className="h-8 w-8 text-slate-400" />
                      </div>
                      <p className="text-slate-500">Os vencedores aparecerão aqui assim que forem sorteados.</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {winners.map((winner, index) => (
                          <div
                            key={winner.id}
                            className="group bg-white/90 border border-slate-200 rounded-xl p-4 flex items-center gap-4 animate-in fade-in zoom-in-95 hover:bg-white hover:border-yellow-300 hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10"
                            style={{ animationDelay: `${index * 100}ms` }}
                          >
                            <div className="relative">
                              <Avatar className="h-12 w-12 border-2 border-yellow-300 group-hover:border-yellow-400 transition-colors duration-300">
                                <AvatarFallback className="bg-yellow-100 text-yellow-700 font-bold group-hover:bg-yellow-200 transition-colors duration-300">
                                  {winner.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <Sparkles className="h-2 w-2 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 text-lg group-hover:text-yellow-800 transition-colors duration-300">{winner.name}</p>
                              <p className="text-slate-600 text-sm group-hover:text-slate-700 transition-colors duration-300">{winner.email}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center group-hover:bg-yellow-200 group-hover:scale-110 transition-all duration-300">
                              <Trophy className="h-4 w-4 text-yellow-600" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>

              {/* Right Column - Participants */}
              <div className="lg:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-6 h-full hover:bg-white hover:border-slate-300 transition-all duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center relative">
                      <Users className="h-5 w-5 text-blue-600" />
                      {participants.length > 0 && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Participantes</h2>
                    {participants.length > 0 && (
                      <div className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {participants.length}
                      </div>
                    )}
                  </div>

                  <ScrollArea className="h-[600px]">
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="group bg-white/90 border border-slate-200 rounded-lg p-3 flex items-center gap-3 hover:bg-white hover:border-blue-300 hover:scale-105 transition-all duration-300 hover:shadow-md hover:shadow-blue-500/10"
                        >
                          <Avatar className="h-10 w-10 group-hover:scale-110 transition-transform duration-300">
                            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-sm group-hover:bg-blue-200 transition-colors duration-300">
                              {participant.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-slate-900 text-sm truncate group-hover:text-blue-800 transition-colors duration-300">{participant.name}</p>
                            <p className="text-slate-600 text-xs truncate group-hover:text-slate-700 transition-colors duration-300">{participant.email}</p>
                          </div>
                          <div className="w-2 h-2 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                      ))}
                      {participants.length === 0 && !loading && (
                        <div className="text-center py-16">
                          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                            <Users className="h-8 w-8 text-slate-400" />
                          </div>
                          <p className="text-slate-500">Nenhum participante restante.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


export default function RaffleRunPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex flex-col items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
          <Loader2 className="h-12 w-12 animate-spin text-slate-700 relative z-10" />
        </div>
        <p className="mt-6 text-slate-600 text-lg">Carregando...</p>
      </div>
    }>
      <RaffleRunComponent />
    </Suspense>
  )
}