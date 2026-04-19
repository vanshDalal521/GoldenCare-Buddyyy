import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Check configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('⚠️  Email Service: Credentials missing. Email notifications will be simulated.');
    }
  }

  /**
   * Send Medication Reminder Email
   * @param {string} toEmail - Patient's email
   * @param {string} patientName - Patient's name
   * @param {Object} medication - { name, dosage, notes, time }
   */
  async sendMedicationReminder(toEmail, patientName, medication) {
    if (!toEmail) return;

    const mailOptions = {
      from: `"GoldenCare Buddy" <${process.env.EMAIL_USER || 'no-reply@goldencare.ai'}>`,
      to: toEmail,
      subject: `💊 Time for your Medication: ${medication.name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <div style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">GoldenCare Buddy</h1>
            <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0;">Personalized Health Assistant</p>
          </div>
          
          <div style="padding: 32px; background: white;">
            <h2 style="color: #1e293b; margin-top: 0;">Hello, ${patientName}!</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">It is time to take your scheduled medication. Staying consistent is key to your wellness journey.</p>
            
            <div style="background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 24px; margin: 24px 0;">
              <div style="display: flex; align-items: center; margin-bottom: 16px;">
                <span style="font-size: 24px; margin-right: 12px;">💊</span>
                <span style="font-size: 18px; font-weight: 700; color: #1e293b;">${medication.name}</span>
              </div>
              
              <div style="margin-left: 36px;">
                <p style="margin: 4px 0; color: #64748b;"><strong>Dosage:</strong> ${medication.dosage}</p>
                <p style="margin: 4px 0; color: #64748b;"><strong>Time:</strong> ${medication.time}</p>
                ${medication.notes ? `<p style="margin: 12px 0 4px 0; color: #4f46e5; background: #eef2ff; padding: 8px; border-radius: 6px; font-size: 14px;"><strong>Note:</strong> ${medication.notes}</p>` : ''}
              </div>
            </div>
            
            <p style="color: #475569; font-size: 14px; line-height: 1.6;">After taking your medication, please remember to update your <strong>Pillbox</strong> in the app to keep your records current.</p>
            
            <div style="text-align: center; margin-top: 32px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/pillbox" 
                 style="background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">
                Visit My Dashboard
              </a>
            </div>
          </div>
          
          <div style="background: #f1f5f9; padding: 24px; text-align: center;">
            <p style="color: #94a3b8; font-size: 12px; margin: 0;">&copy; 2026 GoldenCare Buddy Health Systems</p>
            <p style="color: #94a3b8; font-size: 11px; margin: 4px 0 0 0;">If you're not the intended recipient of this email, please ignore this message.</p>
          </div>
        </div>
      `
    };

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`[Email Simulation] Medication reminder to ${patientName} (${toEmail}) for ${medication.name}`);
        return { success: true, simulated: true };
      }

      await this.transporter.sendMail(mailOptions);
      console.log(`[Email Service] Medication reminder sent to ${toEmail}`);
      return { success: true };
    } catch (error) {
      console.error('[Email Service] Error sending email:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();
