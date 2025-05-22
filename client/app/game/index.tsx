import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, SafeAreaView, Dimensions, ColorValue } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Chess, Square } from 'chess.js';
import ChessBoard from '@/components/chess/ChessBoard';
import { useChessGame } from '@/hooks/chess/useChessGame';
import { useTheme } from '@/hooks/useThemeContext';
import { Colors, Gradients } from '@/constants/Colors';
import ThemeToggle from '@/components/ThemeToggle';
import * as Animatable from 'react-native-animatable';

const { width, height } = Dimensions.get('window');
const BOARD_SIZE = Math.min(width - 40, 380); // Maximum board size with padding

const GameScreen = () => {
  const { gameId, playerName } = useLocalSearchParams<{ gameId: string; playerName: string }>();
  const { theme, isDark } = useTheme();
  
  // Ensure we have the required params
  useEffect(() => {
    if (!gameId || !playerName) {
      Alert.alert('Error', 'Missing game information', [
        { text: 'OK', onPress: () => router.replace('/') }
      ]);
    }
  }, [gameId, playerName]);
  
  // Initialize the chess game hook
  const {
    gameState,
    playerColor,
    status,
    opponent,
    errorMessage,
    winner,
    makeMove,
    isConnected,
    leaveGame,
  } = useChessGame(gameId as string, playerName as string);
  
  // Handle move
  const handleMove = (from: Square, to: Square) => {
    return makeMove(from, to);
  };
  
  // Determine if it's the player's turn
  const isPlayerTurn = gameState?.turn === playerColor;
  
  // Get last move for highlighting
  const getLastMove = () => {
    if (gameState?.lastMove) {
      return {
        from: gameState.lastMove.from as Square,
        to: gameState.lastMove.to as Square,
      };
    }
    return undefined;
  };
  
  // Handle leaving the game
  const handleLeaveGame = () => {
    Alert.alert(
      'Leave Game',
      'Are you sure you want to leave this game? If the game is in progress, you will forfeit.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Leave', 
          style: 'destructive', 
          onPress: () => {
            leaveGame();
            router.replace('/');
          }
        },
      ]
    );
  };
  
  // Get game status message and color
  const getStatusInfo = () => {
    if (!isConnected) {
      return { message: 'Connecting...', color: isDark ? Colors.dark.warning : Colors.light.warning };
    }
    
    if (status === 'waiting') {
      return { message: 'Waiting for opponent...', color: isDark ? Colors.dark.warning : Colors.light.warning };
    }
    
    if (status === 'over') {
      if (winner === 'draw') {
        return { message: 'Game over - Draw', color: isDark ? Colors.dark.info : Colors.light.info };
      }
      if (winner === 'white') {
        return playerColor === 'w' 
          ? { message: 'You won!', color: isDark ? Colors.dark.success : Colors.light.success }
          : { message: 'You lost!', color: isDark ? Colors.dark.error : Colors.light.error };
      }
      if (winner === 'black') {
        return playerColor === 'b'
          ? { message: 'You won!', color: isDark ? Colors.dark.success : Colors.light.success }
          : { message: 'You lost!', color: isDark ? Colors.dark.error : Colors.light.error };
      }
      return { message: 'Game over', color: isDark ? Colors.dark.info : Colors.light.info };
    }
    
    if (isPlayerTurn) {
      return { message: 'Your turn', color: isDark ? Colors.dark.primary : Colors.light.primary };
    }
    
    return { message: "Opponent's turn", color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary };
  };
  
  const statusInfo = getStatusInfo();
  
  // Get connected status color
  const getConnectionColor = () => {
    return isConnected 
      ? (isDark ? Colors.dark.success : Colors.light.success) 
      : (isDark ? Colors.dark.error : Colors.light.error);
  };
  
  // Function to render win/loss screen
  const renderGameOverScreen = () => {
    const isWinner = 
      (winner === 'white' && playerColor === 'w') || 
      (winner === 'black' && playerColor === 'b');
    
    const isDraw = winner === 'draw';
    
    // Define proper color arrays
    const successColors = isDark 
      ? ['#4ADE80', '#22C55E'] as const
      : ['#22C55E', '#16A34A'] as const;
    
    const secondaryColors = isDark
      ? ['#A78BFA', '#8B5CF6'] as const
      : ['#8B5CF6', '#7C3AED'] as const;
    
    const errorColors = isDark
      ? ['#F87171', '#EF4444'] as const
      : ['#EF4444', '#DC2626'] as const;
    
    return (
      <Animatable.View 
        style={styles.gameOverContainer}
        animation="fadeIn"
        duration={800}
      >
        <BlurView 
          intensity={isDark ? 50 : 80} 
          tint={isDark ? "dark" : "light"}
          style={styles.gameOverBlur}
        >
          <LinearGradient
            colors={isWinner ? successColors : isDraw ? secondaryColors : errorColors}
            style={styles.gameOverGradient}
          >
            <Animatable.View 
              animation="pulse" 
              iterationCount="infinite"
              duration={2000}
              style={styles.resultIconContainer}
            >
              {isWinner ? (
                <FontAwesome5 name="crown" size={60} color="#FFD700" />
              ) : isDraw ? (
                <MaterialCommunityIcons name="handshake" size={60} color="#FFFFFF" />
              ) : (
                <MaterialCommunityIcons name="chess-king" size={60} color="#FFFFFF" />
              )}
            </Animatable.View>
            
            <Text style={styles.gameOverTitle}>
              {isWinner ? 'Victory!' : isDraw ? 'Draw!' : 'Defeat!'}
            </Text>
            
            <Text style={styles.gameOverMessage}>
              {isWinner 
                ? 'Congratulations! You won the match.' 
                : isDraw
                  ? 'The game ended in a draw.'
                  : 'Better luck next time!'}
            </Text>
            
            <TouchableOpacity
              style={styles.newGameButton}
              onPress={() => router.replace('/')}
            >
              <Text style={styles.newGameButtonText}>Back to Menu</Text>
            </TouchableOpacity>
          </LinearGradient>
        </BlurView>
      </Animatable.View>
    );
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient 
        colors={isDark ? Gradients.dark.background as any : Gradients.light.background as any} 
        style={styles.container}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        
        <View style={styles.overlay}>
          {/* Header */}
          <BlurView intensity={isDark ? 40 : 60} tint={isDark ? "dark" : "light"} style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
            </TouchableOpacity>
            
            <View style={styles.headerContent}>
              <Text style={[styles.title, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Chess Game</Text>
              <Text style={[styles.gameId, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Game ID: {gameId}</Text>
            </View>
            
            <View style={styles.headerControls}>
              <ThemeToggle size={22} />
              <View style={[styles.connectionIndicator, { backgroundColor: getConnectionColor() }]} />
            </View>
          </BlurView>
          
          {/* Game Status */}
          <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>
              {statusInfo.message}
            </Text>
            {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
          </BlurView>
          
          {/* Players */}
          <View style={styles.playersContainer}>
            <LinearGradient
              colors={isDark 
                ? ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)'] as any
                : ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.9)'] as any}
              style={[
                styles.playerCard, 
                playerColor === 'w' && isPlayerTurn && styles.activePlayerCard,
                { borderColor: isDark ? Colors.dark.glassBorder : Colors.light.glassBorder }
              ]}
            >
              <BlurView intensity={isDark ? 20 : 30} tint={isDark ? "dark" : "light"} style={styles.playerInfo}>
                <View style={styles.playerHeader}>
                  <Text style={[styles.playerLabel, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>You</Text>
                  {playerColor === 'w' && isPlayerTurn && <View style={[styles.turnIndicator, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]} />}
                </View>
                <Text style={[styles.playerName, { color: isDark ? Colors.dark.text : Colors.light.text }]}>{playerName}</Text>
                <View style={styles.colorIndicator}>
                  <LinearGradient
                    colors={playerColor === 'w' ? ['#FFFFFF', '#E2E8F0'] : ['#1E293B', '#0F172A']}
                    style={styles.colorBadge}
                  >
                    <MaterialCommunityIcons 
                      name="chess-king" 
                      size={18} 
                      color={playerColor === 'w' ? '#000' : '#fff'}
                    />
                  </LinearGradient>
                  <Text style={[styles.playerColor, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                    {playerColor === 'w' ? 'White' : 'Black'}
                  </Text>
                </View>
              </BlurView>
            </LinearGradient>
            
            <View style={styles.vsContainer}>
              <Text style={[styles.vsText, { color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }]}>VS</Text>
            </View>
            
            <LinearGradient
              colors={isDark 
                ? ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)'] as any
                : ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.9)'] as any}
              style={[
                styles.playerCard, 
                playerColor !== 'w' && isPlayerTurn && styles.activePlayerCard,
                { borderColor: isDark ? Colors.dark.glassBorder : Colors.light.glassBorder }
              ]}
            >
              <BlurView intensity={isDark ? 20 : 30} tint={isDark ? "dark" : "light"} style={styles.playerInfo}>
                <View style={styles.playerHeader}>
                  <Text style={[styles.playerLabel, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>Opponent</Text>
                  {opponent && !isPlayerTurn && <View style={[styles.turnIndicator, { backgroundColor: isDark ? Colors.dark.primary : Colors.light.primary }]} />}
                </View>
                {opponent ? (
                  <>
                    <Text style={[styles.playerName, { color: isDark ? Colors.dark.text : Colors.light.text }]}>{opponent}</Text>
                    <View style={styles.colorIndicator}>
                      <LinearGradient
                        colors={playerColor !== 'w' ? ['#FFFFFF', '#E2E8F0'] : ['#1E293B', '#0F172A']}
                        style={styles.colorBadge}
                      >
                        <MaterialCommunityIcons 
                          name="chess-king" 
                          size={18} 
                          color={playerColor !== 'w' ? '#000' : '#fff'}
                        />
                      </LinearGradient>
                      <Text style={[styles.playerColor, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                        {playerColor === 'w' ? 'Black' : 'White'}
                      </Text>
                    </View>
                  </>
                ) : (
                  <ActivityIndicator size="small" color={isDark ? Colors.dark.text : Colors.light.text} />
                )}
              </BlurView>
            </LinearGradient>
          </View>
          
          {/* Chess Board */}
          <View style={styles.boardContainer}>
            {gameState ? (
              <ChessBoard
                fen={gameState.fen}
                playerColor={playerColor}
                onMove={handleMove}
                isPlayerTurn={isPlayerTurn}
                lastMove={getLastMove()}
              />
            ) : (
              <BlurView intensity={isDark ? 20 : 30} tint={isDark ? "dark" : "light"} style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={isDark ? Colors.dark.text : Colors.light.text} />
                <Text style={[styles.loadingText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Loading game...</Text>
              </BlurView>
            )}
          </View>
          
          {/* Game Controls */}
          <View style={styles.controlsContainer}>
            <TouchableOpacity
              style={styles.leaveButton}
              onPress={handleLeaveGame}
            >
              <LinearGradient
                colors={isDark ? ['#F87171', '#EF4444'] as any : ['#EF4444', '#DC2626'] as any}
                style={styles.leaveButtonGradient}
              >
                <Text style={styles.leaveButtonText}>Leave Game</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Game Over Modal */}
          {status === 'over' && renderGameOverScreen()}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    paddingTop: 40,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 16,
    marginHorizontal: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    marginRight: 15,
    padding: 5,
    borderRadius: 10,
  },
  headerContent: {
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  gameId: {
    fontSize: 12,
  },
  connectionIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusContainer: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    borderRadius: 16,
    marginHorizontal: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    marginTop: 5,
    fontSize: 14,
    color: '#f44336',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  playerCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  activePlayerCard: {
    borderWidth: 2,
  },
  playerInfo: {
    padding: 15,
    borderRadius: 16,
    overflow: 'hidden',
  },
  playerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  turnIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  colorIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  colorBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  playerColor: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
  vsContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  boardContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  loadingContainer: {
    minHeight: 300,
    width: BOARD_SIZE,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  controlsContainer: {
    padding: 12,
  },
  leaveButton: {
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
  },
  leaveButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leaveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  gameOverContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex: 1000,
  },
  gameOverBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
    maxWidth: 350,
  },
  gameOverGradient: {
    padding: 25,
    alignItems: 'center',
    borderRadius: 20,
  },
  resultIconContainer: {
    marginBottom: 20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  gameOverMessage: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 25,
  },
  newGameButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 25,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  newGameButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GameScreen; 