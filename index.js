// Server importieren
const express = require('express');
const cors = require('cors');

// App erstellen
const app = express();
const PORT = 5000;

// Middleware (Helfer)
app.use(cors()); // Frontend darf mit Backend reden
app.use(express.json()); // Kann JSON-Daten verstehen

// Hilfsfunktion: Nächste ID generieren
const getNextId = (array) => {
  return array.length > 0 ? Math.max(...array.map(item => item.id || item.user_id || item.household_id || item.product_id || item.category_id || item.location_id || item.shopping_id || item.history_id || item.comment_id)) + 1 : 1;
};



// ============================================
// TEMPORÄRE DATEN (später Datenbank)
// ============================================
 
// Benutzer
let users = [
  {
    user_id: 1,
    username: 'sonja',
    email: 'sonja@example.com',
    password_hash: 'hashed_password_123', // Achtung, später richtig verschlüsseln!
    household_id: 1,
    role: 'admin',
    created_at: new Date('2026-01-15')
  },
  {
    user_id: 2,
    username: 'max',
    email: 'max@example.com',
    password_hash: 'hashed_password_456',
    household_id: 1,
    role: 'member',
    created_at: new Date('2026-01-20')
  }
];
 
// Haushalte
let households = [
  {
    household_id: 1,
    name: 'WG Musterstrasse',
    created_at: new Date('2026-01-15'),
    invite_code: 'ABC123'
  }
];
 
// Kategorien
let categories = [
  { category_id: 1, household_id: 1, name: 'Backwaren', sort_order: 1 },
  { category_id: 2, household_id: 1, name: 'Milchprodukte', sort_order: 2 },
  { category_id: 3, household_id: 1, name: 'Gemüse', sort_order: 3 },
  { category_id: 4, household_id: 1, name: 'Tiefkühl', sort_order: 4 }
];
 
// Standorte
let locations = [
  { location_id: 1, household_id: 1, name: 'Kühlschrank', description: 'Grosser Kühlschrank', sort_order: 1 },
  { location_id: 2, household_id: 1, name: 'Vorratsschrank', description: null, sort_order: 2 },
  { location_id: 3, household_id: 1, name: 'Tiefkühler', description: null, sort_order: 3 }
];
 
// Produkte
let products = [
  {
    product_id: 1,
    household_id: 1,
    name: 'Milch',
    category_id: 2,
    location_id: 1,
    quantity: 2,
    min_quantity: 1,
    unit: 'Liter',
    expiration_date: new Date('2026-03-25'),
    created_at: new Date('2026-03-01'),
    updated_at: new Date('2026-03-01')
  },
  {
    product_id: 2,
    household_id: 1,
    name: 'Brot',
    category_id: 1,
    location_id: 2,
    quantity: 0.5,
    min_quantity: 1,
    unit: 'Stück',
    expiration_date: new Date('2026-03-20'),
    created_at: new Date('2026-03-01'),
    updated_at: new Date('2026-03-15')
  },
  {
    product_id: 3,
    household_id: 1,
    name: 'Karotten',
    category_id: 3,
    location_id: 1,
    quantity: 500,
    min_quantity: 200,
    unit: 'g',
    expiration_date: new Date('2026-03-22'),
    created_at: new Date('2026-03-10'),
    updated_at: new Date('2026-03-10')
  }
];
 
// Einkaufsliste
let shoppingList = [
  {
    shopping_id: 1,
    household_id: 1,
    product_id: 2,
    needed_quantity: 1,
    checked: false,
    created_at: new Date('2026-03-15')
  }
];
 
// Verlauf
let history = [
  {
    history_id: 1,
    product_id: 1,
    user_id: 1,
    change_amount: -1,
    status: 'verbraucht',
    created_at: new Date('2026-03-15T10:30:00')
  },
  {
    history_id: 2,
    product_id: 2,
    user_id: 2,
    change_amount: -0.5,
    status: 'verbraucht',
    created_at: new Date('2026-03-15T14:20:00')
  }
];
 
// Kommentare
let comments = [
  {
    comment_id: 1,
    household_id: 1,
    user_id: 1,
    product_id: 2,
    message: 'Bitte Vollkornbrot kaufen!',
    created_at: new Date('2026-03-15T09:00:00')
  },
  {
    comment_id: 2,
    household_id: 1,
    user_id: 2,
    product_id: null,
    message: 'Wer geht heute einkaufen?',
    created_at: new Date('2026-03-16T11:00:00')
  }
];




