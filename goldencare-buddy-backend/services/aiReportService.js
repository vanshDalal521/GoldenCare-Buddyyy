import axios from 'axios';
import fs from 'fs/promises';
import path from 'path';

class AIReportService {
  constructor() {
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    console.log('[AIReportService] Initialized. Key present:', !!this.geminiApiKey);
    if (!this.geminiApiKey || this.geminiApiKey.includes('YOUR_KEY_HERE')) {
      this.geminiApiKey = null;
    }
  }

  /**
   * Analyze a medical record using Google Gemini 1.5 Flash
   * @param {Object} record - The MedicalRecord document
   * @returns {Object} - { explanation, medications }
   */
  async analyzeRecord(record) {
    if (!this.geminiApiKey) {
      console.warn('[AIReportService] No Gemini API key found. Using smart simulation mode.');
      return this.getSmartSimulation(record);
    }

    try {
      const fileExt = path.extname(record.filePath).toLowerCase();
      let parts = [];

      // Add the professional clinical prompt
      parts.push({ text: this.getProfessionalPrompt() });

      if (['.jpg', '.jpeg', '.png', '.pdf'].includes(fileExt)) {
        // Handle Image and PDF natively with Gemini
        const fileData = await fs.readFile(record.filePath);
        const base64Data = fileData.toString('base64');
        let mimeType = 'application/pdf';
        
        if (fileExt === '.png') mimeType = 'image/png';
        if (['.jpg', '.jpeg'].includes(fileExt)) mimeType = 'image/jpeg';
        
        parts.push({
          inline_data: {
            mime_type: mimeType,
            data: base64Data
          }
        });
      } else {
        // Handle Text/PDF (Simplified: Read as text if possible)
        let text = "";
        try {
          text = await fs.readFile(record.filePath, 'utf8');
        } catch (e) {
          text = `[Document Metadata: ${record.title}. Please analyze based on the title and any visible text structure.]`;
        }
        parts.push({ text: `REPORT CONTENT:\n${text}` });
      }

      console.log('[AIReportService] Calling Gemini API (v1 - gemini-2.0-flash)...');
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${this.geminiApiKey}`,
        {
          contents: [{ parts }],
          generationConfig: {
            temperature: 0.1,
            topP: 0.95,
            topK: 64,
            maxOutputTokens: 2048
          }
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('[AIReportService] Gemini Response received.');
      let resultText = response.data.candidates[0].content.parts[0].text;
      
      // Clean potential Markdown wrapping (Gemini often wraps JSON in ```json blocks)
      if (resultText.includes('```json')) {
        resultText = resultText.split('```json')[1].split('```')[0];
      } else if (resultText.includes('```')) {
        resultText = resultText.split('```')[1].split('```')[0];
      }
      
      const result = JSON.parse(resultText.trim());
      console.log('[AIReportService] Parsed Result successfully.');

      return {
        explanation: result.explanation || "No explanation provided.",
        medications: result.medications || []
      };

    } catch (error) {
      console.error('Error in Gemini AI Analysis:', error.response?.data || error.message);
      // Fallback to simulation if there's an API error
      return this.getSmartSimulation(record);
    }
  }

  getProfessionalPrompt() {
    return `You are a world-class Clinical Resident and Patient Advocate. 
Your goal is to decipher and interpret this medical report for a patient to help them understand it clearly without being overwhelmed.

CRITICAL INSTRUCTIONS:
1. DECIPHER HANDWRITING: If this is an image, pay extreme attention to deciphering doctor handwriting accurately.
2. EXPLANATION STRUCTURE: Use Markdown to create a professional, structured explanation in the "explanation" field:
   - Use headings (###) for sections like "Summary", "What it means", and "Next Steps".
   - Use bolding for important values or terms.
   - Use bullet points for findings.
3. TONE: Empathetic, calm, and clinically precise but accessible.
4. LANGUAGE: Simple, plain English. Avoid or explain complex jargon.
5. JSON FORMAT: You MUST return a JSON object with exactly these two keys:
   - "explanation": (A string containing your structured Markdown explanation)
   - "medications": (An array of objects, each with "name", "dosage", "frequency", and "notes")

EXAMPLE FORMAT:
{
 "explanation": "### Summary\\nYour blood tests show that your **Iron levels are slightly low**...\\n\\n### Key Findings\\n- Iron: 12 (Borderline low)\\n- Energy: You may feel tired...\\n\\n### Next Steps\\n1. Take the iron supplement... 2. Follow up in 4 weeks.",
 "medications": [{ "name": "Ferrous Sulfate", "dosage": "325mg", "frequency": "Once daily", "notes": "Take with Vitamin C for absorption" }]
}`;
  }

  /**
   * Smart simulation fallback that looks at the record's metadata
   */
  getSmartSimulation(record) {
    const title = record.title || "General Medical Report";
    const desc = record.description || "Medical assessment details.";
    
    return {
      explanation: `### Smart Simulation (API Key Required for Live Analysis)\n\nBased on the title **"${title}"**, this appears to be a medical record related to your healthcare journey.\n\n**What this means:**\nIn a real analysis, the AI would decipher the specific handwriting and clinical values in this document. Given the context of "${desc}", this document likely contains important diagnostic or prescription information.\n\n### Clinical Advice\n- Ensure you follow your doctor's official instructions mentioned in the physical copy.\n- Keep this record organized for future visits.\n\n*Note: Add a valid Gemini API Key to the .env file to enable live AI handwriting recognition.*`,
      medications: [
        {
          name: "Sample Medication",
          dosage: "100mg",
          frequency: "See full report",
          notes: "Live analysis pending API key"
        }
      ]
    };
  }
}

export default new AIReportService();
