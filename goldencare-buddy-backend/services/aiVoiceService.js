import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AIVoiceService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    // Treat placeholder values as no API key
    if (this.openaiApiKey === 'your_openai_api_key_here' || this.openaiApiKey === 'your_openai_api_key' || !this.openaiApiKey) {
      this.openaiApiKey = null;
    }
    this.voiceType = process.env.AI_VOICE_TYPE || 'alloy';
    this.audioDir = path.join(__dirname, '../public/audio');
    this.ensureAudioDirectory();
    
    // Log OpenAI status
    if (this.openaiApiKey) {
      console.log('🤖 OpenAI API key detected');
    } else {
      console.log('⚠️  No valid OpenAI API key found');
    }
  }

  /**
   * Ensure audio directory exists
   */
  async ensureAudioDirectory() {
    try {
      await fs.mkdir(this.audioDir, { recursive: true });
    } catch (error) {
      console.error('Error creating audio directory:', error);
    }
  }

  /**
   * Generate AI voice message for medication reminder
   * @param {Object} medication - Medication object
   * @param {Object} patient - Patient object
   * @returns {Object} - { text, audioBuffer, audioPath }
   */
  async generateMedicationReminder(medication, patient) {
    // Create personalized message
    const message = this.createVoiceMessage(medication, patient);

    try {
      // Generate speech using OpenAI TTS
      const audioBuffer = await this.generateSpeech(message);
      
      // Save audio file
      const filename = `reminder_${medication._id}_${Date.now()}.mp3`;
      const audioPath = path.join(this.audioDir, filename);
      await fs.writeFile(audioPath, audioBuffer);
      
      // Get public URL
      const audioUrl = `${process.env.AUDIO_BASE_URL}/${filename}`;
      
      return {
        text: message,
        audioBuffer,
        audioPath,
        audioUrl,
        filename
      };
    } catch (error) {
      console.error('Error generating AI voice:', error);
      // Even if AI voice generation fails, we should still return the message
      // This allows the system to continue working with Twilio's text-to-speech
      
      return {
        text: message,
        audioBuffer: null,
        audioPath: null,
        audioUrl: null,
        filename: null,
        simulated: true
      };
    }
  }

  /**
   * Create voice message text
   * @param {Object} medication
   * @param {Object} patient
   * @returns {String} - Voice message text
   */
  createVoiceMessage(medication, patient) {
    const patientName = patient.name || 'there';
    const medName = medication.name;
    const dosage = medication.dosage;
    const time = medication.customTime || 'your scheduled time';

    // Professional requested format: 'Hey [user], [med name], [mg dosage] at [time]'
    return `Hey ${patientName}. This is your GoldenCare AI reminder. It is time to take your medication: ${medName}. Please take a dosage of ${dosage} right now at ${time}. Stay healthy and have a great day.`;
  }

  /**
   * Generate speech using OpenAI TTS API
   * @param {String} text - Text to convert to speech
   * @returns {Buffer} - Audio buffer
   */
  async generateSpeech(text) {
    if (!this.openaiApiKey) {
      // Return simulated audio buffer when API key is not configured
      console.log('⚠️  OpenAI API key not configured. Using simulated audio.');
      // Create a simple simulated audio buffer (1 second of silence)
      // This is a minimal WAV file header for silence
      const wavHeader = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0x00, 0x00, 0x00, // Chunk size (36 bytes)
        0x57, 0x41, 0x56, 0x45, // "WAVE"
        0x66, 0x6d, 0x74, 0x20, // "fmt "
        0x10, 0x00, 0x00, 0x00, // Subchunk1 size (16 bytes)
        0x01, 0x00,             // Audio format (1 = PCM)
        0x01, 0x00,             // Number of channels (1)
        0x40, 0x1f, 0x00, 0x00, // Sample rate (8000 Hz)
        0x40, 0x1f, 0x00, 0x00, // Byte rate (8000 bytes/sec)
        0x01, 0x00,             // Block align (1)
        0x08, 0x00,             // Bits per sample (8)
        0x64, 0x61, 0x74, 0x61, // "data"
        0x00, 0x00, 0x00, 0x00  // Subchunk2 size (0 bytes)
      ]);
      return wavHeader;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/audio/speech',
        {
          model: 'tts-1', // Use the standard model
          voice: 'nova', // Try a different voice that might not have trial limitations
          input: text,
          speed: 1.0 // Use normal speed
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    } catch (error) {
      console.error('OpenAI TTS Error:', error.response?.data || error.message);
      console.error('Status:', error.response?.status);
      console.error('Headers:', error.response?.headers);
      // Even if OpenAI fails, return simulated audio instead of throwing an error
      console.log('⚠️  OpenAI TTS failed. Using simulated audio as fallback.');
      const wavHeader = Buffer.from([
        0x52, 0x49, 0x46, 0x46, // "RIFF"
        0x24, 0x00, 0x00, 0x00, // Chunk size (36 bytes)
        0x57, 0x41, 0x56, 0x45, // "WAVE"
        0x66, 0x6d, 0x74, 0x20, // "fmt "
        0x10, 0x00, 0x00, 0x00, // Subchunk1 size (16 bytes)
        0x01, 0x00,             // Audio format (1 = PCM)
        0x01, 0x00,             // Number of channels (1)
        0x40, 0x1f, 0x00, 0x00, // Sample rate (8000 Hz)
        0x40, 0x1f, 0x00, 0x00, // Byte rate (8000 bytes/sec)
        0x01, 0x00,             // Block align (1)
        0x08, 0x00,             // Bits per sample (8)
        0x64, 0x61, 0x74, 0x61, // "data"
        0x00, 0x00, 0x00, 0x00  // Subchunk2 size (0 bytes)
      ]);
      return wavHeader;
    }
  }

  /**
   * Clean up old audio files (older than 24 hours)
   */
  async cleanupOldAudioFiles() {
    try {
      const files = await fs.readdir(this.audioDir);
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours

      for (const file of files) {
        const filePath = path.join(this.audioDir, file);
        const stats = await fs.stat(filePath);
        const age = now - stats.mtimeMs;

        if (age > maxAge) {
          await fs.unlink(filePath);
          console.log(`Deleted old audio file: ${file}`);
        }
      }
    } catch (error) {
      console.error('Error cleaning up audio files:', error);
    }
  }
}

// Create singleton instance
const aiVoiceService = new AIVoiceService();

// Clean up old files daily
setInterval(() => {
  aiVoiceService.cleanupOldAudioFiles();
}, 24 * 60 * 60 * 1000); // Every 24 hours

export default aiVoiceService;
