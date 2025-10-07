import { TranslationResult, TranslationService as ITranslationService } from '../../types';

export class TranslationService implements ITranslationService {
  private static instance: TranslationService;
  
  // Mock sign language dictionary
  private signLanguageDictionary = {
    'hello': { es: 'Hola', en: 'Hello' },
    'thank_you': { es: 'Gracias', en: 'Thank you' },
    'yes': { es: 'Sí', en: 'Yes' },
    'no': { es: 'No', en: 'No' },
    'please': { es: 'Por favor', en: 'Please' },
    'sorry': { es: 'Lo siento', en: 'Sorry' },
    'goodbye': { es: 'Adiós', en: 'Goodbye' },
    'water': { es: 'Agua', en: 'Water' },
    'food': { es: 'Comida', en: 'Food' },
    'help': { es: 'Ayuda', en: 'Help' },
    'time': { es: 'Tiempo', en: 'Time' },
    'family': { es: 'Familia', en: 'Family' },
    'love': { es: 'Amor', en: 'Love' },
    'happy': { es: 'Feliz', en: 'Happy' },
    'sad': { es: 'Triste', en: 'Sad' },
  };

  private constructor() {}

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  // Translate sign language gesture to text
  async translate(text: string, targetLanguage: string): Promise<TranslationResult> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const gesture = text.toLowerCase();
      const translation = this.signLanguageDictionary[gesture as keyof typeof this.signLanguageDictionary];
      
      if (translation && translation[targetLanguage as keyof typeof translation]) {
        return {
          text: translation[targetLanguage as keyof typeof translation],
          language: targetLanguage,
          confidence: Math.random() * 0.1 + 0.9, // 90-100% confidence
        };
      }
      
      // If gesture not found, return detected confidence
      return {
        text: `[Unknown gesture: ${gesture}]`,
        language: targetLanguage,
        confidence: 0.5,
      };
    } catch (error) {
      console.error('Translation error:', error);
      return {
        text: 'Translation error',
        language: targetLanguage,
        confidence: 0,
      };
    }
  }

  // Detect language from input text
  async detectLanguage(text: string): Promise<string> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Simple language detection based on character analysis
      const spanishChars = /ñ|¿|¡/i;
      const englishChars = /th|sh|ch/i;
      
      if (spanishChars.test(text)) {
        return 'es';
      } else if (englishChars.test(text)) {
        return 'en';
      }
      
      // Default to Spanish for Signalink users
      return 'es';
    } catch (error) {
      console.error('Language detection error:', error);
      return 'es';
    }
  }

  // Get available languages
  getAvailableLanguages(): string[] {
    return ['es', 'en'];
  }

  // Get language name
  getLanguageName(languageCode: string): string {
    const names = {
      'es': 'Español',
      'en': 'English',
    };
    return names[languageCode as keyof typeof names] || languageCode;
  }

  // Translate text to sign language gesture
  async textToGesture(text: string, targetLanguage: string = 'en'): Promise<string | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const normalizedText = text.toLowerCase().trim();
      
      // Find gesture in dictionary
      for (const [gesture, translations] of Object.entries(this.signLanguageDictionary)) {
        if (translations[targetLanguage as keyof typeof translations]?.toLowerCase().includes(normalizedText)) {
          return gesture;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Text to gesture conversion error:', error);
      return null;
    }
  }

  // Batch translate multiple gestures
  async batchTranslate(gestures: string[], targetLanguage: string): Promise<TranslationResult[]> {
    try {
      const promises = gestures.map(gesture => this.translate(gesture, targetLanguage));
      return await Promise.all(promises);
    } catch (error) {
      console.error('Batch translation error:', error);
      return gestures.map(gesture => ({
        text: 'Translation error',
        language: targetLanguage,
        confidence: 0,
      }));
    }
  }

  // Simulate real-time translation from glove data
  public simulateRealTimeTranslation(gesture: string, targetLanguage: string = 'es'): TranslationResult {
    const translation = this.signLanguageDictionary[gesture as keyof typeof this.signLanguageDictionary];
    
    return {
      text: translation?.[targetLanguage as keyof typeof translation] || `[Gesture: ${gesture}]`,
      language: targetLanguage,
      confidence: Math.random() * 0.1 + 0.85, // 85-95% confidence
    };
  }
}
