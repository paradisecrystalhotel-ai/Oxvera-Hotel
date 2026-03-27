import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/reservation", (req, res) => {
    const { name, email, phone, checkIn, checkOut, guests, roomType } = req.body;
    
    console.log("New Reservation Request:", { name, email, phone, checkIn, checkOut, guests, roomType });
    
    // Simulate processing
    setTimeout(() => {
      console.log(`Sending 'Processing' email with PDF to ${email}...`);
    }, 1000);

    // Simulate acceptance
    setTimeout(() => {
      console.log(`Sending 'Confirmed' email to ${email}...`);
    }, 5000);

    res.json({ 
      status: "processing", 
      message: "Reservation is under processing. A confirmation email with a PDF receipt has been sent to your inbox." 
    });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    console.log(`[CONTACT] New Submission from ${name} (${email}):`, { subject, message });
    
    // Simulate network delay
    setTimeout(() => {
      res.json({ status: "success", message: "Thank you for contacting us. We will get back to you shortly." });
    }, 1500);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
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
