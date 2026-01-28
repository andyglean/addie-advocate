declare namespace NodeJS {
	interface ProcessEnv {
		NEXT_PUBLIC_SUPABASE_URL: string;
		SUPABASE_SERVICE_ROLE_KEY: string;
		OPENAI_API_KEY: string;
		TWILIO_ACCOUNT_SID: string;
		TWILIO_AUTH_TOKEN: string;
		TWILIO_FROM_NUMBER: string;
		TWILIO_TO_NUMBER: string;
	}
}


