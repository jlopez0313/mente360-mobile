import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/helpers/Format";
import { KEYS, removePreference, setPreference } from "@/helpers/preferences";
import { useToast } from "@/hooks/use-toast";
import { useEpayco } from "@/hooks/useEpayco";
import { setUser } from "@/store/slices/userSlice";
import { AlertCircle, CheckCircle2, Clock, CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

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
	const dispatch = useDispatch();
	const { toast } = useToast();
	const { onSubscribe } = useEpayco();
	const { user } = useSelector((state: any) => state.user);

	const [statusState, setStatusState] = useState<"form" | "loading" | "success" | "pending" | "error">("form");
	const [errorMessage, setErrorMessage] = useState("");

	const [cardNumber, setCardNumber] = useState("");
	const [expMonth, setExpMonth] = useState("");
	const [expYear, setExpYear] = useState("");
	const [cvc, setCvc] = useState("");
	const [cardHolder, setCardHolder] = useState("");
	const defaultDocType = user?.country && user.country !== "CO" ? "PP" : "CC";
	const [docType, setDocType] = useState<string>(defaultDocType);
	const [docNumber, setDocNumber] = useState("");
	const [acceptTerms, setAcceptTerms] = useState(false);

	const handleOpenChange = (isOpen: boolean) => {
		if (!isOpen) {
			setCardNumber("");
			setExpMonth("");
			setExpYear("");
			setCvc("");
			setCardHolder("");
			setDocType(defaultDocType);
			setDocNumber("");
			setAcceptTerms(false);
			setStatusState("form");
			setErrorMessage("");
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
		docNumber.trim().length >= 4 &&
		acceptTerms;

	const handleComplete = () => {
		handleOpenChange(false);
		onSuccess();
	};

	const handleSubmit = async () => {
		if (!plan || !isValid) return;

		setStatusState("loading");
		setErrorMessage("");

		try {
			const result = await onSubscribe({
				precio: plan.precio,
				periodicidad: plan.periodicidad,
				titulo: plan.titulo,
				comunidad: plan.comunidad,
				currency: plan.currency,
				docType: docType || "CC",
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

				// Actualizar estado en Redux local de inmediato
				const hoy = new Date();
				const nextMonth = new Date();
				nextMonth.setMonth(nextMonth.getMonth() + 1);

				if (plan.comunidad) {
					const currentSubs = Array.isArray(user?.suscripciones) ? user.suscripciones : [];
					const updatedSubs = [
						...currentSubs.filter((s: any) => s.id != plan.comunidad),
						{
							id: plan.comunidad,
							comunidad: "",
							pivot: {
								comunidades_id: plan.comunidad,
								fecha_pago: hoy.toISOString(),
								fecha_vencimiento: nextMonth.toISOString(),
								users_id: user?.id,
								precio: plan.precio,
							},
						},
					];
					dispatch(setUser({ suscripciones: updatedSubs }));
				} else {
					// Suscripción general de Mente360
					dispatch(
						setUser({
							has_paid: 1,
							fecha_vencimiento: nextMonth.toISOString(),
							ref_status: "success",
						})
					);
				}

				toast({
					title: "¡Pago aprobado!",
					description: "Tu suscripción ya está activa.",
				});
				setStatusState("success");
			} else {
				if (result?.ref_payco) {
					await setPreference(KEYS.EPAYCO_PENDING_REF, result.ref_payco);
				}
				toast({
					title: "Pago en proceso",
					description: "ePayco está confirmando tu pago, te avisaremos cuando esté listo.",
				});
				setStatusState("pending");
			}
		} catch (error: any) {
			console.log("Error al procesar pago:", error);
			const backendMessage =
				error?.data?.error ||
				error?.data?.description ||
				error?.data?.message ||
				error?.description ||
				error?.message ||
				"Verifica los datos de tu tarjeta e intenta de nuevo.";

			setErrorMessage(backendMessage);
			setStatusState("error");
			toast({
				title: "No pudimos procesar tu pago",
				description: backendMessage,
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="max-w-sm rounded-2xl p-6">
				{statusState === "loading" && (
					<div className="py-8 flex flex-col items-center justify-center text-center space-y-4">
						<div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
							<Loader2 className="w-8 h-8 text-primary animate-spin" />
						</div>
						<div className="space-y-1">
							<h3 className="font-heading font-bold text-lg text-foreground">
								Procesando tu pago...
							</h3>
							<p className="text-sm text-muted-foreground">
								Estamos comunicándonos de forma segura con ePayco. Por favor espera un momento.
							</p>
						</div>
					</div>
				)}

				{statusState === "success" && (
					<div className="py-4 flex flex-col items-center justify-center text-center space-y-4">
						<div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
							<CheckCircle2 className="w-10 h-10" />
						</div>
						<div className="space-y-1">
							<h3 className="font-heading font-bold text-xl text-foreground">
								¡Pago Aprobado!
							</h3>
							<p className="text-sm text-muted-foreground">
								Tu suscripción ha sido activada exitosamente. Ya tienes acceso completo al contenido.
							</p>
						</div>
						<Button
							onClick={handleComplete}
							className="w-full font-semibold py-6 rounded-xl mt-2 gradient-primary"
						>
							Continuar
						</Button>
					</div>
				)}

				{statusState === "pending" && (
					<div className="py-4 flex flex-col items-center justify-center text-center space-y-4">
						<div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
							<Clock className="w-10 h-10" />
						</div>
						<div className="space-y-1">
							<h3 className="font-heading font-bold text-xl text-foreground">
								Pago en Proceso
							</h3>
							<p className="text-sm text-muted-foreground">
								ePayco está confirmando tu transacción. Te notificaremos en la app apenas esté lista.
							</p>
						</div>
						<Button
							onClick={handleComplete}
							variant="outline"
							className="w-full font-semibold py-6 rounded-xl mt-2"
						>
							Entendido
						</Button>
					</div>
				)}

				{statusState === "error" && (
					<div className="py-4 flex flex-col items-center justify-center text-center space-y-4">
						<div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
							<AlertCircle className="w-10 h-10" />
						</div>
						<div className="space-y-1">
							<h3 className="font-heading font-bold text-xl text-foreground">
								No pudimos procesar tu pago
							</h3>
							<p className="text-sm text-muted-foreground">
								{errorMessage || "Verifica los datos de tu tarjeta e intenta nuevamente."}
							</p>
						</div>
						<div className="w-full flex gap-2 pt-2">
							<Button
								variant="outline"
								onClick={() => handleOpenChange(false)}
								className="flex-1 py-6 rounded-xl"
							>
								Cerrar
							</Button>
							<Button
								onClick={() => setStatusState("form")}
								className="flex-1 py-6 rounded-xl"
							>
								Reintentar
							</Button>
						</div>
					</div>
				)}

				{statusState === "form" && (
					<>
						<DialogTitle className="flex items-center gap-2">
							<CreditCard className="w-5 h-5 text-primary" />
							Datos de tu tarjeta
						</DialogTitle>

						{plan && (
							<p className="text-sm text-muted-foreground -mt-1">
								{plan.titulo} — {formatCurrency(Number(plan.precio), plan.currency)}
							</p>
						)}

						<div className="!space-y-4 !mt-2">
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
							<div className="flex gap-2">
								<select
									value={docType}
									onChange={(e) => setDocType(e.target.value)}
									className="h-10 rounded-md border border-input bg-background px-2 py-2 text-xs font-semibold ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shrink-0 text-foreground cursor-pointer"
								>
									<option value="CC">CC</option>
									<option value="CE">CE</option>
									<option value="PP">PAS / DNI</option>
								</select>
								<Input
									placeholder={
										docType === "CC"
											? "Número de cédula"
											: docType === "CE"
											? "Cédula de extranjería"
											: "Documento o Pasaporte"
									}
									inputMode={docType === "PP" ? "text" : "numeric"}
									value={docNumber}
									onChange={(e) =>
										setDocNumber(
											docType === "PP" ? e.target.value : e.target.value.replace(/[^\d]/g, "")
										)
									}
									className="flex-1"
								/>
							</div>

							<label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
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

							<div className="flex items-center gap-1.5 text-xs text-muted-foreground justify-center">
								<ShieldCheck className="w-4 h-4 text-primary" />
								<span>Pago seguro procesado con ePayco</span>
							</div>

							<Button
								onClick={handleSubmit}
								disabled={!isValid}
								className="w-full font-semibold py-6 !rounded-xl gradient-primary"
							>
								Pagar y suscribirme
							</Button>
						</div>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
};
