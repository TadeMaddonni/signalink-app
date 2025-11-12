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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ TTS API error response:', errorText);
        throw new Error(`TTS API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ TTS API response:', data);

      if (!data.success || !data.data) {
        throw new Error('TTS API did not return audio data');
      }

      // The API returns base64 encoded audio in data.data
      const base64Audio = data.data;

      // Convert base64 to data URI for expo-av
      const audioUri = `data:audio/mp3;base64,${base64Audio}`;

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
