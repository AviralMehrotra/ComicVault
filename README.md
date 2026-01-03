# Comic Vault 🦸‍♂️📚

![Comic Vault Banner](public/assets/ComicVaultLogo.png)

> **Your Ultimate Companion for Tracking and Discovering Comics.**
>
> _Built with React, Node.js, Supabase, and the ComicVine API._

---

## 🌟 Overview

**Comic Vault** is a modern, feature-rich application designed for comic book enthusiasts. It goes beyond simple list-making by offering granular tracking at the issue level, insightful statistics about your reading habits, and a beautiful, responsive interface that makes managing your collection a joy.

Whether you're a casual reader or a hardcore collector, Comic Vault helps you answer: _"What issue was I on?"_, _"When did I read that?"_, and _"What should I read next?"_

## ✨ Key Features

### 🔍 **Discovery & Details**

- **Powerful Search**: Instantly find comics from the massive ComicVine database.
- **Rich Metadata**: View deep dives into characters, creators, locations, and story arcs.
- **Immersive UI**: High-quality cover art and clean, readable layouts.

### 📚 **Collection Management**

- **Smart Organization**: Categorize by **Reading**, **Completed**, **Planned**, or **Dropped**.
- **Granular Tracking**: Mark individual issues as read/unread. No more guessing where you left off.
- **Favorites**: Pin your top-tier series for quick access.

### 📊 **Activity & Insights** (New!)

- **Live Activity Feed**: See your recent reading history in real-time.
- **Reading Heatmap**: Visualize your daily reading habits with a GitHub-style contribution graph.
- **Detailed Stats**: Track total issues read, volumes completed, and more.

### 👤 **User Experience**

- **My Account**: A personalized hub for your stats and settings.
- **Secure Auth**: Powered by Supabase for robust security.
- **Responsive Design**: Seamless experience across desktop, tablet, and mobile.

---

## 🚀 Quick Start Guide

### Prerequisites

- Node.js 18+
- Supabase Account
- ComicVine API Key

### Installation

1.  **Clone the Repo**

    ```bash
    git clone https://github.com/aviralmehrotra/ComicVault.git
    cd ComicVault
    ```

2.  **Install Dependencies**

    ```bash
    # Frontend
    npm install

    # Backend
    cd backend
    npm install
    ```

3.  **Configure Environment**
    Create `.env` in root:

    ```env
    VITE_SUPABASE_URL=your_url
    VITE_SUPABASE_ANON_KEY=your_key
    ```

    Create `.env` in `backend/`:

    ```env
    COMICVINE_API_KEY=your_key
    SUPABASE_URL=your_url
    SUPABASE_SERVICE_KEY=your_key
    ```

4.  **Launch!**

    ```bash
    # Terminal 1 (Backend)
    cd backend && npm run dev

    # Terminal 2 (Frontend)
    npm run dev
    ```

---

## 🏗️ Architecture

**Frontend**:

- **React 19** + **Vite**: Blazing fast performance.
- **Tailwind CSS 4**: Modern, utility-first styling.
- **Lucide React**: Crisp, consistent iconography.

**Backend**:

- **Node.js** + **Express**: Robust API proxy and business logic.
- **Supabase**: PostgreSQL database with Row Level Security (RLS).

**Data Source**:

- **ComicVine API**: The gold standard for comic book metadata.

---

## 📸 Screenshots

|           Dashboard            |         Comic Details         |
| :----------------------------: | :---------------------------: |
| _Your personal command center_ | _Deep dive into every volume_ |
|        (Add Screenshot)        |       (Add Screenshot)        |

|        Activity Feed         |     Reading Heatmap      |
| :--------------------------: | :----------------------: |
| _Track every issue you read_ | _Visualize your streaks_ |
|       (Add Screenshot)       |     (Add Screenshot)     |

---

## 🤝 Contributing

We welcome contributions! Whether it's fixing a bug, improving documentation, or proposing new features:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/aviralmehrotra">Aviral Mehrotra</a>
</p>
