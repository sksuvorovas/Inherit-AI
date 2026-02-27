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
    column TEXT NOT NULL,
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
      { title: "Tax Identification Number (NIE/Fiscal Code)", column: "todo" },
      { title: "Property Appraisal", column: "todo" },
      { title: "Listing Status", column: "todo" },
      { title: "Offer Management", column: "todo" }
    ];
    
    const insertTask = db.prepare("INSERT INTO tasks (project_id, title, column) VALUES (?, ?, ?)");
    for (const task of defaultTasks) {
      insertTask.run(projectId, task.title, task.column);
    }

    res.json({ id: projectId });
  });

  app.get("/api/projects/:id/tasks", (req, res) => {
    const tasks = db.prepare("SELECT * FROM tasks WHERE project_id = ?").all(req.params.id);
    res.json(tasks);
  });

  app.patch("/api/tasks/:id", (req, res) => {
    const { column } = req.body;
    db.prepare("UPDATE tasks SET column = ? WHERE id = ?").run(column, req.params.id);
    res.json({ success: true });
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
