import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Security Headers
  /*
  app.use(helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "default-src": ["'self'", "https://*.google.com", "https://*.googleapis.com", "https://*.firebaseio.com"],
        "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://apis.google.com", "https://*.google.com"],
        "connect-src": ["'self'", "https://firestore.googleapis.com", "https://identitytoolkit.googleapis.com", "https://*.firebaseio.com", "https://*.googleapis.com", "https://*.google.com", "wss://*.run.app"],
        "img-src": ["'self'", "data:", "blob:", "https://images.unsplash.com", "https://*.google.com", "https://*.googleusercontent.com", "https://grainy-gradients.vercel.app"],
        "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://*.google.com"],
        "font-src": ["'self'", "https://fonts.gstatic.com", "data:", "https://*.google.com"],
        "frame-src": ["'self'", "https://*.firebaseapp.com", "https://*.google.com", "https://*.run.app", "https://*.aistudio.google"],
        "frame-ancestors": ["*"], // Crucial for AI Studio preview
        "object-src": ["'none'"],
        "upgrade-insecure-requests": [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    originAgentCluster: false,
    referrerPolicy: { policy: "no-referrer-when-downgrade" },
    hsts: process.env.NODE_ENV === "production" ? {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    } : false,
    frameguard: false, // Allow framing in development
    xContentTypeOptions: true,
    dnsPrefetchControl: { allow: true }
  }));
  */

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV || "development" });
  });

  // Permissions Policy
  app.use((req, res, next) => {
    res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
    next();
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from dist
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
