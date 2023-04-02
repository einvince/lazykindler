# Lazy Kindler
<br>

<!-- ![cooltext400798739959192](https://user-images.githubusercontent.com/16133390/147348820-9db84863-9431-4e67-814c-f1e1ddde8372.png) -->

<img src="./header.svg" width="800" height="400" alt="Click to see the source">

# ✨ Recursos

- 🌈 Importe livros e exiba a lista de livros de forma eficiente.

- 💅 Crie coleções, como uma coleção de romances de ficção científica ou artes marciais.

- 🚀 Exibição multidimensional, mostre a lista de livros por título, autor, classificação, coleção, tags etc.

- 🛡 Pesquise por livros usando qualquer palavra-chave, como título, autor ou editora.

- 📦 Baixe livros através do menu de contexto com o botão direito do mouse ou baixe todos os livros gerenciados pela plataforma.

- 🛡 Leitura de livro: a plataforma suporta uma função para leitura dos livros.

- 📦 Função backup: a plataforma usa `sqlite3` para o banco de dados e armazena todos os livros em um diretório designado tornando fácil fazer backup.

- 🎻 Importação automática das notas destacadas ao conectar o computador ao `kindle`.

- 📣 Importação das notas destacadas do aplicativo `静读天下apk` (Jing Du Tian Xia) em dispositivos Android.

- 🎺 Notas destacadas: suporta "destaque secundário" e "exclusão do destaque secundário" para as notas importadas.

-🥁 Adicione comentários às suas notas destacadas.

-🎻 Crie coleções para suas notas destacadas e gerencie-as categoricamente.

-🚀 Kindle Vocabulary Builder: A plataforma suporta importar palavras e exemplos dos construtores vocabulares kindle.

# Plataformas Suportadas

Atualmente adaptado apenas para a plataforma `mac`, pode haver erros desconhecidos ao executar na plataforma `windows`.

# Formatos de eBook Suportados

mobi e azw3. Outros tipos de eBooks serão automaticamente ignorados durante a importação.

# Problema Resolvido

Depois de baixar **milhares** de eBooks da internet, como gerenciá-los eficientemente?

<br />

A qualidade dos vários eBooks varia muito, alguns escritos por autores comuns e outros por escritores renomados mundialmente. Existem também muitos gêneros diferentes, como ficção científica, romance, fantasia e muito mais.

<br />

Se você tiver que procurar um livro em um diretório contendo milhares de livros toda vez, isso é uma dor de cabeça. Portanto, é necessário gerenciar esses eBooks adequadamente para permitir que possamos pesquisar livros dentro de uma faixa menor com base em preferências específicas, encontrar rapidamente o livro desejado e evitar perder tempo demais procurando.

<br />

`lazykindler` nasceu para esse propósito.

# Introdução de recursos

## 1. Importação de Livros

Clique no botão `Carregar Arquivo` e a plataforma irá escanear recursivamente arquivos de eBooks suportados em diretórios como `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc. Arquivos duplicados não serão carregados novamente.

<br />

Atualmente, apenas os formatos `mobi` e `azw3` são suportados para importação, e a plataforma não oferece uma função de conversão de formato eBook. É fácil encontrar eBooks em formatos específicos; eu geralmente encontro eles neste site: http://www.fast8.com. A vantagem deste site é que ele oferece uma ampla seleção de livros, e várias opções de formato estão disponíveis ao baixar. Basta baixar os livros no formato desejado.

## 2. Adicionar Metadados aos Livros

Você pode modificar a classificação do livro, tags, coleção, autor, editora e capa. Note que essas operações não modificam o arquivo do livro em si mas adicionam registros ao banco de dados.

## 3. Análise das Informações dos Livros

Após importar eBooks na plataforma automaticamente extrairá dados dos arquivos eBook para exibição das informações e gerenciamento dos livros.

## 4.Coleções

Você pode criar coleções com seus livros favoritos como por exemplo "Coleção Ficção Científica", "Coleção Romance" entre outras . Adicione capas representativas às coleções que você gosta , você também pode adicionar tags as suas coleções . Cada coleção pode ter livros selecionados da biblioteca , além disso você pode adicionar classificações , tags e capas as coleções. Depois de ter várias coleções, você pode pesquisar livros diretamente nessas coleções no futuro.

## 5. Exibição

Para suportar a exibição de livros em diferentes dimensões, você pode `classificar` e `adicionar tags` aos livros, bem como `modificar autores` e `modificar editoras`. Os livros podem ser exibidos em várias dimensões como por exemplo: `classificação`, `tags`, `autor` e editora`. Além disso, você pode modificar a capa do livro.

## 6. Download

Os Livros na plataforma podem ser baixados clicando no botão "Download" na seção "Operação" do cartão do livro . Os livros baixados serão salvos no diretório home do usuário sob o nome de "Download" ou "下载". Clicar em "Baixar Todos os Livros" na página inicial irá baixar todos os livros para a pasta 'Documents' ou '文稿' dentro da pasta 'lazykindler' localizada no diretório home do usuário. Clicar várias vezes em "Baixar Todos os Livro"s não fará com que os livros existentes sejam baixados novamente.

## 7.Leitura

A plataforma fornece funções básicas para leitura dos seus eBooks favoritos . Atualmente eu ainda não encontrei uma biblioteca para implementação da leitura nos formatos mobi e azw3 usando reactjs . Portanto , ao clicar pela primeira vez no botão “Ler Livro”, a plataforma converterá esses dois formatos para o formato epub. A ferramenta usada para conversão é `/Applications/calibre.app/Contents/MacOS/ebook-convert`, portanto, o computador precisa ter `calibre` instalado para usar a função de leitura do livro corretamente. A conversão só é necessária na primeira vez que você clica em "Ler Livro". A página pode ficar sem resposta por um curto período, o que é normal. O tempo de espera depende do tamanho do eBook, mas geralmente é rápido. Os livros convertidos são armazenados no diretório `backend/data` da plataforma principal.

<br />

## 8. Fluxo de Processamento

Os livros exibidos na página 'Livros -> Biblioteca' são oficialmente armazenados enquanto os novos livros importados são exibidos na página 'Livros -> Temporários'. (Além da diferença nas localizações das páginas , não há muita diferença entre os livros oficiais e temporários no backend).
<br />
Depois que um livro `temporário` é adicionado a qualquer coleção, ele será movido de `Livros -> Temporários` para `Livros -> Biblioteca`. O objetivo disso é **distinguir entre livros armazenados oficialmente e livros temporariamente importados. Livros armazenados oficialmente foram filtrados, livros indesejáveis removidos e categorizados, enquanto os livros temporariamente importados tendem a ser diversos.**

## 9. Backup

O banco de dados usado é o `sqlite3`, localizado em `backend/lazykindler.db`.

<br />

Quando a plataforma é lançada pela primeira vez, o arquivo do banco de dados será criado e inicializado automaticamente. Este arquivo contém todas as informações dos dados na plataforma exceto pelos livros. Os livros importados são copiados para o diretório `backend/data`. Observe que para facilitar a operação interna da plataforma, os nomes dos livros no diretório `backend/data` são anexados com o valor md5 do livro.

<br />

Para fazer backup de todos os livros e dados na plataforma, basta salvar `backend/lazykindler.db` e `backend/data`. Para iniciar o serviço em outro local na próxima vez, copie  `backend/lazykindler.db` and  `backend/data` nas posições correspondentes.

## 10. Importar destaques Kindle

Este recurso atualmente só é suportado na plataforma Mac.

<br />

A plataforma detectará automaticamente se o dispositivo Kindle está conectado ou não ao computador. Quando estiver conectado ao computador, a plataforma irá importar o arquivo "My Clippings.txt" do dispositivo Kindle para gerenciamento unificado e exibição multidimensional. Quando o arquivo "My Clippings.txt" do Kindle for alterado, a plataforma importará automaticamente o conteúdo recém-adicionado em "My Clippings.txt", e os dados antigos não serão importados repetidamente. Os usuários podem ver o conteúdo recém-adicionado atualizando a página após conectar o dispositivo Kindle ao computador.

<br />

Deve-se notar que o Kindle processa as notas de destaque adicionadas pelo usuário em um bloco de texto sem quebras de linha, mesmo se for o conteúdo de vários parágrafos. O `lazykindler` reconhece e processa inteligentemente as quebras de linha ao importar o arquivo "My Clippings.txt" do Kindle, como mostrado abaixo.

<img src="https://user-images.githubusercontent.com/16133390/210229975-4e7145e7-5d91-4aff-85ff-f5550fd7fe2c.png" width="66%">

## 11. Realizar destaques secundários nas notas destacadas

As notas destacadas são parte do texto ou dos parágrafos relacionados que destacamos e registramos ao ler um livro, muitas vezes porque uma frase ou palavra nele tem certo impacto sobre nós. Após a importação das notas destacadas na plataforma, é necessário realçar as frases ou palavras que ressoaram com você durante o processo subsequente de classificação, tornando mais fácil realçar e exibir aquela pequena seção de texto que ressoou com você.

<br />

Usando `lazykindler`, você pode facilmente realizar destaques secundários. Basta selecionar o texto relevante e clicar em `OK` na caixa de diálogo automaticamente aberta.

<img src="https://user-images.githubusercontent.com/16133390/210230077-c9a4532b-aafc-4ba2-a163-cd151c98d831.png" width="66%">

## 12. Adicionar comentários às notas destacadas

Você pode registrar alguns pensamentos sobre o texto que ressoou com você.

<img width="1379" alt="Xnip2023-02-05_15-19-18" src="https://user-images.githubusercontent.com/16133390/216806787-4b76a541-608d-4e8e-9d8e-2651bf7842ef.png">

## 13. Importar destaques do apk Jingdu Tianxia

O `Jingdu Tianxia apk` é um leitor popular na plataforma Android. Atualmente, uso este software para ler livros no e-reader Hisense, e o software também suporta a adição de notas destacadas. Então eu adicionei suporte para importar notas destacadas deste software.
<br />
O formato do arquivo de notas destacadas exportado do `Jingdu Tianxia apk` é `.mrexpt`. Coloque este arquivo em qualquer diretório, como `~/Download`, `~/下载`, `~/Desktop`, `~/桌面`, etc., e a plataforma pode completar automaticamente a operação de importação.

## 14. Importar o Construtor de Vocabulário Kindle

O Construtor de Vocabulário é um recurso no Kindle que registra palavras ou frases pesquisadas durante a leitura de um livro. Este método pode ser usado para ler livros originais em inglês e registrar palavras, que podem ser usadas para aprender e revisar essas palavras posteriormente. A plataforma suporta a importação desses vocabulários.

Com base na importação desses vocabulários, a plataforma fornece uma boa interface para exibir essas informações, e você pode criar manualmente vocabulário e exemplos, bem como adicionar traduções aos exemplos.

<img width="1322" alt="Xnip2023-03-31_23-23-41" src="https://user-images.githubusercontent.com/16133390/229163528-952ee43f-bf31-43a7-b39b-98d637e584da.png">

<img width="1320" alt="Xnip2023-03-31_23-23-57" src="https://user-images.githubusercontent.com/16133390/229163550-8c321a41-7df4-41af-9bd0-fd765e113a1f.png">

# Requisitos do Sistema

`python 3.10.4`

`nodejs v19.6.0`

`Calibre`

Outras versões não foram testadas

# Iniciar o Serviço

## Instalar Dependências

1. Execute no diretório `backend`

```

pip3 install -r requirements.txt

```

2. Se você precisar usar o recurso `chatgpt`, configure a chave `chatgpt` em `backend/config.ini`. O endereço para gerar a chave no site oficial do OpenAi é `https://platform.openai.com/account/api-keys`.

3. Execute no diretório `frontend`

```

yarn install

```

## Iniciar o Serviço

```

./start.sh

```

Em seguida, visite http://localhost:8000 em seu navegador.

## Parar o Serviço

```

./stop.sh

```

## Nota

A plataforma foi projetada para indivíduos e não possui recursos como login e registro.

# Demonstração da Plataforma

Abaixo estão capturas de tela da minha configuração local após fazer upload de livros e configurar coleções:

<img width="1418" alt="1" src="https://user-images.githubusercontent.com/16133390/216806475-97ee4960-40cc-4649-b414-0687724bb6ad.png">
<br />
<img width="1398" alt="Xnip2023-02-05_15-13-49" src="https://user-images.githubusercontent.com/16133390/216806612-dc1baf4f-7ed5-4b3d-ab44-73c7f07c73a7.png">
<br />
<img width="1418" alt="2" src="https://user-images.githubusercontent.com/16133390/216806480-def76f45-f8ba-41fc-9512-a448e9fbce32.png">
<br />
<img width="1418" alt="3" src="https://user-images.githubusercontent.com/16133390/216806485-caf74fe2-0cef-45f8-9a29-47780e72132d.png">
<br />
<img width="1799" alt="Xnip2023-02-14_12-36-20" src="https://user-images.githubusercontent.com/16133390/218640667-ba74048a-3b78-41c6-a772-dc1e56485b56.png">

<br />
<img width="1801" alt="Xnip2023-02-14_12-36-38" src="https://user-images.githubusercontent.com/16133390/218640680-263195c2-7ac3-4947-b7a5-b70375074e9c.png">

<br />

# Outro

A ferramenta mais famosa para `kindle` deve ser o `calibre`, mas a funcionalidade deste software é mais focada na "edição", e a exibição multidimensional de ebooks é relativamente simples. Portanto, planejo escrever uma ferramenta especificamente para gerenciar ebooks que atenda às necessidades práticas.

Atualmente, estou desenvolvendo esta ferramenta no meu tempo livre. Se você também gosta de ler ebooks e tem sugestões de recursos de gerenciamento de ebook, sinta-se à vontade para levantar um problema.

Se tiver algum problema ou solicitação de recurso, entre em contato com o autor pelo email: wupengcn301@gmail.com, WeChat: leowucn. Obrigado.
