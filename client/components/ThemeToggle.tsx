import React from 'react';
import { TouchableOpacity, StyleSheet, Animated, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useThemeContext';

interface ThemeToggleProps {
  size?: number;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ size = 30 }) => {
  const { isDark, toggleTheme } = useTheme();
  const animatedValue = React.useRef(new Animated.Value(isDark ? 1 : 0)).current;
  
  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark, animatedValue]);
  
  const sunScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  
  const moonScale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  
  const sunOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });
  
  const moonOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });
  
  const sunTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -size],
  });
  
  const moonTranslate = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [size, 0],
  });
  
  // Glow effect animation
  const glowOpacity = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 0.3, 0.8],
  });

  return (
    <TouchableOpacity
      style={[styles.container, { width: size * 1.5, height: size * 1.5 }]}
      onPress={toggleTheme}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Animated.View
          style={[
            styles.iconWrapper,
            styles.sunGlow,
            {
              opacity: sunOpacity,
              transform: [{ scale: sunScale }, { translateX: sunTranslate }],
            },
          ]}
        >
          <Ionicons name="sunny" size={size} color="#FFD700" />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.iconWrapper,
            styles.moonGlow,
            {
              opacity: moonOpacity,
              transform: [{ scale: moonScale }, { translateX: moonTranslate }],
            },
          ]}
        >
          <Ionicons name="moon" size={size} color="#FFFFFF" />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    overflow: 'hidden',
  },
  iconContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sunGlow: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  moonGlow: {
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
});

export default ThemeToggle; 