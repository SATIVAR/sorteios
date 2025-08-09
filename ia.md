Plano de Ação: Refatoração do Modal de Empresa com Upload de Imagem e Layout Responsivo
Este guia detalha a implementação de um campo de upload de imagem e a reestruturação do layout do corpo do modal (ModalBody) para garantir que ele seja elegante, funcional e se adapte a todas as telas.
1. Princípio Fundamental: O Layout de Duas Colunas
Para aproveitar melhor o espaço em desktops, o ModalBody será dividido em uma grade (grid) de duas colunas.
Coluna Esquerda (Visual): Dedicada exclusivamente ao componente de upload e pré-visualização da imagem (logo da empresa).
Coluna Direita (Dados): Conterá todos os campos de texto e seleção do formulário (Nome da Empresa, CNPJ, etc.).
Este layout será responsivo: em telas menores (mobile), as colunas se empilharão verticalmente, criando uma única coluna fluida.
Implementação Técnica (CSS Grid)
O ModalBody (a área de conteúdo rolável) terá sua propriedade de exibição definida como display: grid;.
Em Desktop (@media (min-width: 768px)):
grid-template-columns: 1fr 2fr; (A coluna da imagem ocupará 1 parte do espaço e a coluna do formulário ocupará 2 partes, dando mais espaço aos campos).
gap: 32px; (Espaçamento consistente entre as colunas e as linhas).
Em Mobile (Padrão):
Nenhuma regra de coluna é necessária. O comportamento padrão do grid com uma única coluna será herdado, empilhando os itens verticalmente.
2. Componente de Upload de Imagem (Coluna Esquerda)
Esta área deve ser intuitiva e clara.
Estado Inicial: Exiba um contêiner com borda tracejada, um ícone central de upload (nuvem ou imagem) e um texto instrutivo claro: "Arraste e solte ou clique para enviar" com um subtítulo especificando as restrições: "PNG ou JPG (Recomendado: 500x500px)".
Estado de Pré-visualização: Após o usuário selecionar uma imagem, o contêiner inicial deve ser substituído por:
Uma pré-visualização da imagem selecionada (<img>) com object-fit: cover e aspect-ratio: 1 / 1 para garantir que ela sempre apareça quadrada.
Botões de ação discretos abaixo da imagem: "Alterar Imagem" e "Remover". Isso oferece controle total ao usuário sem a necessidade de recarregar a página.
3. Campos de Formulário Otimizados (Coluna Direita)
Os campos de texto e seleção serão organizados dentro da coluna direita. Para aproveitar o espaço ainda mais eficientemente:
Agrupamento de Campos: Campos menores e relacionados devem ser colocados lado a lado, dentro da coluna direita. Por exemplo:
O campo "CNPJ" e "Status" podem formar uma linha.
O campo "WhatsApp" e "Instagram" podem formar outra linha.
Implementação (Grid Aninhado): A coluna direita pode ela mesma se tornar um contêiner grid (display: grid) com grid-template-columns: 1fr 1fr; para alinhar esses campos lado a lado em desktop. Em telas móveis, eles também se empilharão naturalmente.
4. Lógica de Armazenamento (Sem Banco de Dados Direto)
Conforme solicitado, a imagem não será salva diretamente no banco de dados. O fluxo será o seguinte:
Frontend (No Estado do Componente): Quando o usuário seleciona uma imagem, o arquivo (File object) é armazenado no estado do React.
Envio: Ao clicar em "Salvar Empresa", o formulário é enviado para uma API Route customizada no seu backend Next.js. A imagem é enviada como FormData.
Backend (API Route):
A API Route recebe o arquivo.
Gera um nome de arquivo único para evitar conflitos (ex: usando um timestamp ou UUID).
Salva o arquivo na pasta /public/uploads/logos do seu projeto. Arquivos na pasta /public são servidos estaticamente pelo Next.js.
Resposta e Salvamento Final:
A API responde à requisição com o caminho público do arquivo recém-salvo (ex: /uploads/logos/nome-unico-da-imagem.png).
O frontend recebe este caminho e, só então, salva todas as informações da empresa no Firestore, armazenando apenas o caminho da imagem (a URL) em um campo logoUrl.