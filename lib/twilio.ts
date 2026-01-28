import { config } from 'dotenv';
import path from 'path';
import Twilio from 'twilio';

// Load .env.local explicitly for scripts
config({ path: path.join(process.cwd(), '.env.local') });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromNumber = process.env.TWILIO_FROM_NUMBER;
const toNumber = process.env.TWILIO_TO_NUMBER;

if (!accountSid || !authToken || !fromNumber || !toNumber) {
	throw new Error('Missing Twilio configuration in environment variables');
}

export const twilioClient = Twilio(accountSid, authToken);

export interface LeadNotification {
	name: string;
	location: string;
	description: string;
	mobileNumber: string;
}

export async function sendLeadNotification(lead: LeadNotification) {
	const message = `
🚗 New Lead from Addie

Name: ${lead.name}
Location: ${lead.location}
Phone: ${lead.mobileNumber}

Description:
${lead.description}
	`.trim();

	try {
		const result = await twilioClient.messages.create({
			body: message,
			from: fromNumber,
			to: toNumber,
		});
		
		console.log('Lead notification sent:', result.sid);
		return { success: true, sid: result.sid };
	} catch (error) {
		console.error('Failed to send lead notification:', error);
		return { success: false, error };
	}
}
