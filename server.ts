import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("hereditas.db");

// Initialize database
db.exec(`
  DROP TABLE IF EXISTS tasks;
  DROP TABLE IF EXISTS projects;
  
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    jurisdiction TEXT,
    status TEXT DEFAULT 'onboarding',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    workstream TEXT NOT NULL,
    executor TEXT NOT NULL,
    executor_name TEXT,
    connection TEXT,
    FOREIGN KEY(project_id) REFERENCES projects(id)
  );
`);

async function startServer() {
  const app = express();
  app.use(express.json());

  const PORT = 3000;

  // API Routes
  app.get("/api/projects", (req, res) => {
    const projects = db.prepare("SELECT * FROM projects").all();
    res.json(projects);
  });

  app.post("/api/projects", (req, res) => {
    const { name, jurisdiction } = req.body;
    const info = db.prepare("INSERT INTO projects (name, jurisdiction) VALUES (?, ?)").run(name, jurisdiction);
    
    // Add default tasks
    const projectId = info.lastInsertRowid;
    const defaultTasks = [
      { title: "Apostille Death Certificate", workstream: "legal", executor: "professional", executor_name: "Lawyer Costoya", connection: "lawyers", status: "active" },
      { title: "Calculate Estimated Capital Gains", workstream: "admin", executor: "ai", executor_name: "Inherit AI", connection: "dashboard", status: "pending" },
      { title: "Syndicate to 5 Local Portals", workstream: "market", executor: "professional", executor_name: "Local Agent", connection: "listings", status: "pending" },
      { title: "Property Appraisal", workstream: "market", executor: "professional", executor_name: "Appraiser", connection: "dashboard", status: "pending" },
      { title: "Tax ID (NIE/Fiscal Code) Application", workstream: "admin", executor: "user", executor_name: "You", connection: "dashboard", status: "pending" }
    ];
    
    const insertTask = db.prepare("INSERT INTO tasks (project_id, title, workstream, executor, executor_name, connection, status) VALUES (?, ?, ?, ?, ?, ?, ?)");
    for (const task of defaultTasks) {
      insertTask.run(projectId, task.title, task.workstream, task.executor, task.executor_name, task.connection, task.status);
    }

    res.json({ id: projectId });
  });

  app.get("/api/projects/:id/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ?").all(req.params.id);
    // Map snake_case to camelCase for frontend
    const mappedTasks = tasks.map((t: any) => ({
      id: t.id,
      project_id: t.project_id,
      title: t.title,
      status: t.status,
      workstream: t.workstream,
      executor: t.executor,
      executorName: t.executor_name,
      connection: t.connection
    }));
    res.json(mappedTasks);
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE tasks SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.post("/api/search/tavily", async (req, res) => {
    const { query } = req.body;
    const apiKey = process.env.TAVILY_API_KEY || "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";
    
    try {
      const response = await fetch("https://api.tavily.com/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: apiKey,
          query: query,
          search_depth: "advanced",
          include_answer: true,
          include_images: false,
          max_results: 5,
        }),
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Tavily search error:", error);
      res.status(500).json({ error: "Failed to perform Tavily search" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
