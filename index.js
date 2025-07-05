const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const multer = require('multer');
const http = require('http');
const { Server } = require('socket.io');

const upload = multer();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const client = mqtt.connect('mqtt://broker.hivemq.com');

let statusCarrinho = 'OFFLINE';
let ultimaImagemBuffer = null;

// === MQTT ===
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
    io.emit('camera-image', ultimaImagemBuffer.toString('base64')); // envia em base64
  }
});

// === HTTP Endpoints ===
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
  ultimaImagemBuffer = imageBuffer;

  io.emit('camera-image', imageBuffer.toString('base64')); // envia imagem para os clientes conectados em base64

  res.status(200).send('Imagem recebida com sucesso!');
});

app.post('/upload64', (req, res) => {
  const { imagemBase64 } = req.body;

  if (!imagemBase64) {
    return res.status(400).send('Campo "imagemBase64" é obrigatório');
  }

  try {
    // Remove prefixo se vier com "data:image/jpeg;base64,..."
    const base64Data = imagemBase64.replace(/^data:image\/\w+;base64,/, '');
    ultimaImagemBuffer = Buffer.from(base64Data, 'base64');

    console.log('Imagem recebida via POST /upload64');
    io.emit('camera-image', imagemBase64); // envia para os clientes em base64

    res.status(200).send('Imagem Base64 recebida com sucesso!');
  } catch (err) {
    console.error('Erro ao processar imagem base64:', err.message);
    res.status(500).send('Erro ao processar a imagem base64');
  }
});

// === Socket.IO ===
io.on('connection', (socket) => {
  console.log('Novo cliente Socket.IO conectado');
  socket.emit('mensagem', 'Conexão Socket.IO estabelecida');

  socket.on('imagem', (base64Image) => {
    try {
      // Remove prefixo se vier como "data:image/jpeg;base64,..."
      const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
      ultimaImagemBuffer = Buffer.from(base64Data, 'base64');
      console.log('Imagem recebida via Socket.IO em Base64');

      // (opcional) reenviar para os outros clientes
      socket.broadcast.emit('camera-image', base64Image);
    } catch (e) {
      console.error('Erro ao processar imagem base64:', e.message);
    }
  });

  socket.on('mensagem', (msg) => {
    console.log('Mensagem recebida via Socket.IO:', msg);
  });
});

// === Start do servidor ===
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor online na porta ${PORT}`);
});
