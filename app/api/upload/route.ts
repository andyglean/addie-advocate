import { NextRequest } from "next/server";
import { supabaseAdmin } from "../../../lib/supabase";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
	try {
		const form = await req.formData();
		const file = form.get("file");
		const leadId = form.get("leadId") as string | null;
		if (!(file instanceof File)) {
			return new Response("No file", { status: 400 });
		}
		const ext = file.name.split(".").pop() || "bin";
		const path = `${leadId || "anonymous"}/${crypto.randomUUID()}.${ext}`;
		const array = new Uint8Array(await file.arrayBuffer());
		const { error: uploadErr } = await supabaseAdmin.storage
			.from("documents")
			.upload(path, array, {
				contentType: file.type,
				upsert: false
			});
		if (uploadErr) throw uploadErr;
		const { data: publicURL } = supabaseAdmin.storage.from("documents").getPublicUrl(path);
		// Persist record (URL may be public or signed later)
		await supabaseAdmin.from("documents").insert({
			lead_id: leadId,
			file_url: publicURL.publicUrl,
			type: file.type
		});
		return Response.json({ fileUrl: publicURL.publicUrl });
	} catch (e) {
		return new Response("Upload error", { status: 500 });
	}
}