// ============================================
// Endpunkte: AUTHENTIFIZIERUNG
// ============================================
 
// POST /api/auth/register - Neuer Benutzer
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  
  // Prüfen ob Email schon existiert
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email bereits registriert' });
  }
  
  const newUser = {
    user_id: getNextId(users),
    username,
    email,
    password_hash: `hashed_${password}`, // später richtig verschlüsseln!
    household_id: null,
    role: null,
    created_at: new Date()
  };
  
  users.push(newUser);
  res.status(201).json({ message: 'Benutzer erstellt', user: { user_id: newUser.user_id, username, email } });
});
 
// POST /api/auth/login - Benutzer einloggen
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password_hash === `hashed_${password}`);
  
  if (!user) {
    return res.status(401).json({ message: 'Email oder Passwort falsch' });
  }
  
  res.json({ 
    message: 'Login erfolgreich',
    user: { 
      user_id: user.user_id, 
      username: user.username, 
      email: user.email,
      household_id: user.household_id,
      role: user.role
    }
  });
});
 
// GET /api/auth/me - Aktueller Benutzer (später mit JWT Token)
app.get('/api/auth/me', (req, res) => {
  // Vorerst einfach User 1 zurückgeben
  const user = users[0];
  res.json({ user_id: user.user_id, username: user.username, email: user.email });
});
 
// ============================================
// Endpunkte: HAUSHALTE
// ============================================
 
// GET /api/households - Alle Haushalte des Users
app.get('/api/households', (req, res) => {
  // Später: nur Haushalte wo User Mitglied ist
  res.json(households);
});
 
// GET /api/households/:id - Einzelner Haushalt
app.get('/api/households/:id', (req, res) => {
  const household = households.find(h => h.household_id === parseInt(req.params.id));
  if (!household) {
    return res.status(404).json({ message: 'Haushalt nicht gefunden' });
  }
  res.json(household);
});
 
// POST /api/households - Neuer Haushalt
app.post('/api/households', (req, res) => {
  const { name } = req.body;
  
  const newHousehold = {
    household_id: getNextId(households),
    name,
    created_at: new Date(),
    invite_code: Math.random().toString(36).substring(2, 8).toUpperCase()
  };
  
  households.push(newHousehold);
  res.status(201).json(newHousehold);
});
 
// PUT /api/households/:id - Haushalt umbenennen
app.put('/api/households/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const household = households.find(h => h.household_id === id);
  
  if (!household) {
    return res.status(404).json({ message: 'Haushalt nicht gefunden' });
  }
  
  household.name = req.body.name || household.name;
  res.json(household);
});
 
// DELETE /api/households/:id - Haushalt löschen
app.delete('/api/households/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = households.findIndex(h => h.household_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Haushalt nicht gefunden' });
  }
  
  households.splice(index, 1);
  res.json({ message: 'Haushalt gelöscht' });
});
 
// POST /api/households/:id/join - Haushalt beitreten
app.post('/api/households/:id/join', (req, res) => {
  const { invite_code } = req.body;
  const household = households.find(h => h.household_id === parseInt(req.params.id));
  
  if (!household) {
    return res.status(404).json({ message: 'Haushalt nicht gefunden' });
  }
  
  if (household.invite_code !== invite_code) {
    return res.status(403).json({ message: 'Falscher Einladungscode' });
  }
  
  // User wird hier dem Haushalt hinzugefügt
  res.json({ message: 'Erfolgreich beigetreten', household });
});
 
// GET /api/households/:id/members - Alle Mitglieder
app.get('/api/households/:id/members', (req, res) => {
  const householdId = parseInt(req.params.id);
  const members = users.filter(u => u.household_id === householdId);
  res.json(members.map(u => ({ user_id: u.user_id, username: u.username, role: u.role })));
});
 
// DELETE /api/households/:id/members/:userId - Mitglied entfernen
app.delete('/api/households/:id/members/:userId', (req, res) => {
  const householdId = parseInt(req.params.id);
  const userId = parseInt(req.params.userId);
  
  const user = users.find(u => u.user_id === userId && u.household_id === householdId);
  
  if (!user) {
    return res.status(404).json({ message: 'Mitglied nicht gefunden' });
  }
  
  // User aus Haushalt entfernen
  user.household_id = null;
  user.role = null;
  
  res.json({ message: 'Mitglied entfernt' });
});
 
