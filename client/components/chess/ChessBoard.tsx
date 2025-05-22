import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { Chess, Square } from 'chess.js';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import ChessPiece from './ChessPiece';
import { useTheme } from '@/hooks/useThemeContext';
import { Colors, Gradients } from '@/constants/Colors';

// Calculate optimal board size based on screen width
const { width } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 380); // Maximum board size with padding
const SQUARE_SIZE = BOARD_SIZE / 8;

type ChessBoardProps = {
  fen: string;
  playerColor: 'w' | 'b' | null;
  onMove?: (from: Square, to: Square) => void;
  isPlayerTurn?: boolean;
  lastMove?: { from: Square; to: Square };
};

const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  playerColor = 'w',
  onMove,
  isPlayerTurn = false,
  lastMove,
}) => {
  const { isDark } = useTheme();
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Square[]>([]);
  const [chess] = useState(() => new Chess());
  
  // Get colors from theme
  const LIGHT_SQUARE = isDark ? Colors.dark.lightSquare : Colors.light.lightSquare;
  const DARK_SQUARE = isDark ? Colors.dark.darkSquare : Colors.light.darkSquare;
  const SELECTED_SQUARE = isDark ? Colors.dark.selectedSquare : Colors.light.selectedSquare;
  const VALID_MOVE = isDark ? Colors.dark.validMove : Colors.light.validMove;
  const LAST_MOVE = isDark ? Colors.dark.lastMove : Colors.light.lastMove;
  
  // Update chess instance when FEN changes
  useEffect(() => {
    if (fen) {
      chess.load(fen);
    }
  }, [fen, chess]);
  
  // Get valid moves for selected piece
  useEffect(() => {
    if (selectedSquare) {
      try {
        const moves = chess.moves({
          square: selectedSquare,
          verbose: true,
        });
        setValidMoves(moves.map(move => move.to as Square));
      } catch (error) {
        console.error('Error getting valid moves:', error);
        setValidMoves([]);
      }
    } else {
      setValidMoves([]);
    }
  }, [selectedSquare, chess]);
  
  // Handle square selection
  const handleSquarePress = (square: Square) => {
    // If it's not the player's turn, do nothing
    if (!isPlayerTurn) return;
    
    // If a square is already selected
    if (selectedSquare) {
      // If the selected square is clicked again, deselect it
      if (selectedSquare === square) {
        setSelectedSquare(null);
        return;
      }
      
      // Check if the destination square is a valid move
      if (validMoves.includes(square)) {
        // Make the move
        onMove?.(selectedSquare, square);
        setSelectedSquare(null);
      } else {
        // Check if the clicked square has the player's piece
        const piece = chess.get(square);
        if (piece && piece.color === chess.turn()) {
          // Select the new square
          setSelectedSquare(square);
        } else {
          // Deselect if clicking on an invalid destination
          setSelectedSquare(null);
        }
      }
    } else {
      // No square is selected, check if the square has a piece
      const piece = chess.get(square);
      if (piece && piece.color === chess.turn() && chess.turn() === playerColor?.[0]) {
        setSelectedSquare(square);
      }
    }
  };
  
  // Determine if a square should be highlighted
  const isHighlighted = (square: Square): boolean => {
    if (selectedSquare === square) return true;
    if (validMoves.includes(square)) return true;
    if (lastMove && (lastMove.from === square || lastMove.to === square)) return true;
    return false;
  };
  
  // Determine square's highlight color
  const getHighlightColor = (square: Square): string | undefined => {
    if (selectedSquare === square) return SELECTED_SQUARE;
    if (validMoves.includes(square)) return VALID_MOVE;
    if (lastMove && (lastMove.from === square || lastMove.to === square)) 
      return LAST_MOVE;
    return undefined;
  };
  
  // Render the board
  const renderBoard = () => {
    const squares = [];
    const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const ranks = ['8', '7', '6', '5', '4', '3', '2', '1'];
    
    // Reverse files if player is playing as black
    const displayFiles = playerColor === 'b' ? [...files].reverse() : files;
    const displayRanks = playerColor === 'b' ? [...ranks].reverse() : ranks;
    
    // Create all squares
    for (let rankIndex = 0; rankIndex < 8; rankIndex++) {
      for (let fileIndex = 0; fileIndex < 8; fileIndex++) {
        const file = displayFiles[fileIndex];
        const rank = displayRanks[rankIndex];
        const square = `${file}${rank}` as Square;
        const isDarkSquare = (fileIndex + rankIndex) % 2 === 1;
        const squareColor = isDarkSquare ? DARK_SQUARE : LIGHT_SQUARE;
        const piece = chess.get(square);
        
        squares.push(
          <TouchableOpacity
            key={square}
            style={[
              styles.square,
              {
                position: 'absolute',
                left: fileIndex * SQUARE_SIZE,
                top: rankIndex * SQUARE_SIZE,
                width: SQUARE_SIZE,
                height: SQUARE_SIZE,
                backgroundColor: squareColor,
              },
            ]}
            onPress={() => handleSquarePress(square)}
            activeOpacity={0.7}
          >
            {isHighlighted(square) && (
              <View
                style={[
                  styles.highlight,
                  { backgroundColor: getHighlightColor(square) },
                ]}
              />
            )}
            {piece && (
              <View style={styles.pieceContainer}>
                <ChessPiece
                  type={piece.type}
                  color={piece.color}
                  size={SQUARE_SIZE * 0.9}
                />
              </View>
            )}
            {/* Rank and file indicators */}
            {fileIndex === 0 && (
              <Text style={[
                styles.rankIndicator, 
                { color: isDarkSquare ? LIGHT_SQUARE : DARK_SQUARE }
              ]}>
                {rank}
              </Text>
            )}
            {rankIndex === 7 && (
              <Text style={[
                styles.fileIndicator, 
                { color: isDarkSquare ? LIGHT_SQUARE : DARK_SQUARE }
              ]}>
                {file}
              </Text>
            )}
          </TouchableOpacity>
        );
      }
    }
    
    return squares;
  };
  
  return (
    <View style={styles.container}>
      <BlurView intensity={isDark ? 15 : 25} tint={isDark ? "dark" : "light"} style={styles.blurContainer}>
        <LinearGradient
          colors={isDark 
            ? ['rgba(30, 41, 59, 0.9)', 'rgba(15, 23, 42, 0.95)']
            : ['rgba(255, 255, 255, 0.9)', 'rgba(241, 245, 249, 0.95)']}
          style={styles.gradientContainer}
        >
          <View
            style={[
              styles.board,
              {
                width: BOARD_SIZE,
                height: BOARD_SIZE,
                borderColor: isDark ? 'rgba(51, 65, 85, 0.6)' : 'rgba(203, 213, 225, 0.8)',
              },
            ]}
          >
            {renderBoard()}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  blurContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  gradientContainer: {
    padding: 15,
    borderRadius: 16,
  },
  board: {
    position: 'relative',
    borderWidth: 2,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 0,
  },
  pieceContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankIndicator: {
    position: 'absolute',
    top: 2,
    left: 3,
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.7,
  },
  fileIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 3,
    fontSize: 10,
    fontWeight: 'bold',
    opacity: 0.7,
  },
});

export default ChessBoard; 