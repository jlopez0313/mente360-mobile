import {
  IonButton,
  IonCol,
  IonGrid,
  IonItem,
  IonList,
  IonLoading,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonText,
  useIonAlert,
  useIonLoading,
} from "@ionic/react";

import { localDB } from "@/helpers/localStore";
import { getUser, setUser } from "@/helpers/onboarding";
import { useNetwork } from "@/hooks/useNetwork";
import { all } from "@/services/constants";
import { test } from "@/services/test";
import { memo, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styles from "../Test.module.scss";

const Momento2: React.FC<any> = memo(({ momentos, onSetMomento }) => {
  
  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const history = useHistory();
  const user = getUser();
  const network = useNetwork();
  const homeDB = localDB("home");

  const [constants, setConstants] = useState({ eneatipos: [], generos: [] });

  const onClearMomentos = () => {
    onSetMomento("dos", null);
    onSetMomento("uno", null);
  };

  const onGetConstants = async () => {
    try {
      present({
        message: "Cargando ...",
      });

      const { data } = await all();
      setConstants(data);
    } catch (error: any) {
      console.log( error )

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  const send = async (evt: any) => {
    evt.preventDefault();

    try {
      present({
        message: "Cargando ...",
      });

      const testPromise = test(momentos);

      const setUserPromise = testPromise.then(({ data }) => {

        const eneatipo: any = constants.eneatipos.find(
          (item: any) => item.key == data.data.eneatipo
        );
  
        presentAlert({
          header: "Alerta!",
          subHeader: "Mensaje importante.",
          message:
            "Tu resultado es " + data.data.eneatipo + ". " + eneatipo?.descripcion,
          buttons: ["OK"],
        });

        return setUser({ ...user, user: data.data });
      });

      await Promise.all([testPromise, setUserPromise]);

      homeDB.clear();

      setTimeout(() => {
        history.replace("/home");
      }, 1000);
    } catch (error: any) {
      console.error(error)

      presentAlert({
        header: "Alerta!",
        subHeader: "Mensaje importante.",
        message: error.data?.message || "Error Interno",
        buttons: ["OK"],
      });
    } finally {
      dismiss();
    }
  };

  useEffect(() => {
    onGetConstants();
  }, []);

  return (
    <>
      <IonText>
        <h6> <strong> Momento 2 </strong> </h6>
      </IonText>

      <IonText>
        <p>Marca la opción con la que más te sientas identificado(a)</p>
      </IonText>

      <div>
        <IonRadioGroup onIonChange={(e) => onSetMomento("dos", e.target.value)}>
          <IonList lines="full" className={`ion-no-padding ${styles.momentos}`}>
            <IonItem className={`ion-text-justify ${styles.momento}`}>
              <IonRadio value="X" slot="start">
                X.{" "}
              </IonRadio>
              Soy una persona que normalmente mantiene una actitud positiva y
              piensa que las cosas se van a resolver para mejor. Suelo
              entusiasmarme por las cosas y no me cuesta encontrar en qué
              ocuparme. Me gusta estar con gente y ayudar a otros a ser felices;
              me agrada compartir con ellos mi bienestar. (No siempre me siento
              fabulosamente bien, pero trato de que nadie se dé cuenta.) Sin
              embargo, mantener esta actitud positiva ha significado a veces
              dejar pasar demasiado tiempo sin ocuparme de mis problemas.
            </IonItem>

            <IonItem className={`ion-text-justify ${styles.momento}`}>
              <IonRadio value="Y" slot="start">
                Y.{" "}
              </IonRadio>
              Soy una persona que tiene fuertes sentimientos respecto a las
              cosas, la mayoría de la gente lo nota cuando me siento desgraciado
              por algo. Sé ser-reservado con los demás, pero soy más sensible de
              lo que dejo ver. Deseo saber a qué atenerme con los demás y con
              quiénes y con qué puedo contar; la mayoría de las personas tienen
              muy claro a qué atenerse conmigo. Cuando estoy alterado por algo
              deseo que los demás reaccionen y se emocionen tanto como yo.
              Conozco las reglas, pero no quiero que me digan lo que he de
              hacer. Quiero decidir por mí mismo.
            </IonItem>

            <IonItem className={`ion-text-justify ${styles.momento}`}>
              <IonRadio value="Z" slot="start">
                Z.{" "}
              </IonRadio>
              Tiendo a controlarme y a ser lógico, me desagrada hacer frente a
              los sentimientos. Soy eficiente, incluso perfeccionista, y
              prefiero trabajar solo. Cuando hay problemas o conflictos
              personales trato de no meter mis sentimientos por medio. Algunos
              dicen que soy demasiado frío y objetivo, pero no quiero que mis
              reacciones emocionales me distraigan de lo que realmente me
              importa. Por lo general, no muestro mis emociones cuando otras
              personas «me fastidian».
            </IonItem>
          </IonList>
        </IonRadioGroup>

        <IonGrid class="ion-no-padding">
          <IonRow>
            <IonCol class="ion-no-padding">
              <IonButton expand="block" onClick={() => onClearMomentos()}>
                {" "}
                Atrás{" "}
              </IonButton>
            </IonCol>
            <IonCol class="ion-no-padding">
              <IonButton  disabled={!network.status} expand="block" onClick={send}>
                {" "}
                Finalizar{" "}
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonLoading
          trigger="open-loading"
          message="Dismissing after 3 seconds..."
          duration={3000}
        />
      </div>
    </>
  );
});

export default Momento2;