// PUT /api/households/:id/members/:userId - Rolle ändern
app.put('/api/households/:id/members/:userId', (req, res) => {
  const householdId = parseInt(req.params.id);
  const userId = parseInt(req.params.userId);
  const { role } = req.body;
  
  const user = users.find(u => u.user_id === userId && u.household_id === householdId);
  
  if (!user) {
    return res.status(404).json({ message: 'Mitglied nicht gefunden' });
  }
  
  user.role = role;
  res.json({ user_id: user.user_id, username: user.username, role: user.role });
});
 
// ============================================
// Entpunkte: KATEGORIEN
// ============================================
 
// GET /api/households/:householdId/categories
app.get('/api/households/:householdId/categories', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const householdCategories = categories
    .filter(c => c.household_id === householdId)
    .sort((a, b) => a.sort_order - b.sort_order);
  res.json(householdCategories);
});
 
// POST /api/households/:householdId/categories
app.post('/api/households/:householdId/categories', (req, res) => {
  const { name, sort_order } = req.body;
  const householdId = parseInt(req.params.householdId);
  
  const newCategory = {
    category_id: getNextId(categories),
    household_id: householdId,
    name,
    sort_order: sort_order || categories.length + 1
  };
  
  categories.push(newCategory);
  res.status(201).json(newCategory);
});
 
// PUT /api/categories/:id
app.put('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find(c => c.category_id === id);
  
  if (!category) {
    return res.status(404).json({ message: 'Kategorie nicht gefunden' });
  }
  
  category.name = req.body.name || category.name;
  category.sort_order = req.body.sort_order !== undefined ? req.body.sort_order : category.sort_order;
  
  res.json(category);
});
 
// DELETE /api/categories/:id
app.delete('/api/categories/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = categories.findIndex(c => c.category_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Kategorie nicht gefunden' });
  }
  
  categories.splice(index, 1);
  res.json({ message: 'Kategorie gelöscht' });
});
 
// ============================================
// Entpunkte: STANDORTE
// ============================================
 
// GET /api/households/:householdId/locations
app.get('/api/households/:householdId/locations', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const householdLocations = locations
    .filter(l => l.household_id === householdId)
    .sort((a, b) => a.sort_order - b.sort_order);
  res.json(householdLocations);
});
 
// POST /api/households/:householdId/locations
app.post('/api/households/:householdId/locations', (req, res) => {
  const { name, description, sort_order } = req.body;
  const householdId = parseInt(req.params.householdId);
  
  const newLocation = {
    location_id: getNextId(locations),
    household_id: householdId,
    name,
    description: description || null,
    sort_order: sort_order || locations.length + 1
  };
  
  locations.push(newLocation);
  res.status(201).json(newLocation);
});
 
// PUT /api/locations/:id
app.put('/api/locations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const location = locations.find(l => l.location_id === id);
  
  if (!location) {
    return res.status(404).json({ message: 'Standort nicht gefunden' });
  }
  
  location.name = req.body.name || location.name;
  location.description = req.body.description !== undefined ? req.body.description : location.description;
  location.sort_order = req.body.sort_order !== undefined ? req.body.sort_order : location.sort_order;
  
  res.json(location);
});
 
// DELETE /api/locations/:id
app.delete('/api/locations/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = locations.findIndex(l => l.location_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Standort nicht gefunden' });
  }
  
  locations.splice(index, 1);
  res.json({ message: 'Standort gelöscht' });
});
 
// ============================================
// Endpunkte: PRODUKTE
// ============================================
 
// GET /api/households/:householdId/products (mit Filter & Sortierung)
app.get('/api/households/:householdId/products', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const { sort, location, category } = req.query;
  
  let householdProducts = products.filter(p => p.household_id === householdId);
  
  // Filter nach Standort
  if (location) {
    householdProducts = householdProducts.filter(p => p.location_id === parseInt(location));
  }
  
  // Filter nach Kategorie
  if (category) {
    householdProducts = householdProducts.filter(p => p.category_id === parseInt(category));
  }
  
  // Sortierung
  if (sort === 'expiration') {
    householdProducts.sort((a, b) => new Date(a.expiration_date) - new Date(b.expiration_date));
  } else if (sort === 'quantity') {
    householdProducts.sort((a, b) => (a.quantity / a.min_quantity) - (b.quantity / b.min_quantity));
  } else if (sort === 'name') {
    householdProducts.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  res.json(householdProducts);
});
 
// GET /api/products/:id - Einzelnes Produkt
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.product_id === parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  res.json(product);
});
 
