# Exemplo de Implementação do Padrão de Modal

Este documento mostra como implementar corretamente o padrão de modal definido no guia de estilo.

## Estrutura Básica

```tsx
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogBody, 
  DialogFooter, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";

function ExampleModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Abrir Modal</Button>
      </DialogTrigger>
      
      <DialogContent>
        {/* HEADER FIXO */}
        <DialogHeader>
          <DialogTitle>Título do Modal</DialogTitle>
          <DialogDescription>
            Descrição opcional do modal
          </DialogDescription>
        </DialogHeader>

        {/* CONTEÚDO ROLÁVEL */}
        <DialogBody>
          <div className="space-y-4">
            {/* Todo o conteúdo do formulário aqui */}
            <Input placeholder="Campo 1" />
            <Input placeholder="Campo 2" />
            {/* ... mais campos ... */}
          </div>
        </DialogBody>

        {/* FOOTER FIXO */}
        <DialogFooter>
          <Button variant="outline">Cancelar</Button>
          <Button type="submit">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

## Características Implementadas

✅ **Container Principal (DialogContent)**
- `max-height: 85vh` - Limita altura máxima
- `width: 95%` - Largura responsiva
- `max-width: 720px` - Largura máxima para desktop
- `border-radius: 16px` - Cantos arredondados
- `display: flex; flex-direction: column` - Layout flexbox
- `overflow: hidden` - Previne vazamento de conteúdo

✅ **Header Fixo (DialogHeader)**
- `flex-shrink: 0` - Impede encolhimento
- `padding: 24px` - Espaçamento interno
- `border-bottom: 1px solid` - Separador visual

✅ **Conteúdo Rolável (DialogBody)**
- `flex-grow: 1` - Ocupa espaço disponível
- `overflow-y: auto` - Rolagem vertical quando necessário
- `padding: 24px` - Espaçamento interno

✅ **Footer Fixo (DialogFooter)**
- `flex-shrink: 0` - Impede encolhimento
- `padding: 24px` - Espaçamento interno
- `border-top: 1px solid` - Separador visual
- `justify-content: flex-end` - Alinha botões à direita

## Componentes Atualizados

Os seguintes componentes já foram atualizados para seguir este padrão:

- ✅ `AddRaffleForm`
- ✅ `EditRaffleForm`
- ✅ `AddCompanyForm`
- ✅ `EditCompanyForm`

## Overlay e Animações

O overlay semitransparente e as animações suaves já estão implementados no componente base `DialogContent`.