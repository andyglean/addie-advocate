"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { ChatPanel } from "../components/Chat";
import { LegalNotice } from "../components/LegalNotice";

export default function HomePage() {
	const [language, setLanguage] = useState<string | null>(null);

	if (!language) {
		return (
			<div className="min-h-screen flex flex-col bg-gray-50">
				{/* Header */}
				<header className="bg-white border-b px-6 py-4">
					<div className="flex items-center gap-3">
						<Image
							src="https://injuryadvocate.ai/wp-content/uploads/2026/01/cropped-addie_favicon.png"
							alt="Addie Avatar"
							width={56}
							height={56}
							className="rounded-full"
						/>
						<div>
							<h1 className="text-xl font-semibold text-gray-900">
								Addie, The Auto Accident Advocate
							</h1>
							<p className="text-sm text-gray-600">
								A free, no-obligation resource to families impacted by an auto accident
							</p>
						</div>
					</div>
				</header>

				{/* Main Content */}
				<main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
					<div className="w-full max-w-2xl text-center space-y-8">
						{/* Logo */}
						<div className="flex justify-center mb-8">
							<Image
								src="/addie_pod_cutout.png"
								alt="Addie Auto Injury Advocate"
								width={200}
								height={200}
							/>
						</div>

						{/* Welcome Text */}
						<div className="space-y-1">
							<p className="text-lg text-gray-700">
								Hello, I'm Addie, Your Auto Accident Advocate.
							</p>
							<p className="text-base text-gray-600">
								Hola, soy Addie, Su Defensora de Accidentes Automovilísticos.
							</p>
						</div>

						{/* Language Selection */}
						<div className="space-y-6 mt-8">
							<p className="text-gray-600">
								Please select your language / Seleccione su idioma
							</p>

							<div className="flex gap-4 justify-center flex-wrap">
								<button
									onClick={() => setLanguage("en")}
									className="bg-white border-2 border-gray-300 text-gray-800 hover:border-teal-500 hover:bg-teal-50 px-8 py-6 text-base rounded-md transition-colors"
								>
									🇺🇸 Start in English
								</button>
								<button
									onClick={() => setLanguage("es")}
									className="bg-white border-2 border-gray-300 text-gray-800 hover:border-teal-500 hover:bg-teal-50 px-8 py-6 text-base rounded-md transition-colors"
								>
									🇲🇽 Comenzar en Español
								</button>
							</div>
						</div>
					</div>
				</main>

				{/* Footer */}
				<footer className="bg-white border-t px-6 py-4">
					<LegalNotice />
				</footer>
			</div>
		);
	}

	// Chat Interface (after language selection)
	return (
		<div className="min-h-screen flex flex-col bg-gray-50">
			{/* Header */}
			<header className="bg-white border-b px-6 py-4 flex items-center justify-between">
				<div className="flex items-center gap-3">
					<Image
						src="https://injuryadvocate.ai/wp-content/uploads/2026/01/cropped-addie_favicon.png"
						alt="Addie Avatar"
						width={56}
						height={56}
						className="rounded-full"
					/>
					<div>
						<h1 className="text-xl font-semibold text-gray-900">
							Addie, The Auto Accident Advocate
						</h1>
						<p className="text-sm text-gray-600">
							A free, no-obligation resource to families impacted by an auto accident
						</p>
						<p className="text-xs text-green-600 flex items-center gap-1 mt-1">
							<span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
							Connected
						</p>
					</div>
				</div>
				<Button
					onClick={() => setLanguage(null)}
					variant="outline"
					className="text-sm"
				>
					Reset
				</Button>
			</header>

			{/* Chat Area */}
			<main className="flex-1 container max-w-4xl py-6 flex flex-col">
				<div className="flex-1">
					<ChatPanel 
						language={language} 
						initialMessage={
							language === "en" 
								? "Hello, I'm Addie the Auto Accident Advocate - I'm here to guide you through what to do after an automobile accident. No cost. No obligation. How may I help you today?" 
								: "Hola, soy Addie, tu defensora en accidentes de auto. Estoy aquí para ayudarte a saber qué hacer después de un accidente. Es gratis y no hay ninguna obligación. ¿En qué te puedo ayudar hoy?"
						}
					/>
				</div>
				<div className="mt-6 pt-6 border-t">
					<LegalNotice />
				</div>
			</main>
		</div>
	);
}

