const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const multer = require('multer'); // <-- Adicionado
const upload = multer();          // <-- Adicionado

const app = express();

app.use(cors());
app.use(express.json());

const client = mqtt.connect('mqtt://broker.hivemq.com');

let statusCarrinho = 'OFFLINE';
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

app.get('/camera', (req, res) => {
  if (!ultimaImagemBuffer) {
    return res.status(404).send('Nenhuma imagem disponível no momento');
  }

  res.setHeader('Content-Type', 'image/jpeg');
  res.send(ultimaImagemBuffer);
});

app.post('/upload', upload.single('image'), (req, res) => {
  const imageBuffer = req.file.buffer;
  console.log("Imagem recebida via HTTPS:");
  console.log(imageBuffer);

  ultimaImagemBuffer = imageBuffer; // opcional: reaproveita no /camera.jpg

  res.status(200).send('Imagem recebida com sucesso!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Servidor online");
});
