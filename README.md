This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Microbank

A full-stack microbanking platform built with Next.js, Prisma, Supabase, and JWT.
Allows secure client registration, deposits, withdrawals, and blacklist management with a clean admin panel and Swagger API documentation.

🌐 Live Demo: [Microbank on Vercel](https://microbank-3dv1qa7jd-liquid-dres-projects.vercel.app/)
💻 Source Code: [GitHub Repo](https://github.com/liquid-dre/microbank.git)

### Getting Started

Admin credentials
```
email : admin@gmail.com
password: Password01
```

### Features

#### Client Service
	•	Register as a client (email, name, password)
	•	JWT login & authentication
	•	View current profile
	•	Admin can blacklist clients
	•	Blacklisted clients cannot transact

#### Banking Service
	•	Deposit & withdraw funds
	•	Prevent overdrafts
	•	Track account balance & transaction history
	•	All transactions are recorded
	•	Blacklisted clients are blocked from transactions

#### Frontend
	•	Client App: Register, login, dashboard, transactions
	•	Admin Panel: List clients & toggle blacklist
	•	Blacklist Error Handling


### Project Structure

```bash
microbank/
├── client/                     # Frontend (Next.js)
│   ├── pages/
│   └── components/
│
├── services/
│   ├── client-service/         # Registration, Login, JWT Auth, Blacklist
│   └── banking-service/        # Deposits, Withdrawals, Transactions
│
├── prisma/                     # Prisma schema & migrations
├── public/                     # Static assets
└── README.md                   # Project documentation
```

### Tech Stack

	•	Frontend: Next.js 14, React, Tailwind CSS (if used)
	•	Backend: Next.js API Routes
	•	Database: Supabase (PostgreSQL with Prisma)
	•	Authentication: JSON Web Tokens (JWT)
	•	API Docs: Swagger (available at /api/docs)

### Setup & Installation

1️⃣ Clone the Repository
```
    git clone https://github.com/liquid-dre/microbank.git
    cd microbank
```

2️⃣ Install Dependencies
```
    npm install
```

3️⃣ Setup Environment Variables
Generate JWT secret via Bash:
```
    openssl rand -base64 32
```

Create a .env file in the project root:
```
    DATABASE_URL="postgresql://<your-db-url>?pgbouncer=true&sslmode=require"
    DIRECT_URL="postgresql://<your-db-url>?sslmode=require"

    JWT_SECRET="<your-jwt-secret>"

    SUPABASE_SERVICE_ROLE_KEY="<your-service-role-key>"

    NEXT_PUBLIC_SUPABASE_URL="<your-supabase-url>"
    NEXT_PUBLIC_SUPABASE_ANON_KEY="<your-anon-key>"
```

4️⃣ Run Database Migrations
```
    npx prisma migrate dev
```

5️⃣ Run the App Locally
```
    npm run dev
```

Visit → [localhost](http://localhost:3001)

### API Documentation

Interactive Swagger docs:
```
    https://microbank-3dv1qa7jd-liquid-dres-projects.vercel.app/api/docs
```
Visit → [Swagger API Docs](https://microbank-3dv1qa7jd-liquid-dres-projects.vercel.app/api/docs) 

#### Example: Register Client
```
    POST /services/client-services/auth/register
    Content-Type: application/json

    {
    "name": "user",
    "email": "user@example.com",
    "password": "123456"
    }
```

### Assumptions & Limitations

	•	Works best on Google Chrome
	•	JWT authentication secures all endpoints
	•	Demo project → No email verification
	•	Blacklisting instantly blocks transactions

### Future Improvements

	•	Email verification & password reset
	•	Improved performance on other browsers

### Screenshots 

- Landing page
    ![alt text](image.png)
    ![alt text](image-1.png)
    ![alt text](image-2.png)

- Register page
    ![alt text](image-3.png)    

- Login page
    ![alt text](image-4.png)

- Admin dashboard page
    ![alt text](image-5.png)

- Edit profile page
    ![alt text](image-6.png)

- Client dashboard
    ![alt text](image-7.png)

    ![alt text](image-8.png)

    ![alt text](image-9.png)

    - Deposit page
    ![alt text](image-10.png)

    - Withdraw page (25% selected)
    ![alt text](image-11.png)

    - Withdrawal validation
    ![alt text](image-12.png)

- Blacklisted user dashboard
    ![alt text](image-13.png)