// POST /api/households/:householdId/products - Neues Produkt
app.post('/api/households/:householdId/products', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const { name, category_id, location_id, quantity, min_quantity, unit, expiration_date } = req.body;
  
  const newProduct = {
    product_id: getNextId(products),
    household_id: householdId,
    name,
    category_id,
    location_id,
    quantity,
    min_quantity,
    unit,
    expiration_date: expiration_date ? new Date(expiration_date) : null,
    created_at: new Date(),
    updated_at: new Date()
  };
  
  products.push(newProduct);
  
  // Prüfen ob direkt auf Einkaufsliste
  if (quantity < min_quantity) {
    shoppingList.push({
      shopping_id: getNextId(shoppingList),
      household_id: householdId,
      product_id: newProduct.product_id,
      needed_quantity: min_quantity - quantity,
      checked: false,
      created_at: new Date()
    });
  }
  
  res.status(201).json(newProduct);
});
 
// PUT /api/products/:id - Produkt bearbeiten
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.product_id === id);
  
  if (!product) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  // Alle Felder aktualisieren
  Object.keys(req.body).forEach(key => {
    if (key === 'expiration_date' && req.body[key]) {
      product[key] = new Date(req.body[key]);
    } else if (req.body[key] !== undefined) {
      product[key] = req.body[key];
    }
  });
  
  product.updated_at = new Date();
  res.json(product);
});
 
// DELETE /api/products/:id
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = products.findIndex(p => p.product_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  products.splice(index, 1);
  res.json({ message: 'Produkt gelöscht' });
});
 
// POST /api/products/:id/consume - Produkt verbrauchen
app.post('/api/products/:id/consume', (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;
  const product = products.find(p => p.product_id === id);
  
  if (!product) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  // Menge reduzieren
  product.quantity -= amount;
  product.updated_at = new Date();
  
  // Verlauf hinzufügen
  history.push({
    history_id: getNextId(history),
    product_id: id,
    user_id: 1, // später echter User
    change_amount: -amount,
    status: 'verbraucht',
    created_at: new Date()
  });
  
  // Prüfen ob auf Einkaufsliste
  if (product.quantity < product.min_quantity) {
    const existingItem = shoppingList.find(item => item.product_id === id && !item.checked);
    if (!existingItem) {
      shoppingList.push({
        shopping_id: getNextId(shoppingList),
        household_id: product.household_id,
        product_id: id,
        needed_quantity: product.min_quantity - product.quantity,
        checked: false,
        created_at: new Date()
      });
    }
  }
  
  res.json({ message: 'Produkt verbraucht', product });
});
 
// POST /api/products/:id/restock - Produkt auffüllen
app.post('/api/products/:id/restock', (req, res) => {
  const id = parseInt(req.params.id);
  const { amount } = req.body;
  const product = products.find(p => p.product_id === id);
  
  if (!product) {
    return res.status(404).json({ message: 'Produkt nicht gefunden' });
  }
  
  // Menge erhöhen
  product.quantity += amount;
  product.updated_at = new Date();
  
  // Verlauf hinzufügen
  history.push({
    history_id: getNextId(history),
    product_id: id,
    user_id: 1, // später echter User
    change_amount: amount,
    status: 'aufgefüllt',
    created_at: new Date()
  });
  
  res.json({ message: 'Produkt aufgefüllt', product });
});
 
// ============================================
// Endpunkte: EINKAUFSLISTE
// ============================================
 
// GET /api/households/:householdId/shopping-list
app.get('/api/households/:householdId/shopping-list', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  
  // Einkaufsliste mit Produktdetails anreichern
  const enrichedList = shoppingList
    .filter(item => item.household_id === householdId)
    .map(item => {
      const product = products.find(p => p.product_id === item.product_id);
      const category = categories.find(c => c.category_id === product?.category_id);
      return {
        ...item,
        product_name: product?.name,
        unit: product?.unit,
        category_name: category?.name,
        category_sort_order: category?.sort_order
      };
    })
    .sort((a, b) => a.category_sort_order - b.category_sort_order);
  
  res.json(enrichedList);
});
 
// POST /api/households/:householdId/shopping-list
app.post('/api/households/:householdId/shopping-list', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const { product_id, needed_quantity } = req.body;
  
  const newItem = {
    shopping_id: getNextId(shoppingList),
    household_id: householdId,
    product_id,
    needed_quantity,
    checked: false,
    created_at: new Date()
  };
  
  shoppingList.push(newItem);
  res.status(201).json(newItem);
});
 
