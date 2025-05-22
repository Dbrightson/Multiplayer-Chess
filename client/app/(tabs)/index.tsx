import { StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <StatusBar style="auto" />
      
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={styles.title}>Chess Game</ThemedText>
        <ThemedText style={styles.subtitle}>Real-time Multiplayer</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/create')}
        >
          <ThemedText style={styles.buttonText}>Create New Game</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/join')}
        >
          <ThemedText style={styles.buttonText}>Join Game</ThemedText>
        </TouchableOpacity>
      </ThemedView>
      
      <ThemedView style={styles.footer}>
        <ThemedText style={styles.footerText}>
          Play chess with friends in real-time
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    opacity: 0.7,
  },
  buttonsContainer: {
    width: '100%',
    gap: 20,
  },
  button: {
    backgroundColor: '#4a6ea9',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
  },
  footerText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
