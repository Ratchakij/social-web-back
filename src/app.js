import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import multer from "multer";
import { fileURLToPath } from "url";
import { createPost } from "./controllers/post-controller.js";

/* IMPORT ROUTE */
import authRoutes from "./routes/auth-route.js";
import userRoutes from "./routes/user-route.js";
import postRoutes from "./routes/post-route.js";

/* IMPORT MIDDLEWARES */
import { authenticate } from "./middlewares/authenticate.js";
import notFoundMiddleware from "./middlewares/not-found.js";
import errorMiddleware from "./middlewares/error.js";

import User from "./models/User.js";
import Post from "./models/Post.js";
import { users, posts } from "./data/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* LOAD ENVIRONMENT VARIABLES USING dotenv */
dotenv.config();

const app = express();

/* CONFIGURATIONS */
app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

/* FILE STORAGE */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

/* ROUTES WITH FILES */
app.post("/auth", upload.single("picture"), authRoutes);
app.post("/posts", authenticate, upload.single("picture"), createPost);

/* ROUTES */
app.use("/auth", authRoutes);
app.use("/users", authenticate, userRoutes);
app.use("/posts", authenticate, postRoutes);

app.get("/", async function (req, res) {
  try {
    res.send("Express is working");
  } catch (err) {
    res.send(err);
  }
});

app.use(notFoundMiddleware);
app.use(errorMiddleware);

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 3000;
mongoose
  .connect(
    process.env.MONGO_URI
    // {
    //  useNewUrlParser: true,
    //  useUnifiedTopology: true,
    // }
  )
  .then(async () => {
    console.log("Connected to MongoDB");

    /* DROP EXISTING COLLECTIONS */
    // await mongoose.connection.db.dropDatabase();
    // console.log("Database dropped");

    /* ADD DATA */
    // User.insertMany(users);
    // Post.insertMany(posts);
    // console.log("Add Data to database ");

    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
  })
  .catch((err) => console.error("Error connecting to MongoDB:", err));
