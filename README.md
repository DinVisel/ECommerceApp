# ECommerceApp

## Setup

### Environment Variables

Create a `backend/.env` file with the following keys:

```
MONGO_URI=<your mongodb connection string>
PORT=<server port>
JWT_SECRET=<jwt signing secret>
```

### Install Dependencies

Run `npm install` inside both `backend` and `frontend` directories.

### Starting the Apps

Start the backend API:

```bash
cd backend
npm run dev
```

Start the React Native frontend:

```bash
cd ../frontend
npm start
```

### Seed the Database

To populate MongoDB with sample data run:

```bash
cd backend
npm run seed
```

Pass the `-d` argument to remove seed data instead.
