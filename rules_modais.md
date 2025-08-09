Guia de Estilo e Implementação para Modais
Este documento define o padrão técnico e de design para todos os modais da aplicação. O objetivo é garantir que cada modal seja funcional, visualmente elegante e consistente, proporcionando uma experiência de usuário (UX) previsível e profissional.
Princípios Fundamentais
Estrutura Fixa e Conteúdo Rolável: O cabeçalho (Header) e o rodapé (Footer) do modal devem permanecer sempre fixos e visíveis. Apenas a área de conteúdo principal deve ser rolável quando o conteúdo exceder o espaço disponível.
Design Premium e Limpo: Os modais devem ter espaçamento generoso ("respiro"), hierarquia visual clara e uma aparência moderna.
Totalmente Responsivo: O layout deve se adaptar perfeitamente a todos os tamanhos de tela, desde dispositivos móveis pequenos até monitores grandes de desktop.
1. Estrutura Técnica (Obrigatória)
Todo modal deve ser construído com uma estrutura de 3 partes aninhadas dentro de um contêiner principal. Esta estrutura é essencial para o correto funcionamento do layout.
Estrutura JSX/HTML de Referência
code
Jsx
<ModalContainer>
  <ModalHeader>
    {/* Título e botão de fechar aqui */}
  </ModalHeader>

  <ModalContent>
    {/* Todos os campos de formulário e conteúdo principal aqui */}
  </ModalContent>

  <ModalFooter>
    {/* Botões de ação (Salvar, Cancelar, etc.) aqui */}
  </ModalFooter>
</ModalContainer>
Implementação CSS com Flexbox
ModalContainer (O Contêiner Principal)
Função: Define a forma, o tamanho e a estrutura geral do modal.
CSS Obrigatório:
display: flex;
flex-direction: column;
max-height: 85vh; (Impede que o modal seja maior que a tela)
overflow: hidden; (Garante que nada "vaze" do contêiner)
max-width: 720px; (Largura máxima para desktops)
width: 95%; (Largura flexível para responsividade)
border-radius: 16px; (Cantos arredondados para um visual moderno)
background-color: #fff; (Cor de fundo)
ModalHeader (O Cabeçalho Fixo)
Função: Exibe o título do modal e a ação de fechar. Permanece sempre visível.
CSS Obrigatório:
flex-shrink: 0; (Crítico: Impede que o header encolha)
padding: 24px;
border-bottom: 1px solid #e5e7eb; (Separador visual sutil)
ModalContent (A Área de Conteúdo Rolável)
Função: Contém o formulário ou qualquer outro conteúdo principal. Esta é a única parte que deve rolar.
CSS Obrigatório:
flex-grow: 1; (Crítico: Faz com que esta área ocupe todo o espaço vertical livre)
overflow-y: auto; (Crítico: Adiciona a barra de rolagem vertical somente quando necessário)
padding: 24px; (Espaçamento interno para o conteúdo)
ModalFooter (O Rodapé Fixo)
Função: Contém as ações primárias e secundárias. Permanece sempre visível.
CSS Obrigatório:
flex-shrink: 0; (Crítico: Impede que o footer encolha)
padding: 24px;
border-top: 1px solid #e5e7eb; (Separador visual sutil)
display: flex;
justify-content: flex-end; (Alinha os botões à direita, um padrão comum)
2. Guia de UX e Design Visual
Overlay: O modal deve sempre ser exibido sobre uma camada de fundo (overlay) semitransparente e escura (ex: rgba(0, 0, 0, 0.5)). Isso aumenta o foco no modal.
Animações: A entrada e saída do modal devem ser suaves. Use transições sutis de opacity (opacidade) e transform: scale() para uma experiência menos abrupta.
Hierarquia de Botões:
Primário (ex: "Salvar"): Botão com cor de fundo sólida, representando a ação principal.
Secundário (ex: "Cancelar"): Botão com estilo mais sutil (apenas texto ou com borda), para ações de menor importância.
Acessibilidade: Garanta que o foco do teclado seja aprisionado dentro do modal (focus trapping) e que a tecla Esc feche o modal.
Resumo Técnico (Tabela Rápida)
Elemento	Propriedades CSS Chave	Propósito
Container	display: flex; flex-direction: column; max-height: 85vh;	Cria a base do layout e limita a altura.
Header	flex-shrink: 0;	Mantém o cabeçalho fixo no topo.
Content	flex-grow: 1; overflow-y: auto;	Faz o conteúdo se expandir e ser rolável.
Footer	flex-shrink: 0;	Mantém o rodapé fixo na base.