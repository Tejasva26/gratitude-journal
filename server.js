const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const dataFile = path.join(__dirname, 'data', 'entries.json');

function loadEntries() {
  if (!fs.existsSync(dataFile)) return [];
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveEntries(entries) {
  fs.writeFileSync(dataFile, JSON.stringify(entries, null, 2));
}

app.get('/api/entries', (req, res) => {
  res.json(loadEntries());
});

app.post('/api/entry', (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text required' });

  const entries = loadEntries();
  const newEntry = {
    id: Date.now(),
    text,
    timestamp: new Date().toISOString(),
  };
  entries.push(newEntry);
  saveEntries(entries);
  res.status(201).json(newEntry);
});

app.delete('/api/entry/:id', (req, res) => {
  const id = Number(req.params.id);
  let entries = loadEntries();
  const index = entries.findIndex(entry => entry.id === id);
  if (index === -1) return res.status(404).json({ error: 'Entry not found' });

  entries.splice(index, 1);
  saveEntries(entries);
  res.json({ message: 'Entry deleted' });
});

app.post('/api/affirmation', (req, res) => {
  const affirmations = [
    "You're doing amazing 🌟",
    "Every day is a gift 🎁",
    "Keep spreading positivity 💖",
    "You are growing beautifully 🌱",
    "You deserve happiness 💫",
    "Stay strong. You're not alone. 🤝"
  ];
  const affirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
  res.json({ affirmation });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
