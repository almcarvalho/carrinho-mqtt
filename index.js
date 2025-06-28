const express = require('express');
const mqtt = require('mqtt');
const app = express();
app.use(express.json());

const client = mqtt.connect('mqtt://broker.hivemq.com');

client.on('connect', () => {
  console.log('MQTT conectado');
});

app.get('/comando', (req, res) => {
  const comando = req.query.comando;
  if (!comando) return res.status(400).send("Comando inválido");
  client.publish('carrinho/comando', comando);
  res.send("Comando enviado: " + comando);
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor online");
});
