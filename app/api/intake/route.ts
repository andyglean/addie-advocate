import { NextRequest } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, phone, email, zip, ...intake } = body ?? {};
		const { data: lead, error: leadErr } = await supabaseAdmin
			.from("leads")
			.insert({ name, phone, email, zip })
			.select("id")
			.single();
		if (leadErr) throw leadErr;
		const leadId = lead.id;
		const { error: intakeErr } = await supabaseAdmin.from("intake_submissions").insert({
			lead_id: leadId,
			accident_datetime: intake.accident_datetime || null,
			location: intake.location || null,
			weather: intake.weather || null,
			fault_view: intake.fault_view || null,
			injuries_text: intake.injuries_text || null,
			treatment_started: !!intake.treatment_started,
			insurance_info: intake.insurance_info ? { text: intake.insurance_info } : null
		});
		if (intakeErr) throw intakeErr;
		return Response.json({ leadId });
	} catch (e) {
		return new Response("Intake error", { status: 500 });
	}
}


