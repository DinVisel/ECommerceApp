import bcrypt from "bcryptjs";

const users = [
	{
		name: "Admin User",
		email: "admin@example.com",
		password: bcrypt.hashSync("123456", 10),
		role: "admin",
	},
	{
		name: "Seller User",
		email: "seller@example.com",
		password: bcrypt.hashSync("123456", 10),
		role: "seller",
	},
	{
		name: "Regular User",
		email: "user@example.com",
		password: bcrypt.hashSync("123456", 10),
		role: "user",
	},
];

export default users;
