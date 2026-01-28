import { NextRequest, NextResponse } from "next/server";
import { sendLeadNotification } from "../../../lib/twilio";
import { supabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const { name, location, description, mobileNumber, conversationId } = await req.json();

		// Validate required fields
		if (!name || !location || !description || !mobileNumber) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Send Twilio notification
		const result = await sendLeadNotification({
			name,
			location,
			description,
			mobileNumber,
		});

		if (!result.success) {
			console.error("Failed to send notification:", result.error);
			// Don't fail the request if SMS fails
		}

		// Store lead in database
		const { data: lead, error: leadError } = await supabaseAdmin
			.from("leads")
			.insert({
				name,
				phone: mobileNumber,
				zip: location, // Using location field for now
			})
			.select()
			.single();

		if (leadError) {
			console.error("Failed to save lead:", leadError);
		}

		// Link conversation to lead if we have a conversation ID
		if (lead && conversationId) {
			await supabaseAdmin
				.from("conversations")
				.update({ lead_id: lead.id })
				.eq("id", conversationId);
		}

		return NextResponse.json({
			success: true,
			notificationSent: result.success,
			leadId: lead?.id,
		});
	} catch (error) {
		console.error("Error in notify-lead endpoint:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
