const axios = require('axios');

// 📌 Função para formatar datas (YYYY-MM-DD)
function formatDate(input) {
    const date = input instanceof Date ? input : new Date(input);
    if (isNaN(date.getTime())) throw new Error("O parâmetro fornecido não é uma data válida.");

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses começam em 0
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`; // Formato YYYY-MM-DD
}

// 📌 Datas dinâmicas para API
const dateToday = new Date();
const dateYesterday = new Date();
dateYesterday.setDate(dateYesterday.getDate() - 1);

const dateRange = `${formatDate(dateYesterday)}to${formatDate(dateToday)}`;

// 📌 URLs e credenciais
const PLUGG_API_AUTH_URL = 'https://api.plugg.to/oauth/token';
const PLUGG_API_ORDERS_URL = `https://api.plugg.to/orders?created=${dateRange}`;
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/seu_webhook';

const CLIENT_ID = '181366be31932112d0be7ff9db942af4';
const CLIENT_SECRET = '868b07a723fe7478203a470a9600baa4';
const API_USER = '1666211092606';
const API_PASSWORD = 'ZGFuaWxsby5zaWx2YUByM3N1cHJpbWVudG9zLmNvbS5icjAuNjAyNTM3NDIzMjQxMjE3MzE2NjYyMTEwOTI2MDY=';

const notifiedOrders = new Set(); // 📌 Armazena pedidos já notificados (MAS SO ARMAZENA ENQUANTO O SCRIPT ESTÁ EM EXECUÇÃO)

// 📌 Autenticação na API da Plugg.to
async function authenticate() {
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('username', API_USER);
        params.append('password', API_PASSWORD);

        const response = await axios.post(PLUGG_API_AUTH_URL, params, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        console.log('✅ Autenticado com sucesso!');
        return response.data.access_token;
    } catch (error) {
        console.error('❌ Erro ao autenticar:', error.response?.data || error.message);
        throw error;
    }
}

// 📌 Buscar pedidos e filtrar "waiting_invoice" que ainda não foram notificados
async function getNewOrders(token) {
    try {
        const response = await axios.get(PLUGG_API_ORDERS_URL, {
            headers: { Authorization: `Bearer ${token}` },
        });

        console.log('📩 Resposta completa da API:', JSON.stringify(response.data, null, 2));

        const ordersArray = response.data.result || [];
        
        // Filtrando apenas pedidos não notificados
        const newOrders = ordersArray.filter(item => {
            const order = item.Order || {};
            const id = order.id || null;

            if (!notifiedOrders.has(id) && order.status === 'waiting_invoice') {
                console.log(`🆕 Novo pedido detectado: ID ${id}`);
                return true;
            } else {
                console.log(`✅ Pedido já notificado: ID ${id}`);
                return false;
            }
        });

        console.log(`📊 Pedidos filtrados (não notificados): ${newOrders.length}`);
        return newOrders;
    } catch (error) {
        console.error('❌ Erro ao buscar pedidos:', error.response?.data || error.message);
        throw error;
    }
}

// 📌 Enviar notificação ao Discord (com espaçamento e produtos comprados)
async function sendDiscordMessage(order) {
    try {
        // 📦 Monta a lista de produtos comprados (nome e quantidade)
        const produtosComprados = order.Order.items.map(item => 
            `🔹 **${item.quantity}x** ${item.name}`
        ).join("\n");

        const message = {
            content: `
────────────────────────
⚠️ **Novo Pedido Recebido!**  
🆔 **ID do Pedido:** ${order.Order.id}  
📌 **Status:** Nota Fiscal Solicitada  
👤 **Comprador:** ${order.Order.payer_name || 'N/A'} ${order.Order.payer_lastname || ''}  
💰 **Total:** R$${order.Order.total ? order.Order.total.toFixed(2) : '0.00'}  
📦 **Produtos Comprados:**  
${produtosComprados}  
────────────────────────`
        };

        await axios.post(DISCORD_WEBHOOK_URL, message);
        console.log(`✅ Mensagem enviada para o pedido ${order.Order.id}`);

        // Marca o pedido como notificado
        notifiedOrders.add(order.Order.id);
    } catch (error) {
        console.error('❌ Erro ao enviar mensagem ao Discord:', error.response?.data || error.message);
    }
}

// 📌 Fluxo principal
(async () => {
    try {
        const token = await authenticate();
        console.log('🔄 Iniciando monitoramento de pedidos...');

        // Monitora a cada 5 minutos
        setInterval(async () => {
            try {
                const newOrders = await getNewOrders(token);

                if (newOrders.length > 0) {
                    console.log(`📦 Novos pedidos detectados: ${newOrders.length}`);
                    for (const order of newOrders) await sendDiscordMessage(order);
                } else {
                    console.log('🔎 Nenhum pedido novo detectado.');
                }
            } catch (error) {
                console.error('⚠️ Erro no monitoramento:', error.message);
            }
        }, 600000); // 5 minutos (Altere para mudar o intervalo de tempo em que o script procura por novos pedidos)
    } catch (error) {
        console.error('❌ Erro no fluxo principal:', error.message);
    }
})();
