import { Request, Response } from "express";
import Product from "../models/product.model";
import Category from "../models/category.model";

export const createProduct = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const productData = req.body;
		if (req.file) {
			productData.imageUrl = req.file.path;
		}

		const product = new Product(productData);
		await product.save();

		res.status(201).json(product);
	} catch (error) {
		res.status(500).json({
			message: "Failed to create product:",
			error,
		});
	}
};

export const getProducts = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const products = await Product.find()
			.populate("category")
			.sort({ createdAt: -1 });

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve products:",
			error,
		});
	}
};

export const searchProduct = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const { q } = req.query;

		if (!q || typeof q !== "string" || q.trim().length === 0) {
			res.status(400).json({
				message: "Query parameter 'q' is required",
			});
			return;
		}

		const escapeRegex = (str: string) =>
			str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const searchQuery = escapeRegex(q.trim());

		const matchingCategories = await Category.find({
			name: { $regex: searchQuery, $options: "i" },
		})
			.select("_id")
			.lean();

		const categoryIds = matchingCategories.map((cat) => cat._id);

		const products = await Product.find({
			$or: [
				{ name: { $regex: searchQuery, $options: "i" } },
				{ category: { $in: categoryIds } },
			],
		})
			.select("_id name price imageUrl category")
			.populate("category", "name")
			.sort({ createdAt: -1 })
			.lean();

		res.status(200).json(products);
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve products:",
			error,
		});
	}
};

export const getProductById = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const product = await Product.findById(req.params.id).populate("category");
		if (!product) {
			res.status(404).json({ message: "Product not found." });
			return;
		}

		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve product by ID:",
			error,
		});
	}
};

export const updateProduct = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const productData = req.body;
		if (req.file) {
			productData.imageUrl = req.file.path;
		}

		const product = await Product.findByIdAndUpdate(
			req.params.id,
			productData,
			{ new: true },
		);

		if (!product) {
			res.status(404).json({ message: "Product not found." });
			return;
		}

		res.status(200).json(product);
	} catch (error) {
		res.status(500).json({
			message: "Failed to update product:",
			error,
		});
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			res.status(404).json({ message: "Product not found." });
			return;
		}

		res.status(200).json({
			message: "Product deleted successfully.",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete product:",
			error,
		});
	}
};