// PUT /api/shopping-list/:id - Als gekauft markieren
app.put('/api/shopping-list/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const item = shoppingList.find(i => i.shopping_id === id);
  
  if (!item) {
    return res.status(404).json({ message: 'Eintrag nicht gefunden' });
  }
  
  item.checked = req.body.checked !== undefined ? req.body.checked : true;
  item.purchased_at = item.checked ? new Date() : null;
  
  res.json(item);
});
 
// DELETE /api/shopping-list/:id
app.delete('/api/shopping-list/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = shoppingList.findIndex(i => i.shopping_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Eintrag nicht gefunden' });
  }
  
  shoppingList.splice(index, 1);
  res.json({ message: 'Eintrag gelöscht' });
});
 
// ============================================
// Endpunkte: VERLAUF
// ============================================
 
// GET /api/products/:productId/history
app.get('/api/products/:productId/history', (req, res) => {
  const productId = parseInt(req.params.productId);
  const productHistory = history
    .filter(h => h.product_id === productId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Mit Benutzer-Namen anreichern
  const enrichedHistory = productHistory.map(h => {
    const user = users.find(u => u.user_id === h.user_id);
    return {
      ...h,
      username: user?.username
    };
  });
  
  res.json(enrichedHistory);
});
 
// GET /api/households/:householdId/history
app.get('/api/households/:householdId/history', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  
  // Alle Produkte des Haushalts finden
  const householdProductIds = products
    .filter(p => p.household_id === householdId)
    .map(p => p.product_id);
  
  // Verlauf dieser Produkte
  const householdHistory = history
    .filter(h => householdProductIds.includes(h.product_id))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  
  // Mit Details anreichern
  const enrichedHistory = householdHistory.map(h => {
    const user = users.find(u => u.user_id === h.user_id);
    const product = products.find(p => p.product_id === h.product_id);
    return {
      ...h,
      username: user?.username,
      product_name: product?.name
    };
  });
  
  res.json(enrichedHistory);
});
 
// ============================================
// Endpunkte: KOMMENTARE
// ============================================
 
// GET /api/households/:householdId/comments
app.get('/api/households/:householdId/comments', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const householdComments = comments
    .filter(c => c.household_id === householdId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  // Mit Benutzer-Namen und Produkt-Namen anreichern
  const enrichedComments = householdComments.map(c => {
    const user = users.find(u => u.user_id === c.user_id);
    const product = c.product_id ? products.find(p => p.product_id === c.product_id) : null;
    return {
      ...c,
      username: user?.username,
      product_name: product?.name
    };
  });
  
  res.json(enrichedComments);
});
 
// GET /api/products/:productId/comments
app.get('/api/products/:productId/comments', (req, res) => {
  const productId = parseInt(req.params.productId);
  const productComments = comments
    .filter(c => c.product_id === productId)
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  
  // Mit Benutzer-Namen anreichern
  const enrichedComments = productComments.map(c => {
    const user = users.find(u => u.user_id === c.user_id);
    return {
      ...c,
      username: user?.username
    };
  });
  
  res.json(enrichedComments);
});
 
// POST /api/households/:householdId/comments
app.post('/api/households/:householdId/comments', (req, res) => {
  const householdId = parseInt(req.params.householdId);
  const { message, product_id } = req.body;
  
  const newComment = {
    comment_id: getNextId(comments),
    household_id: householdId,
    user_id: 1, // später echter User
    product_id: product_id || null,
    message,
    created_at: new Date()
  };
  
  comments.push(newComment);
  
  // Mit Username anreichern
  const user = users.find(u => u.user_id === newComment.user_id);
  res.status(201).json({ ...newComment, username: user?.username });
});
 
// DELETE /api/comments/:id
app.delete('/api/comments/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = comments.findIndex(c => c.comment_id === id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Kommentar nicht gefunden' });
  }
  
  comments.splice(index, 1);
  res.json({ message: 'Kommentar gelöscht' });
});
 
// ============================================
// TEST-ROUTE
// ============================================
 
app.get('/', (req, res) => {
  res.json({ 
    message: 'SmartStock Backend läuft!',
    version: '1.0',
    endpoints: {
      auth: '/api/auth/*',
      households: '/api/households/*',
      categories: '/api/categories/*',
      locations: '/api/locations/*',
      products: '/api/products/*',
      shoppingList: '/api/shopping-list/*',
      history: '/api/*/history',
      comments: '/api/*/comments'
    }
  });
});
 
// ============================================
// SERVER STARTEN
// ============================================
 
app.listen(PORT, () => {
  console.log(`🚀 SmartStock Backend läuft!`);
});