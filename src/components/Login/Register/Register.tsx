import { IonButton, IonCard, IonCardContent, IonCol, IonGrid, IonIcon, IonInput, IonItem, IonLabel, IonList, IonLoading, IonNote, IonRow } from "@ionic/react";
import styles from '../Login.module.scss';

export const Register = () => {
  return (
    <IonGrid class="ion-text-center">
      <IonRow>
        <IonCol size="12" class="ion-no-padding">
          <IonCard className={`ion-no-padding`}>
            <IonCardContent>
              <IonList>
                <IonItem
                  className="ion-no-padding ion-margin-bottom "
                  lines="none"
                >
                  <IonInput
                    className={styles.login}
                    type="email"
                    labelPlacement="stacked"
                    placeholder="Correo"
                    shape="round"
                    size={10}
                  ></IonInput>
                </IonItem>
                <IonItem className="ion-no-padding" lines="none">
                  <IonInput
                    className={styles.login}
                    type="password"
                    labelPlacement="stacked"
                    placeholder="Contraseña"
                  ></IonInput>
                </IonItem>
              </IonList>
              <IonButton
                type="button"
                className="ion-margin-top"
                expand="block"
                shape="round"
              >
                {" "}
                Acceder{" "}
              </IonButton>

              <IonNote> &nbsp; </IonNote>

              <IonLoading
                trigger="open-loading"
                message="Dismissing after 3 seconds..."
                duration={3000}
              />
            </IonCardContent>
          </IonCard>
          
          <IonLabel>O iniciar sesión con </IonLabel> <br />
          <br />
          <img className={styles['logo-google'] } src="assets/images/logoGoogle.png" />

        </IonCol>
      </IonRow>
    </IonGrid>
  );
};
