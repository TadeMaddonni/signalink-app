import { Theme } from '../types';

export const defaultTheme: Theme = {
  colors: {
    primary: '#f99f12', // Orange from Figma design
    secondary: '#64748b',
    background: '#000000', // Black background from Figma
    surface: '#1a1a1a',
    text: '#ffffff',
    border: '#374151',
    error: '#ef4444',
    success: '#10b981',
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '600',
      fontFamily: 'Inter-Medium',
      letterSpacing: -1.6,
    },
    h2: {
      fontSize: 24,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
      letterSpacing: -1.2,
    },
    h3: {
      fontSize: 18,
      fontWeight: '500',
      fontFamily: 'Inter-Medium',
      letterSpacing: -0.9,
    },
    body: {
      fontSize: 16,
      fontWeight: '300',
      fontFamily: 'Inter-Light',
      letterSpacing: -0.8,
    },
    caption: {
      fontSize: 14,
      fontWeight: '300',
      fontFamily: 'Inter-Light',
      letterSpacing: -0.7,
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
};

// Utility functions for consistent styling
export const getShadowStyle = (shadowColor: string = '#f99f12') => ({
  shadowColor,
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.15,
  shadowRadius: 12,
  elevation: 5,
});

export const textShadowStyle = {
  textShadowColor: '#d2981d',
  textShadowOffset: { width: 0, height: 0.4 },
  textShadowRadius: 10,
};
