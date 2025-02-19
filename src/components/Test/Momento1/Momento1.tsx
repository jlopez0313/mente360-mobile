import {
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

const Momento1: React.FC<any> = memo(
  ({momentos, onSetMomento}) => {
  const [ momento, setMomento] = useState('');

  return (
    <>
      <IonText>
        <h6> <strong> Momento 1 </strong> </h6>
      </IonText>

      <IonText>
        <p>Marca la opción con la que más te sientas identificado(a)</p>
      </IonText>

      <div>
        <IonRadioGroup onIonChange={ (e) => setMomento(e.target.value) }>
          <IonList lines="full" className={`ion-no-padding ${styles.momentos}`}>
            <IonItem className={`ion-text-justify ${styles.momento}`}>
              <IonRadio value="A" slot="start">
                A.{" "}
              </IonRadio>
              Tiendo a ser bastante independiente y confiado: pienso que la vida va mejor cuando
              la esperas de frente. Me fijo objetivos, me comprometo y deseo que ocurran las cosas.
              No me gusta quedarme sentado, prefiero realizar algo grande y dejar mi huella. No
              busco necesariamente confrontaciones, pero no me dejo llevar ni empujar tampoco.
              La mayor parte del tiempo sé lo que quiero y voy a por ello. Tiendo a trabajar mucho
              y a disfrutar mucho.
            </IonItem>

            <IonItem className={`ion-text-justify ${styles.momento}`}>
              <IonRadio value="B" slot="start">
                B.{" "}
              </IonRadio>
              Tiendo a estar callado y estoy acostumbrado a estar solo. Normalmente no atraigo
              mucho la atención en el aspecto social, y por lo general procuro no imponerme por la
              fuerza. No me siento cómodo destacando sobre los demás ni siendo competitivo.
              Probablemente muchos dirían que tengo algo de soñador, pues disfruto con mi
              imaginación. Puedo estar bastante a gusto sin pensar que tengo que ser activo todo
              el tiempo. 
            </IonItem>

            <IonItem className={`ion-text-justify ${styles.momento}`}>
              <IonRadio value="C" slot="start">
                C.{" "}
              </IonRadio>
              Tiendo a ser muy responsable y entregado. Me siento fatal si no cumplo mis
              compromisos o no hago lo que se espera de mí. Deseo que los demás sepan que
              estoy por ellos y que haré todo lo que crea que es mejor por ellos. Con frecuencia
              hago grandes sacrificios personales por el bien de otros, lo sepan o no lo sepan. No
              suelo cuidar bien de mí mismo; hago el trabajo que hay que hacer y me relajo (y hago
              lo que realmente deseo) si me queda tiempo. 
            </IonItem>
          </IonList>
        </IonRadioGroup>

        <IonGrid class="ion-no-padding">
          <IonRow>
            <IonCol class="ion-no-padding">
              <Link to='/home' className={styles.backButton} replace={true}>
                <IonButton expand="block">
                  Atrás
                </IonButton>
              </Link>
            </IonCol>
            <IonCol class="ion-no-padding">
              <IonButton disabled={!momento} expand="block" onClick={() => onSetMomento('uno', momento)} > Siguiente </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </div>
    </>
  );
  }
)

export default Momento1;
