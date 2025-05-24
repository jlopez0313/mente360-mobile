
import { find } from "@/services/subscribe";
import { IonButton, IonCard, IonCardContent, IonCardTitle, IonCol, IonRow, IonText, useIonLoading } from "@ionic/react";
import { useHistory } from "react-router";

import { getUser } from "@/helpers/onboarding";
import { useNetwork } from "@/hooks/useNetwork";
import { writeData } from "@/services/realtime-db";
import styles from './Planes.module.scss';

export const Planes = () => {

    const history = useHistory();
    const network = useNetwork();
    const [present, dismiss] = useIonLoading();

    const { user } = getUser();

    const goToDetalle = async() => {
        history.replace('/planes/detalle')
    }

    const onPay = async (item: any) => {
        try {
            if ( network.status ) {
                const { data } = await find(item);
                window.open(data.url, '_blank');
            }
        } catch (error) {
            console.log('Error onPay', error)
        }
    }

    const onStartFreeTrial = async () => {
        try {
            await present({
                message: 'Cargando...',
                duration: 3000
            })

            const hora = new Date();
            const vence = hora;
            vence.setDate(vence.getDate() + 14);
            vence.setHours(23, 59, 59, 0);
            
            const data = {
                estado: "completado",
                hora: hora.toISOString(),
                ref_payco: 'FREE_TRIAL',
                vence: vence.toISOString()
            }
    
            await writeData(`payments/${user.id}`, data)
            dismiss();

            history.replace('/perfil')

        } catch (error) {
            console.log('Error onStartFreeTrial', error)
        }
    }

    return (
        <div className={`ion-padding-start ion-padding-end ${styles["content"]}`}>
            <img
                src="assets/images/logo.png"
                className={`${styles['logo']}`}
            />

            <IonText className='ion-text-center ion-margin-bottom'> {import.meta.env.VITE_NAME} </IonText>

            <IonText className={`ion-margin-bottom ${styles['embarcate']}`}>
                Embárcate en la búsqueda de tu mejor versión
            </IonText>

            <IonText className='ion-text-center ion-margin-bottom'>
                Reinicia tu mente, reconecta con tu propósito y desbloquea tu máximo potencial, ¡Comienza ya!
            </IonText>

            <IonRow className={`ion-margin-bottom ${styles["planes"]}`}>
                <IonCol size="6">
                    <IonCard button={true} onClick={() => onPay({precio: '3.99', titulo: 'plan mensual'})}>
                        <IonCardTitle>
                            <h2 className="ion-text-center ion-padding-start ion-padding-end">Mensual</h2>
                        </IonCardTitle>
                        <IonCardContent>
                            <p>$3,99/USD</p>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
                <IonCol size="6">
                    <IonCard button={true} onClick={() => onPay({precio: '39', titulo: 'plan anual'})}>
                        <IonCardTitle>
                            <h2 className="ion-text-center ion-padding-start ion-padding-end">Anual</h2>
                        </IonCardTitle>
                        <IonCardContent>
                            <p>$39/USD</p>
                        </IonCardContent>
                    </IonCard>
                </IonCol>
            </IonRow>


            <IonButton className={`ion-margin-bottom ${styles['all-planes']}`} onClick={goToDetalle}>
                Ver todos los planes
            </IonButton>

            {
                user.fecha_vencimiento ? null : 
                <>
                    <IonText className='ion-text-center ion-margin-bottom'>
                        O también puedes
                    </IonText>

                    <IonButton disabled={!network.status} onClick={ onStartFreeTrial } >
                        Comenzar tu prueba gratuita por 15 días
                    </IonButton>
                </>
            }

        </div>
    );
};
