carrinho mqtt (backend em node.js)

📄 Controle do Carrinho – API MQTT

🌐 Base URL
https://carrinho-mqtt-b41bxxb118.herokuapp.com

Endpoints

GET /comando
Envia um comando via MQTT para o carrinho.

Parâmetros de Consulta

Parâmetro	Tipo	Obrigatório	Descrição
comando	string	Sim	O comando a ser enviado (ex: frente, fire...)
Comandos disponíveis

Comando	Ação
frente	Move o carrinho para frente
tras	Move o carrinho para trás
esquerda	Gira o carrinho para esquerda
direita	Gira o carrinho para direita
farol	Liga ou desliga o farol
buzina	Ativa a buzina
canhao-cima	Move o canhão para cima
canhao-baixo	Move o canhão para baixo
canhao-esquerda	Move o canhão para a esquerda
canhao-direita	Move o canhão para a direita
fire	Dispara o canhão
Respostas

200 OK
Exemplo:
Comando enviado: frente
400 Bad Request
Exemplo:
Comando inválido
GET /status
Consulta se o carrinho está online.

O status é lido do tópico MQTT carrinho/status (valores esperados: ONLINE ou OFFLINE).

Respostas

200 OK
online
400 Bad Request
offline
Middleware

Esta API possui CORS habilitado para todas as origens:

app.use(cors());
Para restringir para um domínio específico:

app.use(cors({
  origin: 'https://seusite.netlify.app'
}));
Exemplo de Uso

curl:

curl "https://carrinho-mqtt-b41b2fefb118.herokuapp.com/comando?comando=frente"
curl "https://carrinho-mqtt-b41b2fefb118.herokuapp.com/status"



<img width="1133" alt="image" src="https://github.com/user-attachments/assets/c8622516-15c1-4083-b0a0-1224ca9b7ffe" />
