// Server importieren
const express = require('express');
const cors = require('cors');

// App erstellen
const app = express();
const PORT = 5000;

// Middleware (Helfer)
app.use(cors()); // Frontend darf mit Backend reden
app.use(express.json()); // Kann JSON-Daten verstehen

// TEST-ROUTE: Einfacher Endpunkt
app.get('/', (req, res) => {
  res.json({ message: 'SmartStock Backend läuft!' });
});

// ========================================
// PRODUKTE ENDPUNKTE (vorerst mit statischen Daten)
// ========================================

// Temporäre Daten (später aus Datenbank)
let products = [
  { 
    id: 1, 
    name: 'Milch', 
    currentAmount: 2, 
    minAmount: 1, 
    unit: 'Liter' 
  },
  { 
    id: 2, 
    name: 'Brot', 
    currentAmount: 0.5, 
    minAmount: 1, 
    unit: 'Stück' 
  }
];

// GET alle Produkte
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET ein einzelnes Produkt
app.get('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (!product) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  res.json(product);
});

// POST neues Produkt erstellen
app.post('/api/products', (req, res) => {
  const newProduct = {
    id: products.length + 1,
    name: req.body.name,
    currentAmount: req.body.currentAmount,
    minAmount: req.body.minAmount,
    unit: req.body.unit
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// PUT Produkt aktualisieren
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  products[index] = {
    ...products[index],
    ...req.body
  };
  
  res.json(products[index]);
});

// DELETE Produkt löschen
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  products.splice(index, 1);
  res.json({ message: 'Produkt gelöscht' });
});

// ========================================
// STANDORTE ENDPUNKTE
// ========================================

let locations = [
  { id: 1, name: 'Kühlschrank' },
  { id: 2, name: 'Vorratsschrank' }
];

app.get('/api/locations', (req, res) => {
  res.json(locations);
});

app.post('/api/locations', (req, res) => {
  const newLocation = {
    id: locations.length + 1,
    name: req.body.name
  };
  locations.push(newLocation);
  res.status(201).json(newLocation);
});

// ========================================
// KATEGORIEN ENDPUNKTE
// ========================================

let categories = [
  { id: 1, name: 'Backwaren' },
  { id: 2, name: 'Milchprodukte' }
];

app.get('/api/categories', (req, res) => {
  res.json(categories);
});

app.post('/api/categories', (req, res) => {
  const newCategory = {
    id: categories.length + 1,
    name: req.body.name
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});