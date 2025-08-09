"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Raffle } from "@/lib/types";
import { Loader2, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function PublicRafflePage() {
  const params = useParams();
  const id = params.id as string;
  const [raffle, setRaffle] = useState<Raffle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRaffle = async () => {
      setLoading(true);
      try {
        const raffleRef = doc(db, "raffles", id);
        const docSnap = await getDoc(raffleRef);
        if (docSnap.exists()) {
          setRaffle({ id: docSnap.id, ...docSnap.data() } as Raffle);
        } else {
          setError("Sorteio não encontrado.");
        }
      } catch (err) {
        console.error(err);
        setError("Ocorreu um erro ao carregar o sorteio.");
      } finally {
        setLoading(false);
      }
    };

    fetchRaffle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Carregando sorteio...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted/40 text-center p-4">
        <p className="text-lg text-destructive mb-4">{error}</p>
        <Button asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2" />
            Voltar ao Painel
          </Link>
        </Button>
      </div>
    );
  }

  if (!raffle) {
    return null; // Should be handled by error state
  }

  const hasImage = !!raffle.imageUrl;
  const aspectRatio = raffle.imageAspectRatio || '16:9'; // Default to 16:9 if not set

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Layout for 16:9 aspect ratio */}
      {hasImage && aspectRatio === '16:9' && (
        <div className="w-full">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={raffle.imageUrl!}
              alt={raffle.title}
              fill
              className="object-cover"
              priority
            />
             <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
           <main className="container mx-auto px-4 md:px-6 py-12 -mt-24 relative z-10">
             <div className="max-w-4xl mx-auto bg-card p-8 rounded-2xl shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold font-headline mb-4">{raffle.title}</h1>
                <p className="text-muted-foreground text-lg mb-8">{raffle.description}</p>
                <Button size="lg" className="w-full text-lg h-14">Quero Participar!</Button>
             </div>
          </main>
        </div>
      )}

      {/* Layout for 1:1 aspect ratio or no image */}
       {(!hasImage || aspectRatio === '1:1') && (
         <div className="container mx-auto px-4 md:px-6 py-12 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
                 {hasImage && aspectRatio === '1:1' && (
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-2xl">
                         <Image
                            src={raffle.imageUrl!}
                            alt={raffle.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}
                 <div className={cn("flex flex-col justify-center", !hasImage && "md:col-span-2 text-center")}>
                    <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">{raffle.title}</h1>
                    <p className="text-muted-foreground text-xl mb-10">{raffle.description}</p>
                    <Button size="lg" className={cn("w-full text-lg h-14", !hasImage && "max-w-sm mx-auto")}>Quero Participar!</Button>
                </div>
            </div>
         </div>
       )}
    </div>
  );
}
