import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/Format";
import { KEYS, removePreference, setPreference } from "@/helpers/preferences";
import { useToast } from "@/hooks/use-toast";
import { useEpayco } from "@/hooks/useEpayco";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";

export interface EpaycoCheckoutPlan {
	precio: string;
	periodicidad: string;
	titulo: string;
	comunidad: any;
	currency: "COP" | "USD";
}

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	plan: EpaycoCheckoutPlan | null;
	onSuccess: () => void;
}

export const EpaycoCheckoutModal = ({ open, onOpenChange, plan, onSuccess }: Props) => {
	const { toast } = useToast();
	const { onSubscribe } = useEpayco();
	const { user } = useSelector((state: any) => state.user);

	const [loading, setLoading] = useState(false);
	const [cardNumber, setCardNumber] = useState("");
	const [expMonth, setExpMonth] = useState("");
	const [expYear, setExpYear] = useState("");
	const [cvc, setCvc] = useState("");
	const [cardHolder, setCardHolder] = useState("");
	const [docNumber, setDocNumber] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setCardNumber("");
			setExpMonth("");
			setExpYear("");
			setCvc("");
			setCardHolder("");
			setDocNumber("");
			setAcceptTerms(false);
			setLoading(false);
		}
		onOpenChange(isOpen);
	};

	const isValid =
		!!plan &&
		cardNumber.replace(/\s/g, "").length >= 13 &&
		expMonth.length === 2 &&
		expYear.length === 2 &&
		cvc.length >= 3 &&
		cardHolder.trim().length >= 5 &&
		docNumber.trim().length >= 5 &&
		acceptTerms;

	const handleSubmit = async () => {
		if (!plan || !isValid) return;

		setLoading(true);
		try {
			const result = await onSubscribe({
				precio: plan.precio,
				periodicidad: plan.periodicidad,
				titulo: plan.titulo,
				comunidad: plan.comunidad,
				currency: plan.currency,
				docType: "CC",
				docNumber,
				card: {
					number: cardNumber.replace(/\s/g, ""),
					exp_month: expMonth,
					exp_year: `20${expYear}`,
					cvc,
					card_holder: cardHolder,
					email: user.email,
				},
			});

			if (result?.status === "success") {
				await removePreference(KEYS.EPAYCO_PENDING_REF);
				toast({
					title: "¡Pago aprobado!",
					description: "Tu suscripción ya está activa.",
				});
			} else {
				// Todavía no hay confirmación de ePayco: guardamos la referencia para
				// que el listener de Firebase (FirebaseContext) avise con un toast
				// apenas llegue el resultado real, aunque el usuario ya se haya ido de esta pantalla.
				if (result?.ref_payco) {
					await setPreference(KEYS.EPAYCO_PENDING_REF, result.ref_payco);
				}
				toast({
					title: "Pago en proceso",
					description: "ePayco está confirmando tu pago, te avisaremos cuando esté listo.",
				});
			}

			handleOpenChange(false);
			onSuccess();
		} catch (error: any) {
			console.log(error);
			const backendMessage = error?.data?.error;
			toast({
				title: "No pudimos procesar tu pago",
				description: backendMessage || "Verifica los datos de tu tarjeta e intenta de nuevo.",
				variant: "destructive",
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-sm rounded-xl">
				<DialogTitle className="flex items-center gap-2">
					<CreditCard className="w-5 h-5" />
					Datos de tu tarjeta
				</DialogTitle>

				{plan && (
					<p className="text-sm text-muted-foreground -mt-1">
						{plan.titulo} — {formatCurrency(Number(plan.precio), plan.currency)}
					</p>
				)}

				<div className="!space-y-5 !mt-2">
					<Input
						placeholder="Número de tarjeta"
						inputMode="numeric"
						maxLength={19}
						value={cardNumber}
						onChange={(e) => setCardNumber(e.target.value.replace(/[^\d]/g, ""))}
					/>
					<Input
						placeholder="Nombre del titular"
						value={cardHolder}
						onChange={(e) => setCardHolder(e.target.value)}
					/>
					<div className="grid grid-cols-3 gap-3">
						<Input
							placeholder="MM"
							inputMode="numeric"
							maxLength={2}
							value={expMonth}
							onChange={(e) => setExpMonth(e.target.value.replace(/[^\d]/g, ""))}
						/>
						<Input
							placeholder="AA"
							inputMode="numeric"
							maxLength={2}
							value={expYear}
							onChange={(e) => setExpYear(e.target.value.replace(/[^\d]/g, ""))}
						/>
						<Input
							placeholder="CVC"
							inputMode="numeric"
							maxLength={4}
							value={cvc}
							onChange={(e) => setCvc(e.target.value.replace(/[^\d]/g, ""))}
						/>
					</div>
					<Input
						placeholder="Número de cédula"
						inputMode="numeric"
						value={docNumber}
						onChange={(e) => setDocNumber(e.target.value.replace(/[^\d]/g, ""))}
					/>

					<label className="flex items-start gap-2 text-xs text-muted-foreground">
						<input
							type="checkbox"
							className="mt-0.5"
							checked={acceptTerms}
							onChange={(e) => setAcceptTerms(e.target.checked)}
						/>
						<span>
							Acepto los términos y condiciones y la autorización de datos personales de ePayco. Tu
							tarjeta quedará guardada para renovar automáticamente tu suscripción.
						</span>
					</label>

					<Button
						onClick={handleSubmit}
						disabled={!isValid || loading}
						className="w-full font-semibold py-6 !rounded-xl"
					>
						{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
						Pagar y suscribirme
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
};
