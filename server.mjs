import express from 'express';
import cors from 'cors';

const app = express();
const port = 3001; // Porta separada do frontend (Vite)

app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de teste inicial
app.get('/', (req, res) => {
  res.send('Backend da Gestão de Ramais está no ar!');
});

// --- Endpoints da API --- 

// Endpoint para obter todos os dados (depois será de um DB)
app.get('/api/data', (req, res) => {
  console.log('Recebida requisição GET para /api/data');
  // Por enquanto, vamos retornar dados mockados
  res.json({
    message: "Dados carregados com sucesso (mock)",
    // Aqui entrarão os dados do banco de dados
  });
});

// Endpoint para salvar todos os dados
app.post('/api/data', (req, res) => {
  console.log('Recebida requisição POST para /api/data');
  const data = req.body;
  // Aqui, a lógica para salvar os dados no banco de dados seria implementada
  console.log('Dados recebidos:', data);
  res.status(200).json({ message: 'Dados salvos com sucesso no backend!' });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
