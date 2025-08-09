Plano de Ação: Implementação de Corte de Imagem (Cropper) 1:1
Este documento descreve o fluxo de trabalho e a estratégia técnica para integrar uma biblioteca de corte de imagem no modal, permitindo que o usuário ajuste e enquadre a imagem em uma proporção de 1:1 antes do envio.
1. Princípio Fundamental
A funcionalidade de corte deve acontecer inteiramente no lado do cliente (client-side). O usuário seleciona a imagem original, ajusta o corte em uma interface interativa, e somente a imagem final, já cortada, é preparada para o envio ao servidor. Isso economiza largura de banda e melhora drasticamente a velocidade da interação.
2. Biblioteca Recomendada
Para um ambiente Next.js/React, a biblioteca react-easy-crop é a escolha ideal.
Moderna e Leve: Não adiciona peso desnecessário à aplicação.
Intuitiva: Oferece uma experiência de arrastar e zoom suave, perfeita para dispositivos móveis e desktop.
Altamente Configurável: Permite travar a proporção (aspect ratio) e extrair facilmente os dados da imagem cortada.
3. O Fluxo de Interação do Usuário (Passo a Passo)
A experiência do usuário será dividida em três estágios claros dentro do próprio modal.
Estágio 1: Seleção da Imagem
O usuário vê o componente de upload padrão ("Arraste e solte ou clique para enviar").
Ao selecionar um arquivo de imagem, em vez de mostrar uma pré-visualização estática, a aplicação transiciona para o Estágio 2.
Estágio 2: A Interface de Corte (O Cropper)
O componente de upload se transforma na interface do react-easy-crop.
Visual: O usuário vê sua imagem carregada com uma sobreposição (overlay) e uma "janela" de corte quadrada no centro.
Interação:
Enquadramento (Pan): O usuário pode clicar e arrastar a imagem para movê-la dentro da área de corte.
Zoom: Uma barra deslizante (slider) de zoom é exibida, permitindo ao usuário ampliar ou reduzir a imagem para o enquadramento perfeito.
Proporção Fixa: A área de corte estará travada em 1:1 (quadrado), garantindo o resultado desejado.
Ações de Confirmação: Abaixo da interface de corte, devem existir dois botões claros:
"Confirmar Corte": Finaliza a edição.
"Cancelar": Descarta a imagem selecionada e retorna ao Estágio 1.
Estágio 3: Pré-visualização Final
Após o usuário clicar em "Confirmar Corte", a interface do cropper desaparece.
No lugar dela, surge uma pré-visualização da imagem já cortada, perfeitamente quadrada.
Ao lado ou abaixo da pré-visualização, um botão "Alterar Imagem" permite ao usuário reiniciar o fluxo a partir do Estágio 1, caso deseje escolher outra imagem ou refazer o corte.
4. Integração Técnica com o Formulário Principal
Gerenciamento de Estado: O estado do formulário precisa gerenciar as diferentes etapas (seleção, corte, pré-visualização).
Geração da Imagem Cortada (Client-Side):
Quando o usuário clica em "Confirmar Corte", uma função auxiliar é chamada.
Esta função usa as coordenadas de corte e o nível de zoom fornecidos pela biblioteca para "desenhar" a seção visível da imagem em um elemento <canvas> HTML invisível.
Em seguida, ela exporta o conteúdo do <canvas> como um arquivo de imagem (Blob ou File object). Este Blob é a imagem final, cortada e otimizada.
Armazenamento no Estado: Este Blob da imagem cortada é o que será armazenado no estado principal do formulário, e não o arquivo original.
Envio para o Servidor: Quando o usuário finalmente clica no botão principal "Salvar Empresa", é este Blob cortado que será adicionado ao FormData e enviado para a sua API Route.
Resumo Técnico (Tabela Rápida)
Etapa do Fluxo	O que o Usuário Vê	Ação Técnica em Background
1. Seleção	Área de "Arraste e solte".	Um input do tipo file é acionado.
2. Corte	Imagem com overlay, janela de corte 1:1 e slider de zoom.	O componente react-easy-crop é renderizado. O estado local armazena os valores de corte/zoom em tempo real.
3. Confirmação	Clica no botão "Confirmar Corte".	Função auxiliar usa <canvas> para gerar um Blob da imagem cortada a partir das coordenadas.
4. Pré-visualização	Imagem final, quadrada, com botão "Alterar".	O Blob é salvo no estado principal do formulário.
5. Salvar Final	Clica em "Salvar Empresa".	O Blob cortado (e não o arquivo original) é enviado para a API Route.