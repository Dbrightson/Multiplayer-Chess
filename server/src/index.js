const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');
const { Chess } = require('chess.js');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Configure CORS with more explicit settings
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));
app.use(express.json());

// Add OPTIONS handler for preflight requests
app.options('*', cors());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
  }
});

// In-memory game storage
const games = {};

// API Routes
app.get('/', (req, res) => {
  res.send('Chess Game API is running');
});

// Create a new game
app.post('/api/create-game', (req, res) => {
  const gameId = uuidv4();
  games[gameId] = {
    id: gameId,
    players: [],
    chess: new Chess(),
    status: 'waiting',
    createdAt: new Date()
  };
  
  res.json({ gameId, message: 'Game created successfully' });
});

// Join a game
app.post('/api/join-game', (req, res) => {
  const { gameId, playerName } = req.body;
  
  if (!gameId || !playerName) {
    return res.status(400).json({ error: 'Game ID and player name are required' });
  }
  
  const game = games[gameId];
  
  if (!game) {
    return res.status(404).json({ error: 'Game not found' });
  }
  
  if (game.players.length >= 2) {
    return res.status(400).json({ error: 'Game is full' });
  }
  
  res.json({ message: 'Successfully joined the game' });
});

// Socket.IO Connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  // Join a game room
  socket.on('join-game', ({ gameId, playerName }) => {
    const game = games[gameId];
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    // Check if player is already in the game
    const existingPlayerIndex = game.players.findIndex(p => p.name === playerName);
    
    if (existingPlayerIndex !== -1) {
      // Reconnection case
      game.players[existingPlayerIndex].socketId = socket.id;
      socket.join(gameId);
      socket.emit('game-state', { 
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        inCheck: game.chess.inCheck(),
        gameOver: game.chess.isGameOver(),
        playerColor: game.players[existingPlayerIndex].color
      });
      return;
    }
    
    // New player joining
    if (game.players.length >= 2) {
      socket.emit('error', { message: 'Game is full' });
      return;
    }
    
    // Assign color to player (first player is white, second is black)
    const color = game.players.length === 0 ? 'w' : 'b';
    
    // Add player to the game
    game.players.push({
      id: socket.id,
      name: playerName,
      color,
      socketId: socket.id
    });
    
    // Join the socket room
    socket.join(gameId);
    
    // Update game status if now there are 2 players
    if (game.players.length === 2) {
      game.status = 'active';
      io.to(gameId).emit('game-start', {
        white: game.players.find(p => p.color === 'w').name,
        black: game.players.find(p => p.color === 'b').name,
        fen: game.chess.fen()
      });
    } else {
      socket.emit('waiting-for-opponent');
    }
    
    // Send the player their color
    socket.emit('player-color', { color });
  });
  
  // Handle moves
  socket.on('move', ({ gameId, move }) => {
    const game = games[gameId];
    
    if (!game) {
      socket.emit('error', { message: 'Game not found' });
      return;
    }
    
    // Find player in the game
    const player = game.players.find(p => p.socketId === socket.id);
    
    if (!player) {
      socket.emit('error', { message: 'You are not part of this game' });
      return;
    }
    
    // Check if it's the player's turn
    if (game.chess.turn() !== player.color) {
      socket.emit('error', { message: 'Not your turn' });
      return;
    }
    
    // Try to make the move
    try {
      const result = game.chess.move(move);
      
      if (!result) {
        socket.emit('error', { message: 'Invalid move' });
        return;
      }
      
      // Broadcast the updated game state to all players in the room
      io.to(gameId).emit('game-state', {
        fen: game.chess.fen(),
        turn: game.chess.turn(),
        lastMove: result,
        inCheck: game.chess.inCheck(),
        gameOver: game.chess.isGameOver(),
        checkmate: game.chess.isCheckmate(),
        draw: game.chess.isDraw(),
        stalemate: game.chess.isStalemate()
      });
      
      // Check if the game is over
      if (game.chess.isGameOver()) {
        let result = 'draw';
        
        if (game.chess.isCheckmate()) {
          // The player who just moved has won
          result = player.color === 'w' ? 'white' : 'black';
        }
        
        io.to(gameId).emit('game-over', { result });
        
        // Keep the game for some time before deleting it
        setTimeout(() => {
          delete games[gameId];
        }, 3600000); // 1 hour
      }
    } catch (error) {
      socket.emit('error', { message: error.message });
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    // Find games where this socket is a player
    Object.keys(games).forEach(gameId => {
      const game = games[gameId];
      const playerIndex = game.players.findIndex(p => p.socketId === socket.id);
      
      if (playerIndex !== -1) {
        // Get the player
        const player = game.players[playerIndex];
        
        // Notify other player about disconnection
        socket.to(gameId).emit('player-disconnected', {
          playerName: player.name
        });
        
        // If game is active and not over, make the opponent win
        if (game.status === 'active' && !game.chess.isGameOver()) {
          // Determine the winner (opponent of the player who left)
          const winner = player.color === 'w' ? 'black' : 'white';
          
          // Notify all players in the room that the game is over
          io.to(gameId).emit('game-over', { 
            result: winner,
            reason: 'opponent_left'
          });
          
          // Mark the game as over
          game.status = 'over';
        }
        
        // Keep the player in the game for potential reconnection
        // but mark the socket as disconnected
        game.players[playerIndex].socketId = null;
      }
    });
  });

  // Handle player leaving a game intentionally
  socket.on('leave-game', ({ gameId }) => {
    const game = games[gameId];
    
    if (!game) {
      return;
    }
    
    const playerIndex = game.players.findIndex(p => p.socketId === socket.id);
    
    if (playerIndex !== -1) {
      // Get the player
      const player = game.players[playerIndex];
      
      // Notify other player that this player left intentionally
      socket.to(gameId).emit('player-left', {
        playerName: player.name
      });
      
      // If game is active and not over, make the opponent win
      if (game.status === 'active' && !game.chess.isGameOver()) {
        // Determine the winner (opponent of the player who left)
        const winner = player.color === 'w' ? 'black' : 'white';
        
        // Notify all players in the room that the game is over
        io.to(gameId).emit('game-over', { 
          result: winner,
          reason: 'opponent_left'
        });
        
        // Mark the game as over
        game.status = 'over';
      }
      
      // Remove player from the game room
      socket.leave(gameId);
    }
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Listen on all network interfaces
server.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
}); 