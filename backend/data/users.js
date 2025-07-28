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
	{
		name: "admin1",
		email: "admin1@example.com",
		password: bcrypt.hashSync("123123", 10),
		role: "admin",
	},
];

export default users;
