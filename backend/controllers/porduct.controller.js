import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
	try {
		const keyword = req.query.keyword
			? { name: { $regex: req.query.keyword, $options: "i" } }
			: {};

		const category = req.query.category ? { category: req.query.category } : {};

		const minPrice = req.query.minPrice ? Number(req.query.minPrice) : 0;
		const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : 100000;

		const priceRange = { price: { $gte: minPrice, $lte: maxPrice } };

		const products = await Product.find({
			...keyword,
			...category,
			...priceRange,
		});

		res.json(products);
	} catch (error) {
		res.status(500).json({ message: "Ürünler getirilemedi", error });
	}
};

export const getProductById = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			res.json(product);
		} else {
			res.status(404).json({ message: "Product not found." });
		}
	} catch (err) {
		res.status(500).json({ message: "Server error." });
	}
};

export const createProduct = async (req, res) => {
	const { name, description, price, image, countInStock } = req.body;

	try {
		const product = new Product({
			name,
			description,
			price,
			image,
			countInStock,
		});

		const createdProduct = await product.save();
		res.status(201).json(createdProduct);
	} catch (error) {
		res.status(500).json({ message: "Failed to create product" });
	}
};

export const updateProduct = async (req, res) => {
	const { name, description, price, image, countInStock } = req.body;

	try {
		const product = await Product.findById(req.params.id);
		if (product) {
			product.name = name || product.name;
			product.description = description || product.description;
			product.price = price || product.price;
			product.image = image || product.image;
			product.countInStock = countInStock || product.countInStock;

			const updatedProduct = await product.save();
			res.json(updatedProduct);
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Failed to update product" });
	}
};

export const deleteProduct = async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (product) {
			await product.remove();
			res.json({ message: "Product removed" });
		} else {
			res.status(404).json({ message: "Product not found" });
		}
	} catch (error) {
		res.status(500).json({ message: "Failed to delete product" });
	}
};

export const getCategories = async (req, res) => {
	try {
		const categories = await Product.distinct("category");
		res.json(categories);
	} catch (error) {
		res.status(500).json({ message: "Kategoriler getirilemedi", error });
	}
};
