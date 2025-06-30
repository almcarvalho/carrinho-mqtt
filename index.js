const express = require('express');
const mqtt = require('mqtt');
const app = express();
app.use(express.json());

const client = mqtt.connect('mqtt://broker.hivemq.com');

// Estado atual do carrinho
let statusCarrinho = 'OFFLINE';

client.on('connect', () => {
  console.log('MQTT conectado');
  client.subscribe('carrinho/status');
});

client.on('message', (topic, message) => {
  if (topic === 'carrinho/status') {
    const conteudo = message.toString().trim().toUpperCase();
    if (conteudo === 'ONLINE' || conteudo === 'OFFLINE') {
      statusCarrinho = conteudo;
    }
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

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor online");
});