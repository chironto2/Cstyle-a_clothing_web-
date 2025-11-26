Cstyle – A Modern E-Commerce Webstore for Fashion
Project Description

Cstyle is a modern, AI-powered clothing webstore built using Next.js, TypeScript, and MongoDB.
The platform features a sleek user interface, a fully functional admin dashboard, and smart features designed to deliver a smooth online shopping experience.

This project represents a complete fashion e-commerce solution—from product management to order handling—all built with clean architecture and scalable technologies.

Developer
Chironto Rudra Paul

Setup & Installation
Prerequisites

Node.js (v18+)

MongoDB
(Local or Cloud – Atlas)

Git

(Optional) Google Cloud SDK for AI features

1. Clone the Repository
   git clone https://github.com/chironto2/Cstyle-A_clothing_webstore.git
   cd Cstyle-A_clothing_webstore

2. Install Dependencies
   npm install

# or

yarn

3. Configure Environment Variables

Create a file named .env.local in the root directory and add:

MONGODB_URI=mongodb://localhost:27017/cstyle-db
JWT_SECRET=your_jwt_secret_here
GENKIT_API_KEY=your_google_genkit_api_key
GENKIT_PROJECT_ID=your_gcp_project_id

4. Start the Development Server
   npm run dev

# or

yarn dev

Now open your browser and go to:

👉 http://localhost:9002

5. (Optional) Enable Genkit AI Features

If you want to enable AI stylist features:

npx genkit dev

Ensure Genkit and Google Cloud Project credentials are properly set up.

Thank You for Using Cstyle!

For more details, visit the documentation or reach out anytime.

GitHub Repo:
🔗 https://github.com/chironto2/Cstyle-A_clothing_webstore
