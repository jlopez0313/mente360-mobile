import { getEpaycoLink } from "@/services/subscribe";

export const useEpayco = () => {

	const getInvoice = () => {
		const currentDate = new Date();
		return currentDate.getTime();
	}
	/*
			const epayco = new Epayco({
					apiKey: 'TU_API_KEY_PUBLICA',
					privateKey: 'TU_API_KEY_PRIVADA',
					lang: 'ES',
					test: true // Cambiar a false en producción
			});
	*/
	const onSubscribe = async (item: any) => {
		try {
			const { data } = await getEpaycoLink(item);

			const handler = window.ePayco.checkout.configure({
				// key: data.epayco.public_key,
				key: import.meta.env.VITE_EPAYCO_PUBLIC_KEY,
				test: data.epayco.test,
			});

			handler.open({
				name: import.meta.env.VITE_NAME,
				description: data.epayco.description,
				invoice: data.epayco.invoice,
				currency: data.epayco.currency,
				amount: Number(item.precio).toFixed(2),
				tax_base: "0",
				tax: "0",
				country: data.epayco.country,
				lang: "es",
				external: "false",
				confirmation: import.meta.env.VITE_BASE_API + "/confirmation",
				response: import.meta.env.VITE_BASE_BACK + "confirmation", // Also fixing this back to origin + '/thanks' if the user overwrote it... 
				extra1: data.epayco.extra_1 ?? data.epayco.extra1,
				extra2: data.epayco.extra_2 ?? data.epayco.extra2,
				extra3: data.epayco.extra_3 ?? data.epayco.extra3,
			});

			/*
			console.log(data.payment_link)
			await Browser.open({ url: data.payment_link });
			*/
			// window.open(data.url, "_blank");
		} catch (error) {
			console.log(error);
		}
	};

	const checkTransaction = (transactionID: any) => {
		return new Promise((resolve, reject) => {
			fetch('https://secure.epayco.co/validation/v1/reference/' + transactionID)
				.then(json => json.json())
				.then(data => {
					resolve(data.data);
				})
		})
	}


	return {
		onSubscribe,
		checkTransaction
	}

}
