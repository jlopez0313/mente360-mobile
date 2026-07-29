import { getEpaycoPublicKey, subscribeEpayco } from "@/services/subscribe";

export interface EpaycoCardData {
	number: string;
	exp_month: string;
	exp_year: string;
	cvc: string;
	card_holder: string;
	email: string;
}

export interface EpaycoSubscribePayload {
	precio: string;
	periodicidad: string;
	titulo: string;
	comunidad: any;
	currency: "COP" | "USD";
	docType: string;
	docNumber: string;
	card: EpaycoCardData;
}

export const useEpayco = () => {
	const tokenizeCard = (card: EpaycoCardData, publicKey: string): Promise<string> => {
		return new Promise((resolve, reject) => {
			window.ePayco.setPublicKey(publicKey);

			// El SDK de ePayco genera este identificador con localStorage.setItem(),
			// cuyo valor de retorno es siempre `undefined`. En la primera llamada de
			// un dispositivo (localStorage vacío) eso hace que mande `session: undefined`
			// y falle con "no se encontro el token de sesion". Lo sembramos antes para
			// que el primer intento real del usuario ya funcione.
			if (!localStorage.getItem("keyUserIndex")) {
				const guid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
					const r = (Math.random() * 16) | 0;
					const v = c === "x" ? r : (r & 0x3) | 0x8;
					return v.toString(16);
				});
				localStorage.setItem("keyUserIndex", guid);
			}

			window.ePayco.token.create(
				{
					card: {
						number: card.number,
						exp_year: card.exp_year,
						exp_month: card.exp_month,
						cvc: card.cvc,
						name: card.card_holder,
						email: card.email,
					},
					hasCvv: true,
				},
				(error: any, token: any) => {
					if (error || !token) {
						reject(error ?? token);
						return;
					}
					resolve(typeof token === "string" ? token : token.id);
				}
			);
		});
	};

	const onSubscribe = async (item: EpaycoSubscribePayload) => {
		const { data } = await getEpaycoPublicKey();

		const cardToken = await tokenizeCard(item.card, data.public_key);

		const { data: subscription } = await subscribeEpayco({
			precio: item.precio,
			currency: item.currency,
			titulo: item.titulo,
			periodicidad: item.periodicidad,
			comunidad: item.comunidad,
			card_token: cardToken,
			card_holder: item.card.card_holder,
			doc_type: item.docType,
			doc_number: item.docNumber,
		});

		return subscription;
	};

	return {
		onSubscribe,
	};
};
