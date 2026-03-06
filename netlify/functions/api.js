import express from "express";
import serverless from "serverless-http";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(express.json());

const DATA_FILES = {
  users: "users.json",
  projects: "projects.json",
  products: "products.json",
  orders: "orders.json",
  messages: "messages.json",
  investments: "investments.json",
  transactions: "transactions.json",
  categories: "categories.json",
};

const state = {
  initialized: false,
  users: [],
  projects: [],
  products: [],
  orders: [],
  messages: [],
  investments: [],
  transactions: [],
  categories: [],
};

const withBasePath = (name) => path.join(process.cwd(), name);

async function readJson(filename) {
  try {
    const raw = await fs.readFile(withBasePath(filename), "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function initState() {
  if (state.initialized) {
    return;
  }

  const [
    users,
    projects,
    products,
    orders,
    messages,
    investments,
    transactions,
    categories,
  ] = await Promise.all([
    readJson(DATA_FILES.users),
    readJson(DATA_FILES.projects),
    readJson(DATA_FILES.products),
    readJson(DATA_FILES.orders),
    readJson(DATA_FILES.messages),
    readJson(DATA_FILES.investments),
    readJson(DATA_FILES.transactions),
    readJson(DATA_FILES.categories),
  ]);

  state.users = users;
  state.projects = projects;
  state.products = products;
  state.orders = orders;
  state.messages = messages;
  state.investments = investments;
  state.transactions = transactions;
  state.categories = categories;
  state.initialized = true;
}

app.use(async (_req, _res, next) => {
  await initState();
  next();
});

const safeUser = ({ password, ...user }) => user;

app.get("/api/users", (_req, res) => {
  res.json(state.users.map(safeUser));
});

app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const index = state.users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  state.users[index] = { ...state.users[index], ...req.body, id };
  return res.json({ success: true, user: safeUser(state.users[index]) });
});

app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;
  state.users = state.users.filter((u) => u.id !== id);
  res.json({ success: true });
});

app.get("/api/projects", (_req, res) => {
  res.json(state.projects);
});

app.post("/api/projects", (req, res) => {
  const newProject = { ...req.body, id: Date.now().toString() };
  state.projects.push(newProject);
  res.json({ success: true, project: newProject });
});

app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const index = state.projects.findIndex((p) => p.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Project not found" });
  }

  state.projects[index] = { ...state.projects[index], ...req.body, id };
  return res.json({ success: true, project: state.projects[index] });
});

app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  state.projects = state.projects.filter((p) => p.id !== id);
  res.json({ success: true });
});

app.get("/api/products", (_req, res) => {
  res.json(state.products);
});

app.post("/api/products", (req, res) => {
  const newProduct = { ...req.body, id: Date.now().toString() };
  state.products.push(newProduct);
  res.json({ success: true, product: newProduct });
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const index = state.products.findIndex((p) => p.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  state.products[index] = { ...state.products[index], ...req.body, id };
  return res.json({ success: true, product: state.products[index] });
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  state.products = state.products.filter((p) => p.id !== id);
  res.json({ success: true });
});

app.get("/api/orders", (_req, res) => {
  res.json(state.orders);
});

app.get("/api/messages", (_req, res) => {
  res.json(state.messages);
});

app.get("/api/investments", (_req, res) => {
  res.json(state.investments);
});

app.get("/api/transactions", (_req, res) => {
  res.json(state.transactions);
});

app.post("/api/transactions", (req, res) => {
  const newTx = { ...req.body, id: Date.now().toString() };
  state.transactions.push(newTx);
  res.json({ success: true, transaction: newTx });
});

app.get("/api/categories", (_req, res) => {
  res.json(state.categories);
});

app.post("/api/categories", (req, res) => {
  const newCategory = { ...req.body, id: Date.now().toString() };
  state.categories.push(newCategory);
  res.json({ success: true, category: newCategory });
});

app.put("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  const index = state.categories.findIndex((c) => c.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  state.categories[index] = { ...state.categories[index], ...req.body, id };
  return res.json({ success: true, category: state.categories[index] });
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  state.categories = state.categories.filter((c) => c.id !== id);
  res.json({ success: true });
});

app.post("/api/invest", (req, res) => {
  const {
    projectId,
    investorId,
    amount,
    projectName,
    category,
    expectedReturn,
    payoutDate,
  } = req.body;

  const projectIndex = state.projects.findIndex((p) => p.id === projectId);
  if (projectIndex !== -1) {
    const nextRaised =
      (state.projects[projectIndex].raisedAmount || 0) + Number(amount);
    const nextInvestors =
      (state.projects[projectIndex].investorsCount || 0) + 1;
    state.projects[projectIndex] = {
      ...state.projects[projectIndex],
      raisedAmount: nextRaised,
      investorsCount: nextInvestors,
    };
  }

  const newInvestment = {
    id: `inv-${Date.now()}`,
    investorId,
    projectId,
    projectName,
    amount: Number(amount),
    status: "Active",
    expectedReturn,
    payoutDate,
    date: new Date().toISOString().split("T")[0],
    category,
  };
  state.investments.push(newInvestment);

  const newTx = {
    id: `tx-${Date.now()}`,
    userId: investorId,
    type: "Investment",
    amount: -Number(amount),
    description: `Investment in ${projectName}`,
    date: new Date().toISOString(),
  };
  state.transactions.push(newTx);

  res.json({ success: true, investment: newInvestment });
});

app.post("/api/register", (req, res) => {
  const { email, password, name, role, ...extraFields } = req.body;

  if (state.users.find((u) => u.email === email)) {
    return res
      .status(400)
      .json({ success: false, message: "User already exists" });
  }

  const newUser = {
    id: Date.now().toString(),
    email,
    password,
    name,
    role,
    ...extraFields,
  };
  state.users.push(newUser);

  return res.json({ success: true, user: safeUser(newUser) });
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const user = state.users.find(
    (u) => u.email === email && u.password === password,
  );

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid email or password" });
  }

  return res.json({ success: true, user: safeUser(user) });
});

app.post("/api/update-profile", (req, res) => {
  const { userId, ...updateData } = req.body;
  const userIndex = state.users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  state.users[userIndex] = { ...state.users[userIndex], ...updateData };
  return res.json({ success: true, user: safeUser(state.users[userIndex]) });
});

app.post("/api/change-password", (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  const userIndex = state.users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (state.users[userIndex].password !== currentPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect current password" });
  }

  state.users[userIndex].password = newPassword;
  return res.json({ success: true, message: "Password updated successfully" });
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  console.log("Contact form submission:", { name, email, message });
  res.json({
    success: true,
    message: "Message received! We will get back to you soon.",
  });
});

export const handler = serverless(app);
