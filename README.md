# Comic Vault

A modern, full-stack comic book collection tracker built with React, Node.js, and Supabase. Discover, track, and manage your comic book reading journey with an intuitive interface and powerful features.

![Comic Vault](./public/assets/ComicVault.png)

## ✨ Features

### 🔍 **Comic Discovery**

- Search thousands of comics via ComicVine API integration
- Detailed comic information including characters, creators, and storylines
- High-quality cover images and comprehensive metadata
- Publisher, year, and issue count information

### 📚 **Collection Management**

- Add comics to your personal collection
- Track reading status: Reading, Completed, Planned, Dropped
- Personal rating system (1-5 stars)
- Collection filtering and organization
- Reading progress tracking at the issue level

### 📊 **Progress Tracking**

- Individual issue read/unread status
- Visual progress indicators
- Reading date tracking
- Collection statistics and insights

### 🔐 **User Authentication**

- Secure authentication via Supabase Auth
- Personal user profiles
- Protected routes and data privacy
- Session management

### 🎨 **Modern UI/UX**

- Responsive design for all devices
- Dark/light theme support
- Intuitive navigation and search
- Clean, modern interface with Tailwind CSS
- Accessibility-focused components

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **npm** or **yarn**
- **Supabase account** (free tier available)
- **ComicVine API key** (free registration required)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/aviralmehrotra/comic-tracker.git
   cd comic-tracker
   ```

2. **Install frontend dependencies**

   ```bash
   npm install
   ```

3. **Install backend dependencies**

   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Setup**

   Create `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   Create `.env` file in the `backend` directory:

   ```env
   COMICVINE_API_KEY=your_comicvine_api_key
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   ```

5. **Database Setup**

   Run the SQL schema in your Supabase SQL Editor:

   ```bash
   # Copy and execute the contents of database/schema.sql in Supabase
   ```

6. **Start the development servers**

   **Backend server** (Terminal 1):

   ```bash
   cd backend
   npm run dev
   ```

   **Frontend server** (Terminal 2):

   ```bash
   npm run dev
   ```

7. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:3001`

## 🏗️ Project Structure

```
comic-vault/
├── backend/                 # Express.js API server
│   ├── server.js           # Main server file with API endpoints
│   ├── package.json        # Backend dependencies
│   └── .env               # Backend environment variables
├── database/
│   └── schema.sql         # Database schema and setup
├── public/
│   └── assets/            # Static assets and images
├── src/
│   ├── components/        # React components
│   │   ├── auth/         # Authentication components
│   │   ├── comic/        # Comic-specific components
│   │   ├── dashboard/    # Dashboard components
│   │   ├── layout/       # Layout components
│   │   └── ui/           # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── services/         # API service functions
│   ├── utils/            # Utility functions
│   └── App.jsx           # Main App component
├── package.json          # Frontend dependencies
└── README.md            # This file
```

## 🛠️ Technology Stack

### **Frontend**

- **React 19.1.1** - Modern React with latest features
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4.1.13** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **Radix UI** - Accessible component primitives

### **Backend**

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Supabase** - Backend-as-a-Service (PostgreSQL + Auth)
- **ComicVine API** - Comic book data source
- **CORS** - Cross-origin resource sharing

### **Database**

- **PostgreSQL** (via Supabase)
- **Row Level Security (RLS)** for data protection
- **Optimized indexes** for performance

## 📡 API Endpoints

### **Comic Search & Details**

- `GET /api/search` - Search comics via ComicVine
- `GET /api/comic-details` - Get detailed comic information

### **Collection Management**

- `POST /api/comics/add-to-collection` - Add comic to collection
- `GET /api/user/comics` - Get user's collection (with filtering)
- `PUT /api/comics/:id/status` - Update comic status and rating
- `GET /api/comics/:comicvine_id/collection-status` - Check collection status

### **Issue Tracking**

- `POST /api/issues/:comic_id/:issue_number/toggle` - Toggle issue read status
- `GET /api/issues/:comic_id/progress` - Get reading progress

## 🗄️ Database Schema

The application uses a well-structured PostgreSQL database with the following main tables:

- **`comics`** - Comic metadata from ComicVine
- **`user_comics`** - User's collection with status and ratings
- **`user_issues`** - Individual issue reading progress
- **`user_wishlist`** - Comics user wants to read (planned feature)

All user data is protected with Row Level Security (RLS) policies.

## 🔧 Configuration

### **ComicVine API Setup**

1. Register at [ComicVine](https://comicvine.gamespot.com/api/)
2. Get your free API key
3. Add it to your backend `.env` file

### **Supabase Setup**

1. Create a new project at [Supabase](https://supabase.com)
2. Get your project URL and keys from Settings > API
3. Run the database schema from `database/schema.sql`
4. Configure authentication providers if needed

## 🚧 Current Status

**Comic Vault is actively in development** with core functionality implemented:

✅ **Working Features:**

- Complete authentication system
- Comic search and discovery
- Collection management (add, update, filter)
- Issue-level progress tracking (backend ready)
- Responsive UI with modern design
- Database with security policies

🔄 **In Progress:**

- Dashboard real data integration
- Issue grid click handlers
- Rating system UI connections
- Wishlist functionality
- Advanced filtering and sorting

## 🤝 Contributing

This is currently a personal project, but contributions are welcome! Please feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **ComicVine API** for providing comprehensive comic book data
- **Supabase** for the excellent backend-as-a-service platform
- **Tailwind CSS** for the utility-first CSS framework
- **React community** for the amazing ecosystem

## 📞 Support

If you encounter any issues or have questions:

1. Check the [ROADMAP.md](ROADMAP.md) for known issues and planned features
2. Create an issue in the GitHub repository
3. Review the API test guide in `API-TEST-GUIDE.md`

---

**Happy Comic Reading! 📚✨**
