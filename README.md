<p align="center">
  <img src="frontend/src/assets/logo.png" alt="Chatter-It logo" width="90"/>
</p>

<h1 align="center">Chatter-It</h1>

<p align="center">Real-time chat app built with React, Node.js, Express, and Socket.io.</p>

A real-time chat application built with React and Node.js, using Socket.io for instant, bidirectional communication. Includes an animated Three.js landing page, live typing indicators, online presence tracking, and persistent chat history via MongoDB.

## Tech Stack

**Frontend:** React (Vite), Socket.io-client, Axios, Three.js
**Backend:** Node.js, Express, Socket.io, MongoDB (Mongoose)
**Deployment:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Features

- Instant message delivery via Socket.io (no polling, no refresh)
- Persistent chat history stored in MongoDB
- Username-based login (dummy authentication)
- Typing indicators
- Real-time online/offline presence tracking
- Message delivered/read status
- Graceful handling of disconnects and reconnects
- Immersive Three.js particle network landing page

## How to Test the App

1. Start both the backend (`npm run dev` in `backend/`) and frontend (`npm run dev` in `frontend/`).
   Alternatively, test the live deployed version directly at: https://chatter-it.vercel.app
2. Open `http://localhost:5173` in your browser, click **Enter Chatter-It**, then log in with any username (e.g. `user1`).
3. Open a second browser window (or an incognito tab) to the same URL, and log in with a different username (e.g. `user2`).
4. Send a message from one window — it should appear instantly in the other, with no refresh needed.
5. Start typing in one window without sending — the other window should show a typing indicator.
6. Check the sidebar in both windows — both usernames should appear under "Online."
7. Close one browser tab entirely — the other window's online list should update to remove that user.
8. Refresh either window — previously sent messages should still be visible, confirming persistence via MongoDB.

## Project Structure

```
chatter-it/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── models/
│   │   │   └── Message.js
│   │   ├── controllers/
│   │   │   └── messageController.js
│   │   ├── routes/
│   │   │   └── messageRoutes.js
│   │   └── sockets/
│   │       └── chatSocket.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginScreen.jsx
    │   │   ├── ChatWindow.jsx
    │   │   ├── MessageBubble.jsx
    │   │   ├── MessageInput.jsx
    │   │   └── UserList.jsx
    │   ├── hooks/
    │   │   └── useSocket.js
    │   ├── services/
    │   │   └── api.js
    │   ├── assets/
    │   │   ├── logo.png
    │   │   ├── landing-illustration.png
    │   │   └── global-conversations.png
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── .env
```

## Setup

### Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the variables listed below, then run:

```bash
npm run dev
```

Runs on `http://localhost:5000` by default.

### Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/` with the variable listed below, then run:

```bash
npm run dev
```

Runs on `http://localhost:5173` by default.

## Environment Variables

**Backend (`backend/.env`)**

```
PORT=5050
MONGO_URI=your_mongodb_atlas_connection_string
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`)**

```
VITE_API_URL=http://localhost:5050
```

## Design Decisions

- Socket.io handles all real-time events (messages, typing, presence). REST endpoints are used for fetching chat history on load and as a fallback message-send path.
- MongoDB was chosen for persistence so chat history survives page refreshes and server restarts.
- Username-based login was implemented instead of full authentication, matching the assignment's scope for dummy auth.
- Online-user tracking uses an in-memory Map tied to active socket connections, sufficient for a single-instance deployment.
- The landing page uses a custom Three.js particle network to visually represent real-time message flow between connected nodes, reflecting the app's core function.

## Assumptions

- Single chat room only; no multi-room or direct-message support.
- No password-based authentication; username identifies a session only.
- React (web) was used instead of React Native, since it allows full deployment on free-tier services without requiring a local Android build environment.

## Live Links

- Frontend: [https://chatter-it.vercel.app](https://chatter-it.vercel.app)
- Backend API: [https://chatter-it-backend.onrender.com](https://chatter-it-backend.onrender.com)

## Bonus Features Implemented

- Username-based login
- Typing indicator
- Online/offline user status
- Message delivered/read status
- MongoDB persistence
- Deployed backend (Render) and frontend (Vercel)