import { Request, Response } from "express";
import Category from "../models/category.model";

export const createCategory = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const categoryData = req.body;

		if (req.file) {
			categoryData.imageUrl = req.file.path;
		}

		const category = new Category(categoryData);
		await category.save();

		res.status(201).json(category);
	} catch (error) {
		res.status(500).json({
			message: "Failed to create category.",
			error,
		});
	}
};

export const getCategories = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const categories = await Category.find().sort({ createdAt: -1 });

		res.status(200).json(categories);
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve categories.",
			error,
		});
	}
};

export const getCategoryById = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const category = await Category.findById(req.params.id);

		if (!category) {
			res.status(404).json({ message: "Category not found" });
			return;
		}

		res.status(200).json(category);
	} catch (error) {
		res.status(500).json({
			message: "Failed to retrieve category by ID.",
			error,
		});
	}
};

export const updateCategory = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const categoryData = req.body;

		if (req.file) {
			categoryData.imageUrl = req.file.path;
		}

		const category = await Category.findByIdAndUpdate(
			req.params.id,
			categoryData,
			{ new: true },
		);

		if (!category) {
			res.status(404).json({ message: "Category not found." });
			return;
		}

		res.status(200).json(category);
	} catch (error) {
		res.status(500).json({
			message: "Failed to update category.",
			error,
		});
	}
};

export const deleteCategory = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		const category = await Category.findByIdAndDelete(req.params.id);

		if (!category) {
			res.status(404).json({ message: "Category not found." });
			return;
		}

		res.status(200).json({
			message: "Category deleted successfully.",
		});
	} catch (error) {
		res.status(500).json({
			message: "Failed to delete category.",
			error,
		});
	}
};
