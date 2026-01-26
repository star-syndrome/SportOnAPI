import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "SportOn123";

export interface AuthRequest extends Request {
	user?: any;
}

export const authenticate = (
	req: AuthRequest,
	res: Response,
	next: NextFunction,
): void => {
	const token = req.header("Authorization")?.replace("Bearer ", "");

	if (!token) {
		res.status(401).json({ message: "Authentication Required." });
		return;
	}

	try {
		const decode = jwt.verify(token, JWT_SECRET);
		req.user = decode;
		next();
	} catch (error) {
		res.status(401).json({ message: "Invalid Token." });
		return;
	}
};
