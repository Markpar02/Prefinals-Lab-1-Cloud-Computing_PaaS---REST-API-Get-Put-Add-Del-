const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const readUsers = () => {
  const data = fs.readFileSync('users.json', 'utf8');
  return JSON.parse(data);
};

app.get('/getCompany', (req, res) => {
  const users = readUsers();
  if (users && users.company) {
    res.json({
      companyName: users.company.name,
      employees: users.company.employees
    });
  } else {
    res.status(500).json({ error: 'Unable to retrieve company details' });
  }
});

app.get('/getUsers', (req, res) => {
  const users = readUsers();
  if (users && users.company && users.company.employees) {
    res.json(users.company.employees);
  } else {
    res.status(500).json({ error: 'Unable to retrieve user list' });
  }
});

app.post('/addUser', (req, res) => {
  const newUser = req.body;
  const users = readUsers();
  
  if (!users.company.employees) {
    users.company.employees = {};
  }

  const userId = newUser.id;
  if (users.company.employees[userId]) {
    res.status(400).json({ error: `User with ID ${userId} already exists` });
  } else {
    users.company.employees[userId] = newUser;
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.json(users.company.employees);
  }
});

app.get('/getUser/:id', (req, res) => {
  const userId = req.params.id;
  const users = readUsers();
  
  if (users && users.company && users.company.employees && users.company.employees[userId]) {
    res.json(users.company.employees[userId]);
  } else {
    res.status(404).json({ error: `User with ID ${userId} not found` });
  }
});

app.delete('/deleteUser/:id', (req, res) => {
  const userId = req.params.id;
  const users = readUsers();

  if (users && users.company && users.company.employees && users.company.employees[userId]) {
    delete users.company.employees[userId];
    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.json(users.company.employees);
  } else {
    res.status(404).json({ error: `User with ID ${userId} not found` });
  }
});

const server = app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
