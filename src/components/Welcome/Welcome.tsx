
import { useNetwork } from "@/hooks/useNetwork";
import { trial } from "@/services/user";
import { IonButton, IonText, useIonLoading } from "@ionic/react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from './Welcome.module.scss';

export const Welcome = () => {

    const { user } = useSelector( (state: any) => state.user);

    const history = useHistory();
    const network = useNetwork();
    const [present, dismiss] = useIonLoading();

    const goToPlanes = () => {
        history.replace('/planes')
    }

    const onStartFreeTrial = async () => {
        try {
            await present({
                message: 'Cargando...',
                duration: 5000
            })
            
            await trial();
            setTimeout(() => {
                dismiss();
                history.replace('/home')
            }, 2000)
            
        } catch (error) {
            console.log('Error onStartFreeTrial', error)
        }
    }

    return (
        <div className={`ion-padding-start ion-padding-end ${styles["content"]}`}>
            <img
                src="assets/images/logo.png"
                className={`ion-margin-top ${styles['logo']}`}
            />

            <IonText className='ion-text-center ion-margin-bottom'> {import.meta.env.VITE_NAME} </IonText>

            <IonText className={`ion-margin-bottom ${styles['disfruta']}`}>
                ¡Disfruta de 15 días gratis!
            </IonText>

            <IonText className={`ion-text-center ion-margin-bottom ${styles['ready']}`}>
                {user.name}, estas listo para comenzar?
            </IonText>

            <IonText className='ion-text-center ion-margin-bottom'>
                Soy tu versión del futuro. Desde el {new Date().getFullYear() + 1}, quiero darte las gracias.
            </IonText>

            <IonText className='ion-text-center ion-margin-bottom'>
                Hoy, fue el día que decidiste priorizarte.
            </IonText>

            <IonText className='ion-text-center ion-margin-bottom'>
                Gracias a tus decisiones, estoy en paz, conectado conmigo y viviendo con proposito.
            </IonText>

            <IonText className='ion-text-center ion-margin-bottom'>
                Yo estaré en cada paso de este viaje de transformación.
            </IonText>

            <IonText className={`ion-text-center ion-margin-bottom ${styles['futuro']}`}>
                - Tu yo del futuro.
            </IonText>



            <IonButton disabled={!network.status} className='ion-margin-bottom' onClick={onStartFreeTrial}>
                Comienza tu transformación gratis por 15 días
            </IonButton>


            <IonText className='ion-text-center ion-margin-bottom'>
                ¿Listo para desbloquear tu mejor versión con acceso completo?
            </IonText>


            <IonButton onClick={goToPlanes}>
                {import.meta.env.VITE_NAME} premium por solo $3,99 USD/mes
            </IonButton>
        </div>
    );
};
