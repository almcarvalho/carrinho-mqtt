const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const app = express();

app.use(cors()); // Habilita CORS para todas as rotas
app.use(express.json());

const client = mqtt.connect('mqtt://broker.hivemq.com');

// Estado atual do carrinho
let statusCarrinho = 'OFFLINE';
// Última imagem recebida da câmera
let ultimaImagemBuffer = null;

client.on('connect', () => {
  console.log('MQTT conectado');
  client.subscribe('carrinho/status');
  client.subscribe('carrinho/camera');
});

client.on('message', (topic, message) => {
  if (topic === 'carrinho/status') {
    const conteudo = message.toString().trim().toUpperCase();
    if (conteudo === 'ONLINE' || conteudo === 'OFFLINE') {
      statusCarrinho = conteudo;
    }
  }

  if (topic === 'carrinho/camera') {
    ultimaImagemBuffer = Buffer.from(message);
    console.log('Imagem recebida da câmera via MQTT');
  }
});

app.get('/comando', (req, res) => {
  const comando = req.query.comando;
  if (!comando) return res.status(400).send("Comando inválido");
  client.publish('carrinho/comando', comando);
  res.send("Comando enviado: " + comando);
});

app.get('/status', (req, res) => {
  if (statusCarrinho === 'ONLINE') {
    return res.status(200).send('online');
  } else {
    return res.status(400).send('offline');
  }
});

app.get('/camera.jpg', (req, res) => {
  if (!ultimaImagemBuffer) {
    return res.status(404).send('Nenhuma imagem disponível no momento');
  }

  res.setHeader('Content-Type', 'image/jpeg');
  res.send(ultimaImagemBuffer);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor online");
});
