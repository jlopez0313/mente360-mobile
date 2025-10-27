import {
  IonItemDivider,
  IonLabel,
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonList,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonText,
} from "@ionic/react";

import styles from "../Test.module.scss";
import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Momento1: React.FC<any> = memo(
  ({ momentos, onSetMomento }) => {
    const { user } = useSelector((state: any) => state.user);
    const [momento, setMomento] = useState('');

    return (
      <>
        <IonText>
          Hola, <strong className={styles.name}> {user.name} </strong>{" "}
        </IonText>

        <br></br> <br></br>

        <IonText className="ion-text-justify font12">
          Por favor, realiza el test de eneagrama para conocer tu Eneatipo
        </IonText>

        <br></br> <br></br>

        <IonItemDivider className="line-divider"></IonItemDivider>


        <IonText>
          <h6> <strong> Momento 1 </strong> </h6>
        </IonText>

        <IonText className="font12">
          <p>Marca la opción con la que más te sientas identificado(a)</p>
        </IonText>

        <div>
          <IonRadioGroup onIonChange={(e) => setMomento(e.detail.value)}>
            <IonList lines="full" className={`ion-no-padding ${styles.momentos}`}>
              <IonItem button onClick={() => setMomento("A")}
                className={`ion-text-justify ${styles.momento} ${momento === "A" ? styles.selected : ""
                  }`}>
                <IonLabel className="ion-text-wrap">
                  <p className={styles.opcionLetra}>A.</p>
                  <p>
                    Tiendo a ser bastante independiente y confiado: pienso que la vida va mejor cuando
                    la esperas de frente. Me fijo objetivos, me comprometo y deseo que ocurran las cosas.
                    No me gusta quedarme sentado, prefiero realizar algo grande y dejar mi huella. No
                    busco necesariamente confrontaciones, pero no me dejo llevar ni empujar tampoco.
                    La mayor parte del tiempo sé lo que quiero y voy a por ello. Tiendo a trabajar mucho
                    y a disfrutar mucho.
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem button onClick={() => setMomento("B")}
                className={`ion-text-justify ${styles.momento} ${momento === "B" ? styles.selected : ""
                  }`}>
                <IonLabel className="ion-text-wrap">
                  <p className={styles.opcionLetra}>B.</p>
                  <p>
                    Tiendo a estar callado y estoy acostumbrado a estar solo. Normalmente no atraigo
                    mucho la atención en el aspecto social, y por lo general procuro no imponerme por la
                    fuerza. No me siento cómodo destacando sobre los demás ni siendo competitivo.
                    Probablemente muchos dirían que tengo algo de soñador, pues disfruto con mi
                    imaginación. Puedo estar bastante a gusto sin pensar que tengo que ser activo todo
                    el tiempo.
                  </p>
                </IonLabel>
              </IonItem>

              <IonItem button onClick={() => setMomento("C")}
                className={`ion-text-justify ${styles.momento} ${momento === "C" ? styles.selected : ""
                  }`}>
                <IonLabel className="ion-text-wrap">
                  <p className={styles.opcionLetra}>C.</p>
                  <p>
                    Tiendo a ser muy responsable y entregado. Me siento fatal si no cumplo mis
                    compromisos o no hago lo que se espera de mí. Deseo que los demás sepan que
                    estoy por ellos y que haré todo lo que crea que es mejor por ellos. Con frecuencia
                    hago grandes sacrificios personales por el bien de otros, lo sepan o no lo sepan. No
                    suelo cuidar bien de mí mismo; hago el trabajo que hay que hacer y me relajo (y hago
                    lo que realmente deseo) si me queda tiempo.
                  </p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonRadioGroup>

          <br></br>
          <IonGrid class="ion-no-padding">
            <IonRow>
              <IonCol class="ion-no-padding">

                <IonButton shape="round" disabled={!momento} expand="block" onClick={() => onSetMomento('uno', momento)} > Siguiente </IonButton>
                <br></br>
                <Link to="/home" replace={true}>
                  <IonButton fill="outline" className="yellow-outline-button" shape="round" expand="block">Volver</IonButton>
                </Link>

              </IonCol>
            </IonRow>
          </IonGrid>
        </div>
      </>
    );
  }
)

export default Momento1;
