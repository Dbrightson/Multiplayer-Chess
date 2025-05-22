# Chess Game Mobile App

A real-time multiplayer chess application built with React Native and WebSockets.

## Features

- Real-time multiplayer chess gameplay
- Create or join games via unique game IDs
- Interactive chess board with move validation
- Visual indicators for valid moves, check, and game over
- Turn-based gameplay with real-time updates
- Responsive design for various device sizes

## Technologies Used

- React Native
- Expo
- Socket.IO Client
- chess.js (for game logic)
- React Navigation

## Setup

1. Make sure you have Node.js and npm installed
2. Install Expo CLI if you haven't already:
   ```
   npm install -g expo-cli
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```
5. Follow the instructions to open the app on your device or emulator

## Running the App

To properly test the app, you need to have the backend server running as well. Follow these steps:

1. Start the chess game server (from the server directory):
   ```
   npm run dev
   ```
2. Start the React Native app (from the client directory):
   ```
   npm start
   ```

## How to Play

1. On the home screen, select "Create New Game" or "Join Game"
2. To create a game:
   - Enter your name and tap "Create Game"
   - Share the game ID with your opponent
3. To join a game:
   - Enter the game ID and your name
   - Tap "Join Game"
4. The first player to create the game plays as White
5. Make moves by tapping a piece and then tapping the destination
6. The game automatically validates moves and tracks game state

## Project Structure

- `/app` - Screens and navigation
- `/components` - Reusable UI components
- `/components/chess` - Chess-specific components
- `/hooks` - Custom React hooks
- `/hooks/chess` - Chess game logic hooks

## Troubleshooting

- If you have connection issues, make sure the server is running and accessible
- The default server URL is `http://localhost:5000`, which works for iOS simulators
- For Android emulators, the server URL might need to be changed to `http://10.0.2.2:5000`
- For physical devices, update the server URL in `/hooks/chess/useSocket.ts` to the actual server IP address
