import Twilio from 'twilio';

// Get config at runtime, not at import time
function getConfig() {
	const accountSid = process.env.TWILIO_ACCOUNT_SID;
	const authToken = process.env.TWILIO_AUTH_TOKEN;
	const fromNumber = process.env.TWILIO_FROM_NUMBER;
	const toNumber = process.env.TWILIO_TO_NUMBER;
	
	return { accountSid, authToken, fromNumber, toNumber };
}

// Lazy initialization of Twilio client
let twilioClient: ReturnType<typeof Twilio> | null = null;

function getTwilioClient() {
	if (!twilioClient) {
		const { accountSid, authToken } = getConfig();
		if (!accountSid || !authToken) {
			console.warn('Twilio credentials not configured');
			return null;
		}
		twilioClient = Twilio(accountSid, authToken);
	}
	return twilioClient;
}

export interface LeadNotification {
	name: string;
	location: string;
	description: string;
	mobileNumber: string;
}

export async function sendLeadNotification(lead: LeadNotification) {
	const { fromNumber, toNumber } = getConfig();
	const client = getTwilioClient();
	
	if (!client || !fromNumber || !toNumber) {
		console.warn('Twilio not configured, skipping notification');
		return { success: false, error: 'Twilio not configured' };
	}

	const message = `
🚗 New Lead from Addie

Name: ${lead.name}
Location: ${lead.location}
Phone: ${lead.mobileNumber}

Description:
${lead.description}
	`.trim();

	try {
		const result = await client.messages.create({
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
