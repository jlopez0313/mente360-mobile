import {
  IonLabel,
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

import { useNetwork } from "@/hooks/useNetwork";
import { all } from "@/services/constants";
import { test } from "@/services/test";
import { setUser } from "@/store/slices/userSlice";
import { memo, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import styles from "../Test.module.scss";

const Momento2: React.FC<any> = memo(({ momentos, onSetMomento }) => {

  const [present, dismiss] = useIonLoading();
  const [presentAlert] = useIonAlert();

  const history = useHistory();
  const dispatch = useDispatch();
  const network = useNetwork();

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
      console.log(error)

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

      const setUserPromise = testPromise.then(({ data }: any) => {

        const eneatipo: any = constants.eneatipos.find(
          (item: any) => item.key == data.data.eneatipo
        );

        const eneatipo_data = eneatipo?.descripcion.split(".");

        presentAlert({
          header: "¡Tu resultado es " + data.data.eneatipo + "!",
          subHeader: eneatipo_data[0],
          message: eneatipo_data[1],
          buttons: ["Aceptar"],
        });

        return dispatch(setUser(data.data));
      });

      await Promise.all([testPromise, setUserPromise]);

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

      <IonText className="font12">
        <p>Marca la opción con la que más te sientas identificado(a)</p>
      </IonText>
      <br></br>
      <div>
        <IonRadioGroup onIonChange={(e) => onSetMomento("dos", e.detail.value)}>
          <IonList lines="full" className={`ion-no-padding ${styles.momentos}`}>
            <IonItem button onClick={() => onSetMomento("dos", "X")}
              className={`ion-text-justify ${styles.momento} ${momentos["dos"] === "X" ? styles.selected : ""
                }`}>
              <IonLabel className="ion-text-wrap">
                <p className={styles.opcionLetra}>X.</p>
                <p>
                  Soy una persona que normalmente mantiene una actitud positiva y
                  piensa que las cosas se van a resolver para mejor. Suelo
                  entusiasmarme por las cosas y no me cuesta encontrar en qué
                  ocuparme. Me gusta estar con gente y ayudar a otros a ser felices;
                  me agrada compartir con ellos mi bienestar. (No siempre me siento
                  fabulosamente bien, pero trato de que nadie se dé cuenta.) Sin
                  embargo, mantener esta actitud positiva ha significado a veces
                  dejar pasar demasiado tiempo sin ocuparme de mis problemas.
                </p>
              </IonLabel>
            </IonItem>

            <IonItem button onClick={() => onSetMomento("dos", "Y")}
              className={`ion-text-justify ${styles.momento} ${momentos["dos"] === "Y" ? styles.selected : ""
                }`}>
              <IonLabel className="ion-text-wrap">
                <p className={styles.opcionLetra}>Y.</p>
                <p>
                  Soy una persona que tiene fuertes sentimientos respecto a las
                  cosas, la mayoría de la gente lo nota cuando me siento desgraciado
                  por algo. Sé ser-reservado con los demás, pero soy más sensible de
                  lo que dejo ver. Deseo saber a qué atenerme con los demás y con
                  quiénes y con qué puedo contar; la mayoría de las personas tienen
                  muy claro a qué atenerse conmigo. Cuando estoy alterado por algo
                  deseo que los demás reaccionen y se emocionen tanto como yo.
                  Conozco las reglas, pero no quiero que me digan lo que he de
                  hacer. Quiero decidir por mí mismo.
                </p>
              </IonLabel>
            </IonItem>

            <IonItem button onClick={() => onSetMomento("dos", "Z")}
              className={`ion-text-justify ${styles.momento} ${momentos["dos"] === "Z" ? styles.selected : ""
                }`}>
              <IonLabel className="ion-text-wrap">
                <p className={styles.opcionLetra}>Z.</p>
                <p>
                  Tiendo a controlarme y a ser lógico, me desagrada hacer frente a
                  los sentimientos. Soy eficiente, incluso perfeccionista, y
                  prefiero trabajar solo. Cuando hay problemas o conflictos
                  personales trato de no meter mis sentimientos por medio. Algunos
                  dicen que soy demasiado frío y objetivo, pero no quiero que mis
                  reacciones emocionales me distraigan de lo que realmente me
                  importa. Por lo general, no muestro mis emociones cuando otras
                  personas «me fastidian».
                </p>
              </IonLabel>
            </IonItem>
          </IonList>
        </IonRadioGroup>
        <br></br>
        <IonGrid class="ion-no-padding">
          <IonRow>
            <IonCol class="ion-no-padding">

              <IonButton shape="round" disabled={!network.status} expand="block" onClick={send}>
                {" "}
                Finalizar{" "}
              </IonButton>
              <br></br>
              <IonButton shape="round" fill="outline" className="yellow-outline-button" expand="block" onClick={() => onClearMomentos()}>
                {" "}
                Atrás{" "}
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
