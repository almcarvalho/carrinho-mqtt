from pathlib import Path

readme_content = """
# 🚗 Controle do Carrinho – API MQTT

API responsável por intermediar comandos HTTP e publicações MQTT para controlar um carrinho robô via broker MQTT (HiveMQ).

🌐 Base URL:  
https://carrinho-mqtt-b41bxxxb118.herokuapp.com

---

## 📦 Endpoints

### 🔹 GET /comando

Envia um comando via MQTT para o carrinho.

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




<img width="1133" alt="image" src="https://github.com/user-attachments/assets/c8622516-15c1-4083-b0a0-1224ca9b7ffe" />
