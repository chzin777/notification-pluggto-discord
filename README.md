<h1>📦 Monitoramento de Pedidos - Plugg.to → Discord</h1>

<p>Este script monitora <strong>novos pedidos na API da Plugg.to</strong> e <strong>envia notificações para um canal do Discord</strong> via webhook.</p>

<h2>📌 Funcionalidades</h2>
<ul>
  <li>Autenticação automática na API da Plugg.to</li>
  <li>Busca de pedidos com status <strong>"Nota Fiscal Solicitada"</strong></li>
  <li>Envio automático de notificações para o Discord</li>
  <li>Evita notificações duplicadas</li>
  <li>Rodando continuamente a cada 5 minutos</li>
</ul>

<hr>

<h2>📋 <strong>Pré-requisitos</strong></h2>
<p>Antes de rodar o script, certifique-se de ter:</p>
<ul>
  <li>✅ <strong>Node.js</strong> instalado (versão 16+ recomendada)</li>
  <li>✅ <strong>Conta na Plugg.to</strong> com credenciais de API</li>
  <li>✅ <strong>Webhook do Discord</strong> configurado</li>
</ul>
<p>Se não tiver o Node.js instalado, baixe e instale <a href="https://nodejs.org/" target="_blank">aqui</a>.</p>

<hr>

<h2>⚙ <strong>Configuração e Instalação</strong></h2>

<h3>🔹 1. Clone este repositório ou baixe os arquivos:</h3>
<pre>
<code>git clone https://github.com/seu-usuario/pluggto-discord-bot.git</code>
</pre>

<h3>🔹 2. Instale as dependências do projeto:</h3>
<pre>
<code>npm install axios</code>
</pre>

<h3>🔹 3. Configure suas credenciais no arquivo <code>app.js</code>:</h3>
<pre>
<code>
const CLIENT_ID = 'SUA_CLIENT_ID';
const CLIENT_SECRET = 'SEU_CLIENT_SECRET';
const API_USER = 'SEU_API_USER';
const API_PASSWORD = 'SUA_API_PASSWORD';

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/seu_webhook';
</code>
</pre>

<h3>🔹 4. Execute o script:</h3>
<pre>
<code>node app.js</code>
</pre>

<hr>

<h2>🔄 <strong>Como Funciona?</strong></h2>
<ul>
  <li>✔ O script se autentica na <strong>API da Plugg.to</strong> e busca pedidos com o status <code>waiting_invoice</code>.</li>
  <li>✔ Se encontrar novos pedidos, envia uma <strong>mensagem formatada para o Discord</strong> com as informações do pedido.</li>
  <li>✔ O script <strong>evita notificações duplicadas</strong> utilizando um sistema de controle de notificações em memória.</li>
  <li>✔ O monitoramento <strong>é contínuo e roda a cada 5 minutos</strong> por padrão.</li>
</ul>

<hr>

<h2>📡 <strong>Formato da Mensagem no Discord</strong></h2>
<p>A mensagem enviada ao Discord segue este formato:</p>
<pre>
<code>
────────────────────────
⚠️ Novo Pedido Recebido!
🆔 ID do Pedido: [ID]
📌 Status: Nota Fiscal Solicitada
👤 Comprador: [Nome Completo]
💰 Total: R$[Valor Total]
🛒 Produtos:
  - Produto 1 (Quantidade)
  - Produto 2 (Quantidade)
────────────────────────
</code>
</pre>

<hr>

<h2>🚀 <strong>Personalizações</strong></h2>
<p>Para modificar o script, você pode alterar:</p>
<ul>
  <li>🔹 <strong>Intervalo de tempo</strong>: Ajuste o valor no <code>setInterval</code> (padrão: 5 minutos).</li>
  <li>🔹 <strong>Status do pedido</strong>: Atualize o filtro para buscar outros status na função <code>getNewOrders</code>.</li>
  <li>🔹 <strong>Formato da mensagem</strong>: Customize a mensagem enviada ao Discord na função <code>sendDiscordMessage</code>.</li>
</ul>

<hr>

<h2>💡 <strong>Contribuições</strong></h2>
<p>Contribuições são bem-vindas! Caso encontre problemas ou tenha sugestões, abra uma <strong>issue</strong> ou envie um <strong>pull request</strong> no repositório.</p>

<hr>

<h2>📄 <strong>Licença</strong></h2>
<p>Este projeto está licenciado sob a <strong>Licença MIT</strong>.</p>
