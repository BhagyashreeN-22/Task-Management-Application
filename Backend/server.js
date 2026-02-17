import express from "express";
import dotenv from "dotenv";
import db from "./config/schema.js";
import { initDB } from "./config/tables.js";
import user_router from "./router/userRoutes.js";
import task_router from "./router/taskRoutes.js";
import cors from "cors"; 

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: "http://localhost:5173", // Vite default port
    credentials: true
}));

app.use("/users", user_router);
app.use("/tasks", task_router);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.query("SELECT 1");
        console.log("Database connected ✅");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} 🚀`);
        });

    } catch (error) {
        console.error("Database connection failed ❌");
        console.error(error.message);
        process.exit(1);
    }
};

startServer();
