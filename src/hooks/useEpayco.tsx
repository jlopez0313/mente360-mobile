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
    const doEpayco = (item: any, route: any, component: any, extra: any) => {

        const handler = window.ePayco.checkout.configure({
            key: 'ef13c01273531677dfe4399902a3ae77', // PUBLIC_KEY 
            test: true
        });

        const data = {
            //Parametros compra (obligatorio)
            name: item.titulo,
            description: item.titulo,
            invoice: String(getInvoice()),
            currency: "USD",
            amount: Number(item.precio).toFixed(2),
            tax_base: "0",
            tax: "0",
            country: "us",
            lang: "en",

            //Onpage="false" - Standard="true"
            external: "true",

            //Atributos opcionales
            extra1: item.id, // ID from Item
            extra2: route, // Redirect Page
            extra3: component,
            extra4: item.extra,
            confirmation: import.meta.env.VITE_BASE_BACK + "/confirmation",
            response: import.meta.env.VITE_BASE_BACK + "/confirmation",

            //Atributos cliente
            name_billing: "",
            address_billing: "",
            type_doc_billing: "",
            mobilephone_billing: "",
            number_doc_billing: "",

            //atributo deshabilitación metodo de pago
            // methodsDisable: ["TDC", "PSE","SP","CASH","DP"]
        }

        handler.open(data)
    }

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
        doEpayco,
        checkTransaction
    }

}
