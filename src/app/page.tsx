"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/logo';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Users, Gift, Zap, Menu, ArrowRight, Star, Shield, Sparkles, Play } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/theme-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/context/AuthContext';

export default function LandingPage() {
  const { user, loading } = useAuth(); // Use the context

  const getInitials = (name: string) => {
    if(!name) return "";
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Criação Rápida',
      description: 'Configure sorteios em minutos com nossa interface intuitiva e moderna.',
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Gestão Completa',
      description: 'Organize clientes e sorteios em um painel centralizado e eficiente.',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Transparência Total',
      description: 'Algoritmo certificado garante sorteios justos e auditáveis.',
    },
    {
      icon: <Sparkles className="h-6 w-6" />,
      title: 'Resultados Premium',
      description: 'Relatórios detalhados e exportação em múltiplos formatos.',
    },
  ];
  
  const testimonials = [
    {
      name: 'Joana Silva',
      role: 'Gerente de Marketing',
      company: 'TechCorp',
      quote: 'O Sativar revolucionou nossos sorteios. Interface moderna, resultados confiáveis e nossos clientes adoram a transparência.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704a',
      rating: 5,
    },
    {
      name: 'Marcos Andrade',
      role: 'CEO',
      company: 'StartupXYZ',
      quote: 'Plataforma excepcional! O gerenciamento integrado de clientes e sorteios economiza horas do nosso time.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704b',
      rating: 5,
    },
    {
      name: 'Carla Martins',
      role: 'Influenciadora Digital',
      company: '@carlamartins',
      quote: 'Uso o Sativar em todos os meus giveaways. Design impecável e funcionalidades que realmente fazem a diferença.',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704c',
      rating: 5,
    },
  ];

  const stats = [
    { value: '10K+', label: 'Sorteios Realizados' },
    { value: '500+', label: 'Empresas Ativas' },
    { value: '99.9%', label: 'Uptime' },
    { value: '24/7', label: 'Suporte' },
  ];

  const renderHeaderActions = () => {
    // While context is loading, show a placeholder
    if (loading) {
      return <Skeleton className="h-9 w-24 rounded-md" />;
    }
    
    // If user is logged in, show avatar and link to dashboard
    if (user) {
      return (
        <Link href="/dashboard" title="Acessar Painel">
          <Avatar>
            <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Link>
      );
    }
    
    // If user is not logged in, show login/register buttons
    return (
      <>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/login">Entrar</Link>
        </Button>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
          <Link href="/register">Começar Grátis</Link>
        </Button>
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Logo logoColor="text-primary" textColor="text-primary" />
          
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="#features" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Funcionalidades
            </Link>
            <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Depoimentos
            </Link>
            <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
              Preços
            </Link>
          </nav>
          
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />
            {renderHeaderActions()}
          </div>
          
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-6 p-6">
                  <Logo logoColor="text-primary" textColor="text-primary" />
                  <nav className="flex flex-col gap-4">
                    <Link href="#features" className="text-lg font-medium hover:text-primary transition-colors">
                      Funcionalidades
                    </Link>
                    <Link href="#testimonials" className="text-lg font-medium hover:text-primary transition-colors">
                      Depoimentos
                    </Link>
                    <Link href="#pricing" className="text-lg font-medium hover:text-primary transition-colors">
                      Preços
                    </Link>
                  </nav>
                  <div className="flex flex-col gap-3 mt-4">
                    {user ? (
                        <Button asChild>
                           <Link href="/dashboard">Acessar Painel</Link>
                        </Button>
                    ) : (
                      <>
                        <Button variant="outline" asChild>
                          <Link href="/login">Entrar</Link>
                        </Button>
                        <Button className="bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                          <Link href="/register">Começar Grátis</Link>
                        </Button>
                      </>
                    )}
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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
          <div className="container mx-auto px-4 py-24 md:px-6 md:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <Sparkles className="mr-2 h-4 w-4" />
                Plataforma Premium de Sorteios
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                Sorteios que
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Impressionam</span>
              </h1>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
                Crie, gerencie e execute sorteios profissionais com a plataforma mais avançada do mercado. 
                Design premium, tecnologia de ponta e resultados garantidos.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-12 px-8 text-base bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg" asChild>
                  <Link href="/register">
                    Começar Gratuitamente
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-base" asChild>
                  <Link href="#demo">
                    <Play className="mr-2 h-4 w-4" />
                    Ver Demo
                  </Link>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl font-bold text-primary md:text-3xl">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">Funcionalidades</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Tudo que você precisa para sorteios profissionais
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Ferramentas avançadas projetadas para maximizar o engajamento e garantir transparência total.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, index) => (
                <Card key={feature.title} className="relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/5" />
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-muted/30 py-24 md:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-3xl text-center">
              <Badge variant="outline" className="mb-4">Depoimentos</Badge>
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
                Aprovado por milhares de profissionais
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Veja o que nossos clientes estão dizendo sobre a experiência premium do Sativar.
              </p>
            </div>
            
            <div className="mt-16 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
                <Card key={testimonial.name} className="relative overflow-hidden bg-background shadow-lg">
                  <CardContent className="pt-6">
                    <div className="mb-4 flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-muted-foreground italic">
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                  <CardHeader className="flex-row gap-4 items-center pt-0">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                      <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      <p className="text-xs text-primary font-medium">{testimonial.company}</p>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section id="pricing" className="relative overflow-hidden py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10" />
          <div className="container mx-auto px-4 text-center md:px-6">
            <div className="mx-auto max-w-3xl">
              <Badge variant="secondary" className="mb-6 px-4 py-2">
                <Gift className="mr-2 h-4 w-4" />
                Oferta Especial
              </Badge>
              
              <h2 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Comece sua jornada premium
              </h2>
              
              <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                Junte-se a milhares de empresas que já transformaram seus sorteios com o Sativar. 
                Teste gratuitamente por 30 dias, sem compromisso.
              </p>
              
              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
                <Button size="lg" className="h-14 px-10 text-lg bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl" asChild>
                  <Link href="/register">
                    Começar Teste Gratuito
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-10 text-lg" asChild>
                  <Link href="/login">Já tenho conta</Link>
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  30 dias grátis
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Sem cartão de crédito
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Cancele quando quiser
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-4">
              <Logo logoColor="text-primary" textColor="text-primary" />
              <p className="text-sm text-muted-foreground max-w-xs">
                A plataforma premium para sorteios profissionais. Transparente, confiável e moderna.
              </p>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Produto</h4>
              <div className="space-y-2 text-sm">
                <Link href="#features" className="block text-muted-foreground hover:text-primary transition-colors">
                  Funcionalidades
                </Link>
                <Link href="#pricing" className="block text-muted-foreground hover:text-primary transition-colors">
                  Preços
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Integrações
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Empresa</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Sobre nós
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Carreiras
                </Link>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Suporte</h4>
              <div className="space-y-2 text-sm">
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Central de Ajuda
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Contato
                </Link>
                <Link href="#" className="block text-muted-foreground hover:text-primary transition-colors">
                  Status
                </Link>
              </div>
            </div>
          </div>
          
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Sativar. Todos os direitos reservados.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Termos de Serviço
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Política de Privacidade
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
