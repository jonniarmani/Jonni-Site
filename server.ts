import express from "express";
import path from "path";
import helmet from "helmet";

async function startServer() {
  const app = express();
  const PORT = 3000;

  console.log("Starting server with process.env.NODE_ENV:", process.env.NODE_ENV);

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Security headers using Helmet
  app.use(
    helmet({
      contentSecurityPolicy: false, // Temporarily disable to check if it's the cause
      crossOriginEmbedderPolicy: false,
      frameguard: { action: "sameorigin" },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: "strict-origin-when-cross-origin" },
    })
  );

  // Custom headers
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    res.setHeader("Alt-Svc", 'h3=":443"; ma=86400');
    next();
  });

  // Custom X-Content-Type-Options: nosniff is already handled by helmet.noSniff() by default

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Express Error:", err);
    res.status(500).send("Internal Server Error");
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
