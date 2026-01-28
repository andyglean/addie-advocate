import { Header } from "../../components/Header";
import { IntakeWizard } from "../../components/IntakeWizard";

export default function IntakePage() {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<main className="container py-6 flex-1">
				<IntakeWizard />
			</main>
		</div>
	);
}

