
import { getUser } from "@/helpers/onboarding";
import { useNetwork } from "@/hooks/useNetwork";
import { writeData } from "@/services/realtime-db";
import { find } from "@/services/subscribe";
import { update } from "@/services/user";
import { IonBadge, IonButton, IonIcon, IonImg, IonItem, IonLabel, IonList, IonText, useIonLoading } from "@ionic/react";
import { chatboxEllipsesOutline, heartCircleOutline, moonOutline, peopleOutline, ribbonOutline } from "ionicons/icons";
import { useHistory } from "react-router";
import styles from './Detalle.module.scss';

export const Detalle = () => {

    const history = useHistory();
    const network = useNetwork();
    const [present, dismiss] = useIonLoading();

    const { user } = getUser();

    const onPay = async (item: any) => {

        if (user.has_paid || !network.status)
            return;

        const { data } = await find(item);
        window.open(data.url, '_blank');
    }

    const onCancelSuscription = async () => {
        try {
            await present({
                message: 'Cargando...',
                duration: 3000
            })

            await update({ref_payco: null}, user.id);
            await writeData(`payments/${user.id}/ref_payco`, null)
            dismiss();

            history.replace('/perfil')

        } catch (error) {
            console.log('Error Cancelando', error)
        }
    }

    return (
        <div className={`${styles["content"]}`}>
            <IonImg
                src="assets/images/logo.png"
                className={`ion-margin-top ${styles['logo']}`}
            />

            <IonText className='ion-text-center ion-margin-bottom'> {import.meta.env.VITE_NAME} </IonText>

            <IonText className={`ion-text-center ion-margin-bottom ${styles['ready']}`}>
                Desbloquea todo tu potencial con {import.meta.env.VITE_NAME} premium.
            </IonText>

            <IonList className={`ion-text-justify ${styles["caracteristicas"]} ${styles["w-100"]}`}>
                <IonItem>
                    <IonIcon aria-hidden="true" icon={ribbonOutline} slot="start" />
                    <IonLabel className={`ion-text-left`}>
                        Acceso ilimitado a formaciones, meditaciones, musicoterapia y tareas personalizadas
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonIcon aria-hidden="true" icon={moonOutline} slot="start" />

                    <IonLabel className={`ion-text-left`}>
                        Audios nocturnos personalizados para tu tipo de personalidad
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonIcon aria-hidden="true" icon={chatboxEllipsesOutline} slot="start" />

                    <IonLabel className={`ion-text-left`}>
                        Frases diarias de motivación adaptadas a tu eneagrama
                    </IonLabel>
                </IonItem>
                <IonItem>
                    <IonIcon aria-hidden="true" icon={peopleOutline} slot="start" />

                    <IonLabel className={`ion-text-left`}>
                        Acceso a la comunidad exclusiva para compartir tu crecimiento personal
                    </IonLabel>
                </IonItem>
                <IonItem lines="none">
                    <IonIcon aria-hidden="true" icon={heartCircleOutline} slot="start" />

                    <IonLabel className={`ion-text-left`}>
                        S.O.S Emocional
                    </IonLabel>
                </IonItem>
            </IonList>

            <IonList className={`ion-text-justify ion-margin-top ion-margin-bottom ${styles["w-100"]} ${styles["precios"]}`}>
                <span className={``}>Mejor Opción</span>
                <IonItem button={true} onClick={() => onPay({ precio: '39', titulo: 'plan anual' })}>
                    <IonLabel className={`ion-text-left`}>
                        <h2>Anual</h2>
                        <p>Cancela en cualquier momento</p>
                    </IonLabel>
                    {
                        user.has_paid ?
                            null :
                            <IonBadge slot="end">
                                $39 USD/año
                                <p>(Ahorra más de 60%)</p>
                            </IonBadge>

                    }
                </IonItem>
                <IonItem button={true} onClick={() => onPay({ precio: '3.99', titulo: 'plan mensual' })} lines="none">
                    <IonLabel className={`ion-text-left`}>
                        <h2>Mensual</h2>
                    </IonLabel>
                    {
                        user.has_paid ?
                            null :
                            <IonBadge slot="end">$3,99 USD/mes</IonBadge>

                    }
                </IonItem>
            </IonList>

            {
                user.has_paid ?
                    <IonButton disabled={!network.status} onClick={onCancelSuscription}> Cancelar Mi Suscripción </IonButton> :
                    <IonText className={`ion-margin-top`}>
                        <b>Cancela en cualquier momento.</b>
                        <br />
                        La suscripción se renueva automáticamente a menos que se cancele 24 horas antes del final del período.
                    </IonText>
            }

        </div>
    );
};
