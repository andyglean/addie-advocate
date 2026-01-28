"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

type IntakeData = {
  name: string;
  phone: string;
  email: string;
  zip: string;
  accident_datetime: string;
  location: string;
  weather: string;
  fault_view: string;
  injuries_text: string;
  treatment_started: boolean;
  insurance_info: string;
};

export function IntakeWizard() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<IntakeData>({
    name: "",
    phone: "",
    email: "",
    zip: "",
    accident_datetime: "",
    location: "",
    weather: "",
    fault_view: "",
    injuries_text: "",
    treatment_started: false,
    insurance_info: ""
  });

  function update<K extends keyof IntakeData>(k: K, v: IntakeData[K]) {
    setData((d) => ({ ...d, [k]: v }));
  }

  async function submit() {
    setLoading(true);
    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) throw new Error("Failed");
      setStep(step + 1);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accident Intake</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600">Name</label>
                <Input value={data.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Phone</label>
                <Input value={data.phone} onChange={(e) => update("phone", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Email</label>
                <Input value={data.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">ZIP</label>
                <Input value={data.zip} onChange={(e) => update("zip", e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setStep(1)}>Next</Button>
            </div>
          </>
        )}
        {step === 1 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-slate-600">Accident Date & Time</label>
                <Input
                  type="datetime-local"
                  value={data.accident_datetime}
                  onChange={(e) => update("accident_datetime", e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm text-slate-600">Location (City)</label>
                <Input value={data.location} onChange={(e) => update("location", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Weather</label>
                <Input value={data.weather} onChange={(e) => update("weather", e.target.value)} />
              </div>
              <div>
                <label className="text-sm text-slate-600">Who do you think was at fault?</label>
                <Input value={data.fault_view} onChange={(e) => update("fault_view", e.target.value)} />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
              <Button onClick={() => setStep(2)}>Next</Button>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <div>
              <label className="text-sm text-slate-600">Describe injuries and symptoms</label>
              <Textarea
                value={data.injuries_text}
                onChange={(e) => update("injuries_text", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Have you started treatment? (Yes/No)</label>
              <Input
                value={data.treatment_started ? "Yes" : "No"}
                onChange={(e) => update("treatment_started", e.target.value.toLowerCase().startsWith("y"))}
              />
            </div>
            <div>
              <label className="text-sm text-slate-600">Insurance info (your/other driver)</label>
              <Textarea
                value={data.insurance_info}
                onChange={(e) => update("insurance_info", e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Next</Button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="text-sm text-slate-700">
              Thanks! Submit your intake and we’ll follow up.
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={submit} disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </>
        )}
        {step > 3 && (
          <div className="text-sm text-green-700">
            Submitted. We'll reach out shortly. You can continue chatting with Addie.
          </div>
        )}
      </CardContent>
    </Card>
  );
}


