import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import authRoutes from "./routes/auth.js";

import ordersRoutes from "./routes/orders.js";
import listingsRoutes from "./routes/listings.js";
import productsRoutes from "./routes/products.js";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ STATIC FOLDER
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ MULTER CONFIG
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/products", productsRoutes);


// ✅ IMAGE UPLOAD API
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({
    image_url: `http://localhost:4000/uploads/${req.file.filename}`
  });
});

// ✅ SERVER
const PORT = 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});