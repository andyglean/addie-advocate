export function Header() {
	return (
		<header className="border-b">
			<div className="container flex items-center justify-between py-4">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 rounded-full bg-primary/90" />
					<div>
						<div className="font-semibold">Addie</div>
						<div className="text-sm text-slate-500">Texas Auto Injury Advocate</div>
					</div>
				</div>
				<a className="text-sm text-primary underline" href="/intake">Start Intake</a>
			</div>
		</header>
	);
}

