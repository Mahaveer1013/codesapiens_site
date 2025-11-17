# Codesapiens Management Website

A JavaScript-based management website for the Codesapiens project. This repository contains the source code for the management/admin interface used to manage users, projects, and other application data.

## Key Features

- Admin dashboard and management UI
- User and role management
- CRUD operations for core resources
- Authentication and authorization (implementation-dependent)
- Configurable via environment variables

## Tech Stack

- Language: Javascript
- Runtime / frameworks: React(19.1.1) & Tailwind CSS(v4)
- Package manager: npm

## Prerequisites

- Node.js (LTS recommended)
- npm
- supabase & cloudinary

## Installation & Local Setup

1. Clone the repository:

   git clone https://github.com/jayasurya261/Codesapiens_management_website.git
   cd Codesapiens_management_website

2. Install dependencies:

   npm install

3. Review package.json for available scripts (common scripts shown below):

   - npm run dev — Run the development server with hot reload
   - npm run build — Build the production bundle

4. Start the app:

   npm run dev

   Open your browser at http://localhost:5173  (the port specified by the app)

## Environment Variables / Configuration

Create a .env file in the project root (if the project uses dotenv or similar). Common variables you may need to set:

VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VERCEL_BLOB_TOKEN=
REACT_APP_TURNSTILE_SITE_KEY=
NODE_ENV=development


Do not commit .env files or secrets to version control. Add .env to .gitignore if not already present.

## Usage / Common Commands

- npm run dev — Start development server
- npm run build — Build assets for production

Check package.json for exact script names and details.

## Deployment Notes

- Frontend-only apps can be deployed to Netlify, Vercel, or GitHub Pages.
- Make sure environment variables are configured on the hosting platform.
- Build assets before deploying a static/frontend site (npm run build).

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repository
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit changes with clear messages
4. Push to your fork and open a pull request


## Troubleshooting

- If dependencies fail to install, try removing node_modules and reinstalling:
  rm -rf node_modules package-lock.json && npm install
- If the app fails to start, check environment variables and that any required backend services are running.


## Contact

For questions or issues, open an issue on the repository or contact the maintainers.

---
