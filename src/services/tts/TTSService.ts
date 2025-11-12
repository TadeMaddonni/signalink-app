import { Audio } from 'expo-av';
import { buildFullUrl } from '../api/config';
import { MESSAGE_ROUTES } from '../../routes';

class TTSService {
  private sound: Audio.Sound | null = null;

  /**
   * Convert text to speech and play the audio
   */
  async textToSpeech(text: string): Promise<void> {
    try {
      console.log('🔊 Iniciando TTS para texto:', text);

      // Unload previous sound if exists
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }

      // Make API request to TTS endpoint
      const url = buildFullUrl(MESSAGE_ROUTES.TEXT_TO_SPEECH);
      console.log('🌐 TTS URL:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      console.log('📡 TTS Response status:', response.status);
      console.log('📡 TTS Response headers:', {
        contentType: response.headers.get('content-type'),
        contentLength: response.headers.get('content-length'),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ TTS API error response:', errorText);
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
      }

      // Check content type to see if it's JSON or raw audio
      const contentType = response.headers.get('content-type');
      console.log('📦 Content-Type recibido:', contentType);

      let audioUri: string;

      if (contentType?.includes('application/json')) {
        // Response is JSON with base64 audio
        const data = await response.json();
        console.log('✅ TTS API response (JSON):', {
          success: data.success,
          hasData: !!data.data,
          dataLength: data.data?.length,
          dataPreview: data.data?.substring(0, 50) + '...'
        });

        if (!data.success || !data.data) {
          throw new Error('TTS API did not return audio data');
        }

        // The API returns base64 encoded audio in data.data
        const base64Audio = data.data;
        audioUri = `data:audio/mp3;base64,${base64Audio}`;
      } else if (contentType?.includes('audio/')) {
        // Response is raw audio file (mp3, mpeg, etc)
        console.log('🎵 Respuesta es audio directo (no JSON)');
        const blob = await response.blob();
        console.log('📦 Blob recibido:', {
          size: blob.size,
          type: blob.type
        });

        // Convert blob to base64
        const reader = new FileReader();
        const base64Audio = await new Promise<string>((resolve, reject) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            // Remove data URL prefix to get just the base64
            const base64 = result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        console.log('✅ Audio convertido a base64:', {
          length: base64Audio.length,
          preview: base64Audio.substring(0, 50) + '...'
        });

        audioUri = `data:audio/mp3;base64,${base64Audio}`;
      } else {
        throw new Error(`Tipo de contenido no soportado: ${contentType}`);
      }

      console.log('🎵 Audio URI preparado, longitud:', audioUri.length);

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      // Load and play the audio
      console.log('🎵 Cargando audio...');
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUri },
        { shouldPlay: true }
      );

      this.sound = sound;

      // Set up playback status update
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          console.log('✅ Audio reproducido completamente');
          sound.unloadAsync();
          this.sound = null;
        }
      });

      console.log('▶️ Reproduciendo audio...');
    } catch (error) {
      console.error('❌ Error en TTS:', error);
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
      }
      throw error;
    }
  }

  /**
   * Stop current audio playback
   */
  async stopPlayback(): Promise<void> {
    try {
      if (this.sound) {
        await this.sound.stopAsync();
        await this.sound.unloadAsync();
        this.sound = null;
        console.log('⏹️ Reproducción detenida');
      }
    } catch (error) {
      console.error('Error stopping audio:', error);
    }
  }

  /**
   * Check if audio is currently playing
   */
  async isPlaying(): Promise<boolean> {
    try {
      if (this.sound) {
        const status = await this.sound.getStatusAsync();
        return status.isLoaded && status.isPlaying;
      }
      return false;
    } catch (error) {
      console.error('Error checking playback status:', error);
      return false;
    }
  }
}

export default new TTSService();
