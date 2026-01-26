import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import { authenticate } from "./middlewares/auth.middleware";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
	res.status(200).json({
		message: "SportOn API is running.",
	});
});

app.get("/test-middleware", authenticate, (req, res) => {
	res.status(200).json({
		message: "Authenticated successfully. JWT token is valid.",
	});
});

export default app;
