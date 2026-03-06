import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, "users.json");
const PROJECTS_FILE = path.join(__dirname, "projects.json");
const PRODUCTS_FILE = path.join(__dirname, "products.json");
const ORDERS_FILE = path.join(__dirname, "orders.json");
const MESSAGES_FILE = path.join(__dirname, "messages.json");
const INVESTMENTS_FILE = path.join(__dirname, "investments.json");
const TRANSACTIONS_FILE = path.join(__dirname, "transactions.json");
const CATEGORIES_FILE = path.join(__dirname, "categories.json");

async function getData(file: string) {
  try {
    const data = await fs.readFile(file, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveData(file: string, data: any[]) {
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function getUsers() {
  return getData(USERS_FILE);
}

async function saveUsers(users: any[]) {
  return saveData(USERS_FILE, users);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  const broadcast = (data: any) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  app.use(express.json());

  // API routes
  app.get("/api/users", async (req, res) => {
    const users = await getUsers();
    const safeUsers = users.map(({ password, ...u }: any) => u);
    res.json(safeUsers);
  });

  app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const users = await getUsers();
    const index = users.findIndex((u: any) => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...req.body, id };
      await saveUsers(users);
      const { password: _, ...safeUser } = users[index];
      broadcast({ type: 'user:updated', user: safeUser });
      res.json({ success: true, user: safeUser });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    let users = await getUsers();
    users = users.filter((u: any) => u.id !== id);
    await saveUsers(users);
    broadcast({ type: 'user:deleted', id });
    res.json({ success: true });
  });

  app.get("/api/projects", async (req, res) => {
    const projects = await getData(PROJECTS_FILE);
    res.json(projects);
  });

  app.post("/api/projects", async (req, res) => {
    const projects = await getData(PROJECTS_FILE);
    const newProject = { ...req.body, id: Date.now().toString() };
    projects.push(newProject);
    await saveData(PROJECTS_FILE, projects);
    broadcast({ type: 'project:created', project: newProject });
    res.json({ success: true, project: newProject });
  });

  app.put("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    const projects = await getData(PROJECTS_FILE);
    const index = projects.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...req.body, id };
      await saveData(PROJECTS_FILE, projects);
      broadcast({ type: 'project:updated', project: projects[index] });
      res.json({ success: true, project: projects[index] });
    } else {
      res.status(404).json({ success: false, message: "Project not found" });
    }
  });

  app.delete("/api/projects/:id", async (req, res) => {
    const { id } = req.params;
    let projects = await getData(PROJECTS_FILE);
    projects = projects.filter((p: any) => p.id !== id);
    await saveData(PROJECTS_FILE, projects);
    broadcast({ type: 'project:deleted', id });
    res.json({ success: true });
  });

  app.get("/api/products", async (req, res) => {
    const products = await getData(PRODUCTS_FILE);
    res.json(products);
  });

  app.post("/api/products", async (req, res) => {
    const products = await getData(PRODUCTS_FILE);
    const newProduct = { ...req.body, id: Date.now().toString() };
    products.push(newProduct);
    await saveData(PRODUCTS_FILE, products);
    broadcast({ type: 'product:created', product: newProduct });
    res.json({ success: true, product: newProduct });
  });

  app.put("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    const products = await getData(PRODUCTS_FILE);
    const index = products.findIndex((p: any) => p.id === id);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body, id };
      await saveData(PRODUCTS_FILE, products);
      broadcast({ type: 'product:updated', product: products[index] });
      res.json({ success: true, product: products[index] });
    } else {
      res.status(404).json({ success: false, message: "Product not found" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    let products = await getData(PRODUCTS_FILE);
    products = products.filter((p: any) => p.id !== id);
    await saveData(PRODUCTS_FILE, products);
    broadcast({ type: 'product:deleted', id });
    res.json({ success: true });
  });

  app.get("/api/orders", async (req, res) => {
    const orders = await getData(ORDERS_FILE);
    res.json(orders);
  });

  app.get("/api/messages", async (req, res) => {
    const messages = await getData(MESSAGES_FILE);
    res.json(messages);
  });

  app.get("/api/investments", async (req, res) => {
    const investments = await getData(INVESTMENTS_FILE);
    res.json(investments);
  });

  app.get("/api/transactions", async (req, res) => {
    const transactions = await getData(TRANSACTIONS_FILE);
    res.json(transactions);
  });

  app.get("/api/categories", async (req, res) => {
    const categories = await getData(CATEGORIES_FILE);
    res.json(categories);
  });

  app.post("/api/categories", async (req, res) => {
    const categories = await getData(CATEGORIES_FILE);
    const newCategory = { ...req.body, id: Date.now().toString() };
    categories.push(newCategory);
    await saveData(CATEGORIES_FILE, categories);
    broadcast({ type: 'category:created', category: newCategory });
    res.json({ success: true, category: newCategory });
  });

  app.put("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    const categories = await getData(CATEGORIES_FILE);
    const index = categories.findIndex((c: any) => c.id === id);
    if (index !== -1) {
      categories[index] = { ...categories[index], ...req.body, id };
      await saveData(CATEGORIES_FILE, categories);
      broadcast({ type: 'category:updated', category: categories[index] });
      res.json({ success: true, category: categories[index] });
    } else {
      res.status(404).json({ success: false, message: "Category not found" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    const { id } = req.params;
    let categories = await getData(CATEGORIES_FILE);
    categories = categories.filter((c: any) => c.id !== id);
    await saveData(CATEGORIES_FILE, categories);
    broadcast({ type: 'category:deleted', id });
    res.json({ success: true });
  });

  app.post("/api/transactions", async (req, res) => {
    const transactions = await getData(TRANSACTIONS_FILE);
    const newTx = { ...req.body, id: Date.now().toString() };
    transactions.push(newTx);
    await saveData(TRANSACTIONS_FILE, transactions);
    res.json({ success: true, transaction: newTx });
  });

  app.post("/api/invest", async (req, res) => {
    const { projectId, investorId, amount, projectName, category, expectedReturn, payoutDate } = req.body;
    
    // 1. Update Project raisedAmount
    const projects = await getData(PROJECTS_FILE);
    const projectIndex = projects.findIndex((p: any) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex].raisedAmount = (projects[projectIndex].raisedAmount || 0) + Number(amount);
      projects[projectIndex].investorsCount = (projects[projectIndex].investorsCount || 0) + 1;
      await saveData(PROJECTS_FILE, projects);
    }

    // 2. Create Investment Record
    const investments = await getData(INVESTMENTS_FILE);
    const newInvestment = {
      id: `inv-${Date.now()}`,
      investorId,
      projectId,
      projectName,
      amount: Number(amount),
      status: "Active",
      expectedReturn,
      payoutDate,
      date: new Date().toISOString().split('T')[0],
      category
    };
    investments.push(newInvestment);
    await saveData(INVESTMENTS_FILE, investments);

    // 3. Create Transaction Record
    const transactions = await getData(TRANSACTIONS_FILE);
    const newTx = {
      id: `tx-${Date.now()}`,
      userId: investorId,
      type: "Investment",
      amount: -Number(amount),
      description: `Investment in ${projectName}`,
      date: new Date().toISOString()
    };
    transactions.push(newTx);
    await saveData(TRANSACTIONS_FILE, transactions);

    res.json({ success: true, investment: newInvestment });
  });

  app.post("/api/register", async (req, res) => {
    const { email, password, name, role, ...extraFields } = req.body;
    const users = await getUsers();
    
    if (users.find((u: any) => u.email === email)) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role,
      ...extraFields
    };

    users.push(newUser);
    await saveUsers(users);
    broadcast({ type: 'user:created', user: newUser });

    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
  });

  app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    const users = await getUsers();
    const user = users.find((u: any) => u.email === email && u.password === password);

    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password" });
    }
  });

  app.post("/api/update-profile", async (req, res) => {
    const { userId, ...updateData } = req.body;
    const users = await getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updateData };
      await saveUsers(users);
      const { password: _, ...userWithoutPassword } = users[userIndex];
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });

  app.post("/api/change-password", async (req, res) => {
    const { userId, currentPassword, newPassword } = req.body;
    const users = await getUsers();
    const userIndex = users.findIndex((u: any) => u.id === userId);

    if (userIndex !== -1) {
      if (users[userIndex].password === currentPassword) {
        users[userIndex].password = newPassword;
        await saveUsers(users);
        res.json({ success: true, message: "Password updated successfully" });
      } else {
        res.status(400).json({ success: false, message: "Incorrect current password" });
      }
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, message } = req.body;
    console.log("Contact form submission:", { name, email, message });
    // In a real app, you'd send an email here.
    res.json({ success: true, message: "Message received! We will get back to you soon." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
