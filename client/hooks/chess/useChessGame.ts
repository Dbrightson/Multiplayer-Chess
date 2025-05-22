import { useEffect, useState } from 'react';
import { Chess, Move, Square } from 'chess.js';
import { useSocket } from './useSocket';

export type GameState = {
  fen: string;
  turn: 'w' | 'b';
  inCheck: boolean;
  gameOver: boolean;
  checkmate?: boolean;
  draw?: boolean;
  stalemate?: boolean;
  lastMove?: Move;
};

export type PlayerInfo = {
  color: 'w' | 'b';
  name: string;
};

export const useChessGame = (gameId: string, playerName: string) => {
  const { emit, on, isConnected } = useSocket();
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [playerColor, setPlayerColor] = useState<'w' | 'b' | null>(null);
  const [status, setStatus] = useState<'waiting' | 'active' | 'over'>('waiting');
  const [opponent, setOpponent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [winner, setWinner] = useState<'white' | 'black' | 'draw' | null>(null);
  
  // Local chess instance for move generation and validation
  const [chess] = useState(() => new Chess());
  
  useEffect(() => {
    if (isConnected && gameId && playerName) {
      // Join the game
      emit('join-game', { gameId, playerName });
      
      // Listen for player color assignment
      const unsubscribePlayerColor = on<{ color: 'w' | 'b' }>('player-color', (data) => {
        setPlayerColor(data.color);
      });
      
      // Listen for waiting status
      const unsubscribeWaiting = on<void>('waiting-for-opponent', () => {
        setStatus('waiting');
      });
      
      // Listen for game start
      const unsubscribeGameStart = on<{ white: string; black: string; fen: string }>('game-start', (data) => {
        setStatus('active');
        // Set opponent name
        const opponentName = playerColor === 'w' ? data.black : data.white;
        setOpponent(opponentName);
        // Update local chess instance with initial board position
        chess.load(data.fen);
      });
      
      // Listen for game state updates
      const unsubscribeGameState = on<GameState>('game-state', (newState) => {
        setGameState(newState);
        // Update local chess instance with new FEN
        chess.load(newState.fen);
      });
      
      // Listen for game over
      const unsubscribeGameOver = on<{ result: 'white' | 'black' | 'draw' }>('game-over', (data) => {
        setStatus('over');
        setWinner(data.result);
      });
      
      // Listen for errors
      const unsubscribeError = on<{ message: string }>('error', (data) => {
        setErrorMessage(data.message);
        // Clear error after 3 seconds
        setTimeout(() => setErrorMessage(null), 3000);
      });
      
      // Listen for player disconnection
      const unsubscribeDisconnect = on<{ playerName: string }>('player-disconnected', (data) => {
        // Show notification that opponent disconnected
        setErrorMessage(`${data.playerName} disconnected`);
      });
      
      // Listen for player left intentionally
      const unsubscribePlayerLeft = on<{ playerName: string }>('player-left', (data) => {
        setErrorMessage(`${data.playerName} left the game`);
      });
      
      // Clean up event listeners
      return () => {
        unsubscribePlayerColor();
        unsubscribeWaiting();
        unsubscribeGameStart();
        unsubscribeGameState();
        unsubscribeGameOver();
        unsubscribeError();
        unsubscribeDisconnect();
        unsubscribePlayerLeft();
        
        // Emit leave-game when component unmounts
        leaveGame();
      };
    }
  }, [isConnected, gameId, playerName, playerColor, emit, on]);
  
  // Function to make a move
  const makeMove = (from: Square, to: Square) => {
    try {
      // Only allow moves if it's the player's turn and game is active
      if (status !== 'active' || !gameState || gameState.turn !== playerColor) {
        return false;
      }
      
      // Try the move locally first
      const moveAttempt = chess.move({ from, to, promotion: 'q' }); // Default promotion to queen
      
      if (moveAttempt) {
        // If move is valid locally, send it to the server
        emit('move', { gameId, move: { from, to, promotion: 'q' } });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Move error:', error);
      return false;
    }
  };
  
  // Get valid moves for a piece
  const getValidMoves = (square: Square): Square[] => {
    if (!chess) return [];
    
    try {
      return chess.moves({ square, verbose: true }).map(move => move.to);
    } catch (error) {
      console.error('Error getting valid moves:', error);
      return [];
    }
  };
  
  // Add a new function to handle leaving a game intentionally
  const leaveGame = () => {
    if (isConnected && gameId) {
      emit('leave-game', { gameId });
    }
  };
  
  return {
    gameState,
    playerColor,
    status,
    opponent,
    errorMessage,
    winner,
    makeMove,
    getValidMoves,
    isConnected,
    leaveGame,
  };
}; 