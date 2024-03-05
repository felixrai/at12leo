const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// Configurações do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Lista de usuários (simulando um banco de dados)
let userList = [
  { id: 1, name: 'Usuário 1', email: 'usuario1@example.com', dob: '1990-01-01', gender: 'Masculino' },
  { id: 2, name: 'Usuário 2', email: 'usuario2@example.com', dob: '1995-05-15', gender: 'Feminino' }
 
];

// Rota de listagem de usuários
app.get('/users', (req, res) => {
  res.render('userList', { userList });
});

// Rota para excluir usuário
app.get('/users/delete/:id', (req, res) => {
  const userId = req.params.id;
  userList = userList.filter(user => user.id !== parseInt(userId));
  res.redirect('/users');
});

// Rota para exibir o formulário de registro de usuário
app.get('/users/register', (req, res) => {
  res.render('registerUser');
});

// Rota para adicionar um novo usuário
app.post('/users/add', (req, res) => {
  const { name, email, cpf, dob, gender, monthlyIncome, address, number, city } = req.body;

  let errors = [];

  if (!name || name.length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
  }

  if (!cpf || !/^\d{11}$/.test(cpf)) {
      errors.push('CPF inválido');
  }

  if (isNaN(parseFloat(monthlyIncome)) || parseFloat(monthlyIncome) <= 0) {
      errors.push('Renda mensal inválida');
  }

  if (!address || address.length < 3) {
      errors.push('Logradouro deve ter no mínimo 3 caracteres');
  }

  if (isNaN(parseInt(number)) || parseInt(number) <= 0) {
      errors.push('Número inválido');
  }

  if (!city || city.length < 3) {
      errors.push('Cidade deve ter no mínimo 3 caracteres');
  }
//////

if (errors.length > 0) {
  res.status(400).json({ errors });
} else {
  // Se não houver erros, criar um novo usuário
  const newUser = {
    id: userList.length + 1,
    name,
    email,
    cpf,
    dob,
    gender, 
    monthlyIncome,
    address,
    number,
    city
  };

  // Adicionar o novo usuário à lista
  userList.push(newUser);

  // Redirecionar para a página de sucesso
  res.render('success');
}
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




