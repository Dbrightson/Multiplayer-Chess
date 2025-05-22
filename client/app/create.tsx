import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Platform, SafeAreaView, ColorValue } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { getServerUrl } from '@/hooks/chess/useSocket';
import { useTheme } from '@/hooks/useThemeContext';
import { Colors, Gradients } from '@/constants/Colors';
import ThemeToggle from '@/components/ThemeToggle';

const CreateGameScreen = () => {
  const [playerName, setPlayerName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme, isDark } = useTheme();
  
  const handleCreateGame = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get the server URL and log it for debugging
      const serverUrl = getServerUrl();
      console.log('Creating game - Platform:', Platform.OS);
      console.log('Connecting to server URL:', serverUrl);
      
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timed out')), 10000)
      );
      
      // Create the fetch promise
      const fetchPromise = fetch(`${serverUrl}/api/create-game`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({}),
      });
      
      // Race the fetch against the timeout
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      const data = await response.json();
      
      if (response.ok) {
        console.log('Game created successfully:', data);
        // Navigate to the game screen with the game ID and player name
        router.push({
          pathname: '/game',
          params: { gameId: data.gameId, playerName },
        });
      } else {
        console.error('Server returned error:', data);
        Alert.alert('Error', data.error || 'Failed to create game');
      }
    } catch (error) {
      console.error('Error creating game:', error);
      // Show more detailed error information
      const errorMessage = error instanceof Error ? error.toString() : String(error);
      console.error('Detailed error:', errorMessage);
      
      // Provide more specific error messages based on error type
      if (errorMessage.includes('Network request failed') || errorMessage.includes('timed out')) {
        Alert.alert(
          'Connection Error', 
          `Could not connect to the server at ${getServerUrl()}. Please check that:\n\n` +
          '1. The server is running\n' + 
          '2. Your device is on the same network\n' +
          '3. No firewall is blocking the connection\n' +
          '4. The IP address is correct'
        );
      } else {
        Alert.alert('Error', `Could not create game: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient 
        colors={isDark ? Gradients.dark.background as any : Gradients.light.background as any} 
        style={styles.container}
      >
        <StatusBar style={isDark ? "light" : "dark"} />
        
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color={isDark ? Colors.dark.text : Colors.light.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
              Create New Game
            </Text>
            <ThemeToggle size={22} />
          </View>
          
          <View style={styles.content}>
            <BlurView intensity={isDark ? 30 : 60} tint={isDark ? "dark" : "light"} style={styles.formContainer}>
              <LinearGradient
                colors={isDark 
                  ? ['rgba(30, 41, 59, 0.8)', 'rgba(15, 23, 42, 0.9)'] as any
                  : ['rgba(255, 255, 255, 0.8)', 'rgba(241, 245, 249, 0.9)'] as any}
                style={[
                  styles.form,
                  { borderColor: isDark ? Colors.dark.glassBorder : Colors.light.glassBorder }
                ]}
              >
                <Text style={[styles.label, { color: isDark ? Colors.dark.text : Colors.light.text }]}>Your Name</Text>
                <TextInput
                  style={[
                    styles.input, 
                    { 
                      color: isDark ? Colors.dark.text : Colors.light.text,
                      backgroundColor: isDark ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255, 255, 255, 0.7)',
                      borderColor: isDark ? Colors.dark.inputBorder : Colors.light.inputBorder
                    }
                  ]}
                  value={playerName}
                  onChangeText={setPlayerName}
                  placeholder="Enter your name"
                  placeholderTextColor={isDark ? "rgba(203, 213, 225, 0.6)" : "rgba(71, 85, 105, 0.6)"}
                  maxLength={20}
                  autoCapitalize="words"
                  selectionColor={isDark ? Colors.dark.primary : Colors.light.primary}
                />
                
                <TouchableOpacity
                  style={[
                    styles.button, 
                    !playerName.trim() && styles.buttonDisabled
                  ]}
                  onPress={handleCreateGame}
                  disabled={!playerName.trim() || isLoading}
                >
                  <LinearGradient
                    colors={isDark 
                      ? Gradients.dark.primary as any
                      : Gradients.light.primary as any}
                    style={styles.buttonGradient}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.buttonText}>Create Game</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.secondaryButton,
                    { borderColor: isDark ? Colors.dark.glassBorder : Colors.light.glassBorder }
                  ]}
                  onPress={() => router.back()}
                >
                  <Text style={[styles.secondaryButtonText, { color: isDark ? Colors.dark.text : Colors.light.text }]}>
                    Back
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </BlurView>
            
            <View style={styles.infoContainer}>
              <BlurView intensity={isDark ? 20 : 30} tint={isDark ? "dark" : "light"} style={[
                styles.infoCard,
                { borderColor: isDark ? Colors.dark.glassBorder : Colors.light.glassBorder }
              ]}>
                <Text style={[styles.infoTitle, { color: isDark ? Colors.dark.text : Colors.light.text }]}>How to play:</Text>
                <Text style={[styles.infoText, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                  1. Create a game and share the game ID with a friend
                </Text>
                <Text style={[styles.infoText, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                  2. Your friend can join your game with the game ID
                </Text>
                <Text style={[styles.infoText, { color: isDark ? Colors.dark.textSecondary : Colors.light.textSecondary }]}>
                  3. Play chess in real-time with beautiful pieces!
                </Text>
              </BlurView>
            </View>
          </View>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    borderRadius: 10,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  form: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 25,
    marginBottom: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  secondaryButton: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoCard: {
    padding: 20,
    borderWidth: 1,
    borderRadius: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 8,
  },
});

export default CreateGameScreen; 