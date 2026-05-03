# Ceylon Warfare Web

The official website for Ceylon Warfare, a Call of Duty 4 community.

## Live Website
- https://ceylonwarfare.tech/

## Features
- **Modern Dashboard:** A sleek, dark-themed UI for community resources.
- **Killcam Music:** A dedicated section for players to upload and download MP3 tracks for use in-game.
  - Side-by-side Upload & Gallery view.
  - Real-time upload progress tracking.
  - Independent scrollable tracklist.
  - Public downloads (No access code required).
  - Secure "Delete All" functionality for administrators.

## Tech Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript.
- **Backend:** Node.js, Express, Multer (for file uploads).
- **Icons:** Google Material Symbols.
- **Fonts:** Space Grotesk, Manrope.

## Getting Started

### 1. Run the Backend (API & Uploads)
Requires Node.js installed.
```bash
cd backend
npm install
node server.js
```
The backend runs on `http://localhost:3001`.

### 2. Run the Frontend
You can use any static file server.
```bash
# Example using http-server
npx http-server -p 8080 -c-1
```
The frontend will be available at `http://localhost:8080`.

## Administrative Controls
To delete all tracks, click the **DELETE ALL** button in the Killcam Music section. You will be prompted for the administrator access code.
