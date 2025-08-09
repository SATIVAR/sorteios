Plano de Ação: Upload de Imagem com Seleção de Proporção Dinâmica
Este documento detalha a implementação de um campo de upload de imagem no formulário de "Adicionar Novo Sorteio", com a funcionalidade crítica de permitir ao usuário escolher a proporção de corte desejada (1:1 ou 16:9) antes de editar a imagem.
1. Princípio Fundamental: Configuração Pré-Corte
A mudança mais significativa em relação ao fluxo anterior é a introdução de uma etapa de configuração antes do corte. O usuário deve primeiro declarar sua intenção (imagem quadrada ou retangular) para que a ferramenta de corte (cropper) possa ser inicializada com a proporção correta.
2. Biblioteca Recomendada
A biblioteca react-easy-crop continua sendo a escolha perfeita, pois sua propriedade aspect pode ser alterada dinamicamente com base no estado do componente, tornando-a ideal para este cenário.
3. O Fluxo de Interação do Usuário (Fluxo Adaptado)
A experiência do usuário será dividida em estágios claros e sequenciais para evitar qualquer confusão.
Estágio 1: Seleção de Imagem e Configuração da Proporção
Este estágio combina a seleção do arquivo com a nova etapa de configuração.
Interface do Componente: A área de upload no formulário conterá dois elementos principais:
Seleção de Proporção (Elemento Novo):
Visual: Utilize um "Controle Segmentado" (Segmented Control) ou um grupo de botões estilizados, pois é visualmente mais claro que um dropdown para poucas opções. Os botões devem ter rótulos inequívocos: "Quadrado (1:1)" e "Retangular (16:9)".
Interação: O usuário deve clicar para selecionar uma das proporções. O botão selecionado deve ter um estado "ativo" claro (ex: cor de fundo preenchida). A escolha do usuário (1 para 1:1 ou 16/9 para 16:9) é imediatamente salva no estado do componente React.
Área de Upload: O conhecido contêiner de "Arraste e solte ou clique para enviar".
Ação: O usuário primeiro escolhe a proporção e depois seleciona o arquivo de imagem.
Estágio 2: A Interface de Corte Dinâmica
Após a seleção do arquivo, a interface do react-easy-crop é renderizada.
A Lógica Dinâmica: A ferramenta de corte (cropper) será inicializada com a propriedade aspect definida para o valor que o usuário escolheu no Estágio 1 e que já está salvo no estado do componente.
Visual: A "janela de corte" aparecerá para o usuário já no formato correto — perfeitamente quadrada ou em paisagem (widescreen), dependendo da sua seleção prévia.
Interação: O restante da interação é o mesmo: o usuário pode arrastar (pan) e dar zoom para encontrar o enquadramento ideal dentro da proporção definida. Os botões "Confirmar Corte" e "Cancelar" permanecem.
Estágio 3: Pré-visualização Final
Ao confirmar o corte, a interface do cropper desaparece e a pré-visualização da imagem já cortada é exibida no formato correto (1:1 ou 16:9).
O botão "Alterar Imagem" deve redefinir o componente ao seu estado inicial (Estágio 1), permitindo ao usuário escolher uma nova imagem e também uma nova proporção, se desejar.
4. Integração Técnica e Persistência de Dados
Gerenciamento de Estado: O estado local do componente agora precisa gerenciar:
selectedAspectRatio: O valor numérico da proporção escolhida (ex: 1 ou 16/9).
croppedImageBlob: O objeto Blob da imagem final, já cortada.
Geração da Imagem Cortada: O processo de usar um <canvas> para gerar o Blob da imagem cortada permanece idêntico.
Persistência no Banco de Dados (Firestore): Para que a aplicação saiba como exibir a imagem corretamente em outros lugares, é crucial salvar a proporção junto com a URL da imagem. O documento do "Sorteio" no Firestore deve agora conter dois campos relacionados à imagem:
imageUrl: A URL pública da imagem salva (ex: /uploads/sorteios/nome-da-imagem.png).
imageAspectRatio: Uma string ou número que representa a proporção salva (ex: "16:9" ou "1:1"). Isso permitirá que a interface de renderização aplique o CSS correto para exibir a imagem sem distorção.
Resumo Técnico (Tabela Rápida)
Etapa do Fluxo	O que o Usuário Vê	Ação Técnica em Background
1. Configuração	Botões de seleção "1:1" e "16:9".	O valor da proporção é salvo no estado do componente.
2. Seleção	Área de "Arraste e solte".	O input de arquivo é acionado.
3. Corte	Interface de corte com janela de corte dinâmica (quadrada ou retangular).	O componente react-easy-crop é renderizado com o aspect definido pelo estado.
4. Confirmação	Clica em "Confirmar Corte".	O <canvas> gera um Blob da imagem cortada.
5. Pré-visualização	Imagem final no formato 1:1 ou 16:9.	O Blob é salvo no estado.
6. Salvar Final	Clica em "Salvar Sorteio".	O Blob é enviado para a API. A URL e a proporção são salvas no Firestore.