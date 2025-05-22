/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

/**
 * Color system for the chess application with improved gradients and contrast
 */

// Theme colors
export const Colors = {
  light: {
    // Base colors
    primary: '#6366F1',
    secondary: '#8B5CF6',
    accent: '#EC4899',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    
    // Text colors
    text: '#1E293B',
    textSecondary: '#475569',
    textHint: '#94A3B8',
    
    // Game specific colors
    lightSquare: '#F1F5F9',
    darkSquare: '#CBD5E1',
    selectedSquare: 'rgba(99, 102, 241, 0.6)',
    validMove: 'rgba(74, 222, 128, 0.5)',
    lastMove: 'rgba(250, 204, 21, 0.4)',
    
    // Status colors
    success: '#22C55E',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
    
    // UI elements
    card: 'rgba(255, 255, 255, 0.9)',
    cardBorder: 'rgba(203, 213, 225, 0.8)',
    input: 'rgba(255, 255, 255, 1)',
    inputBorder: 'rgba(203, 213, 225, 0.8)',
    
    // Glassmorphism
    glass: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.5)',
    
    // Shadows
    shadowColor: '#64748B',
    shadowOpacity: 0.1,
  },
  
  dark: {
    // Base colors
    primary: '#818CF8',
    secondary: '#A78BFA',
    accent: '#F472B6',
    background: '#0F172A',
    surface: '#1E293B',
    
    // Text colors
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textHint: '#64748B',
    
    // Game specific colors
    lightSquare: '#334155',
    darkSquare: '#1E293B',
    selectedSquare: 'rgba(129, 140, 248, 0.6)',
    validMove: 'rgba(74, 222, 128, 0.4)',
    lastMove: 'rgba(250, 204, 21, 0.3)',
    
    // Status colors
    success: '#4ADE80',
    error: '#F87171',
    warning: '#FBBF24',
    info: '#60A5FA',
    
    // UI elements
    card: 'rgba(30, 41, 59, 0.9)',
    cardBorder: 'rgba(51, 65, 85, 0.8)',
    input: 'rgba(30, 41, 59, 1)',
    inputBorder: 'rgba(51, 65, 85, 0.8)',
    
    // Glassmorphism
    glass: 'rgba(15, 23, 42, 0.75)',
    glassBorder: 'rgba(51, 65, 85, 0.3)',
    
    // Shadows
    shadowColor: '#000000',
    shadowOpacity: 0.3,
  },
};

// Gradients
export const Gradients = {
  light: {
    primary: ['#6366F1', '#4F46E5'],
    secondary: ['#8B5CF6', '#7C3AED'],
    accent: ['#EC4899', '#DB2777'],
    background: ['#F8FAFC', '#EFF6FF'],
    surface: ['#FFFFFF', '#F1F5F9'],
    success: ['#22C55E', '#16A34A'],
    error: ['#EF4444', '#DC2626'],
    warning: ['#F59E0B', '#D97706'],
    info: ['#3B82F6', '#2563EB'],
    board: ['#F1F5F9', '#E2E8F0'],
  },
  
  dark: {
    primary: ['#818CF8', '#6366F1'],
    secondary: ['#A78BFA', '#8B5CF6'],
    accent: ['#F472B6', '#EC4899'],
    background: ['#0F172A', '#1E293B'],
    surface: ['#1E293B', '#334155'],
    success: ['#4ADE80', '#22C55E'],
    error: ['#F87171', '#EF4444'],
    warning: ['#FBBF24', '#F59E0B'],
    info: ['#60A5FA', '#3B82F6'],
    board: ['#334155', '#1E293B'],
  },
};
