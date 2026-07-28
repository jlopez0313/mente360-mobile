import { getEpaycoPublicKey, subscribeEpayco } from "@/services/subscribe";

export interface EpaycoCardData {
	number: string;
	exp_month: string;
	exp_year: string;
	cvc: string;
	card_holder: string;
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

			window.ePayco.token.create(
				{
					"card[number]": card.number,
					"card[exp_year]": card.exp_year,
					"card[exp_month]": card.exp_month,
					"card[cvc]": card.cvc,
					hasCvv: true,
				},
				(error: any, token: any) => {
					if (error || !token?.id) {
						reject(error ?? token);
						return;
					}
					resolve(token.id);
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
