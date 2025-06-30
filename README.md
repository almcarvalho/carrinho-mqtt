# 🚗 Controle do Carrinho – API MQTT

API responsável por intermediar comandos HTTP e publicações MQTT para controlar um carrinho robô via broker MQTT (HiveMQ).

🌐 Base URL:  
https://carrinho-mqtt-b41bxxxb118.herokuapp.com

---

## 📦 Endpoints

### 🔹 GET /comando

Envia um comando via MQTT para o carrinho.

Exemplo:
curl --location 'https://carrinho-mqtt-b4xxxxxxb118.herokuapp.com/comando?comando=frente'

📥 Parâmetros de consulta:

| Parâmetro | Tipo   | Obrigatório | Descrição                                     |
|-----------|--------|-------------|-----------------------------------------------|
| comando   | string | Sim         | O comando a ser enviado (ex: frente, fire...) |

🎮 Comandos disponíveis:

| Comando           | Ação                            |
|-------------------|---------------------------------|
| frente            | Move o carrinho para frente     |
| tras              | Move o carrinho para trás       |
| esquerda          | Gira o carrinho para esquerda   |
| direita           | Gira o carrinho para direita    |
| farol             | Liga ou desliga o farol         |
| buzina            | Ativa a buzina                  |
| canhao-cima       | Move o canhão para cima         |
| canhao-baixo      | Move o canhão para baixo        |
| canhao-esquerda   | Move o canhão para a esquerda   |
| canhao-direita    | Move o canhão para a direita    |
| fire              | Dispara o canhão                |

📤 Respostas:

- ✅ 200 OK


### 🔹 GET /status

Consulta o status atual do carrinho (online ou offline), baseado no tópico MQTT carrinho/status.

📤 Respostas:

- ✅ 200 OK  
online

Sempre exibir os detalhes


- ❌ 400 Bad Request  
offline




<img width="1133" alt="image" src="https://github.com/user-attachments/assets/c8622516-15c1-4083-b0a0-1224ca9b7ffe" />
