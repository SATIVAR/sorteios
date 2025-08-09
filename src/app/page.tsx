"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Gift, Zap, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Image from 'next/image';

export default function LandingPage() {
  const features = [
    {
      icon: <Zap className="h-8 w-8 text-pastel-primary-foreground" />,
      title: 'Criação Rápida de Sorteios',
      description: 'Crie e configure seus sorteios em minutos com nossa interface intuitiva.',
    },
    {
      icon: <Users className="h-8 w-8 text-pastel-primary-foreground" />,
      title: 'Gerenciamento de Clientes',
      description: 'Organize as empresas clientes e atrele sorteios a elas com facilidade.',
    },
    {
      icon: <Gift className="h-8 w-8 text-pastel-primary-foreground" />,
      title: 'Sorteio Justo e Transparente',
      description: 'Nossa ferramenta de sorteio garante um processo aleatório e imparcial.',
    },
     {
      icon: <CheckCircle className="h-8 w-8 text-pastel-primary-foreground" />,
      title: 'Resultados Detalhados',
      description: 'Visualize e exporte os resultados de cada sorteio com clareza.',
    },
  ];
  
  const testimonials = [
    {
      name: 'Joana Silva',
      role: 'Gerente de Marketing',
      quote: '“O Sativar transformou a forma como fazemos nossos sorteios. É rápido, confiável e nossos clientes adoram a transparência!”',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
    },
    {
      name: 'Marcos Andrade',
      role: 'Dono de Loja',
      quote: '“Finalmente uma plataforma que entende as nossas necessidades. O gerenciamento de clientes atrelado aos sorteios é fantástico.”',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
    },
    {
      name: 'Carla Martins',
      role: 'Influenciadora Digital',
      quote: '“Uso o Sativar para todos os meus giveaways. A facilidade de uso e os resultados claros me poupam horas de trabalho.”',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-pastel-background text-pastel-text font-body">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full bg-pastel-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
          <Logo logoColor="text-primary" textColor="text-primary" />
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Funcionalidades</Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">Depoimentos</Link>
            <Link href="#cta" className="text-sm font-medium hover:text-primary transition-colors">Comece Agora</Link>
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
                <Link href="/login">Entrar</Link>
            </Button>
            <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/login">Cadastre-se</Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-6 p-6">
                   <Logo logoColor="text-primary" textColor="text-primary" />
                    <nav className="flex flex-col gap-4">
                        <Link href="#features" className="text-lg font-medium">Funcionalidades</Link>
                        <Link href="#testimonials" className="text-lg font-medium">Depoimentos</Link>
                        <Link href="#cta" className="text-lg font-medium">Comece Agora</Link>
                    </nav>
                    <div className="flex flex-col gap-2 mt-4">
                        <Button variant="outline" asChild><Link href="/login">Entrar</Link></Button>
                        <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90" asChild><Link href="/login">Cadastre-se</Link></Button>
                    </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="container mx-auto flex flex-col items-center justify-center px-4 py-20 text-center md:px-6 md:py-32">
          <Badge className="mb-4 bg-pastel-accent text-pastel-accent-foreground">Plataforma de Sorteios Inteligente</Badge>
          <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tighter text-primary">
            Crie e Gerencie Sorteios com Extrema Facilidade
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-pastel-text-muted">
            Do planejamento à execução, o Sativar oferece todas as ferramentas que você precisa para engajar seu público e realizar sorteios de forma transparente e profissional.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button size="lg" className="rounded-full text-lg h-12 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" asChild>
              <Link href="/login">Começar Gratuitamente</Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg h-12 border-primary text-primary bg-transparent hover:bg-pastel-accent hover:text-primary" asChild>
              <Link href="#features">Ver Funcionalidades</Link>
            </Button>
          </div>
           <div className="mt-16 w-full max-w-5xl">
            <Image 
              src="https://placehold.co/1200x600.png"
              alt="Dashboard Sativar"
              width={1200}
              height={600}
              className="rounded-2xl shadow-2xl"
              data-ai-hint="dashboard analytics"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-pastel-secondary py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold font-headline text-primary md:text-4xl">Tudo que você precisa em um só lugar</h2>
              <p className="mt-4 text-lg text-pastel-text-muted">
                Funcionalidades pensadas para simplificar seu trabalho e maximizar seus resultados.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="bg-pastel-background/80 border-pastel-accent shadow-md hover:shadow-lg transition-shadow">
                  <CardHeader className="items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pastel-accent">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl font-headline text-center text-primary">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-pastel-text-muted">
                    {feature.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="py-20 md:py-28">
          <div className="container mx-auto px-4 md:px-6">
             <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold font-headline text-primary md:text-4xl">Aprovado por quem usa</h2>
              <p className="mt-4 text-lg text-pastel-text-muted">
                Veja o que nossos clientes estão dizendo sobre a plataforma Sativar.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="flex flex-col justify-between bg-pastel-background border-pastel-accent shadow-md">
                   <CardContent className="pt-6">
                    <p className="text-pastel-text-muted italic">{testimonial.quote}</p>
                  </CardContent>
                  <CardHeader className="flex-row gap-4 items-center">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-primary">{testimonial.name}</p>
                      <p className="text-sm text-pastel-text-muted">{testimonial.role}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="cta" className="bg-pastel-secondary">
          <div className="container mx-auto px-4 py-20 text-center md:px-6 md:py-28">
            <h2 className="text-4xl font-bold font-headline text-primary">
              Pronto para impulsionar seus sorteios?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-pastel-text-muted">
              Junte-se a centenas de empresas que já confiam no Sativar. Crie sua conta gratuita e comece agora mesmo.
            </p>
            <Button size="lg" className="mt-8 rounded-full text-lg h-14 px-10 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" asChild>
              <Link href="/login">Quero Começar</Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-pastel-accent bg-pastel-background">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-8 text-center sm:flex-row sm:text-left md:px-6">
          <div className="flex items-center gap-2">
            <Logo logoColor="text-primary" textColor="text-primary" />
          </div>
          <p className="text-sm text-pastel-text-muted">© {new Date().getFullYear()} Sativar. Todos os direitos reservados.</p>
          <div className="flex gap-4">
             <Link href="#" className="text-sm hover:text-primary transition-colors">Termos de Serviço</Link>
             <Link href="#" className="text-sm hover:text-primary transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
