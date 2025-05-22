# Chess Game Server

This is the backend server for a real-time multiplayer chess game using WebSockets.

## Technologies Used
- Node.js
- Express
- Socket.IO
- chess.js
- UUID

## Setup

1. Create a `.env` file in the root of the server directory with the following content:
   ```
   PORT=5000
   NODE_ENV=development
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the server in development mode:
   ```
   npm run dev
   ```

## API Endpoints

- `GET /` - API health check
- `POST /api/create-game` - Create a new game and get a game ID
- `POST /api/join-game` - Join an existing game with a game ID

## WebSocket Events

### Client to Server
- `join-game` - Join a game room
- `move` - Make a chess move
- `disconnect` - Handle player disconnection

### Server to Client
- `error` - Error messages
- `game-state` - Current state of the game
- `game-start` - Game has started
- `player-color` - Player's assigned color
- `waiting-for-opponent` - Waiting for another player to join
- `player-disconnected` - Other player has disconnected
- `game-over` - Game has ended 