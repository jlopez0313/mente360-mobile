import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { db } from "@/hooks/useDexie";
import { useNetwork } from "@/hooks/useNetwork";
import { usePayment } from "@/hooks/usePayment";
import { find } from "@/services/subscribe";

import {
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    useIonActionSheet,
    useIonLoading,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { cardOutline } from "ionicons/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import styles from "./Suscripcion.module.scss";

export const Item = ({ comunidad, finSuscripcion, setIsPremiumOpen }: any) => {
  const { user } = useSelector((state: any) => state.user);
  const { userEnabled, payment_status } = usePayment();

  const [expandido, setExpandido] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const network = useNetwork();
  const history = useHistory();

  const plan = useLiveQuery(() =>
    db.planes.where("key").equals("COMUNIDAD").first()
  );

  const [present, dismiss] = useIonLoading();
  const [presentSheet, dismissSheet] = useIonActionSheet();

  const goToCanales = (comunidadId: number) => {
    if (!userEnabled || payment_status == "free") {
      setIsPremiumOpen(true);
    } else {
      if (!user.suscripciones.some((s: any) => s.id == comunidadId)) {
        setIsPremiumOpen(true);
      } else {
        history.replace(`/comunidades/${comunidadId}/canales`);
      }
    }
  };

  const onPresentSheet = async (comunidad: any) => {
    await presentSheet({
      cssClass: "custom-action-sheet",
      header: comunidad.comunidad,
      subHeader: comunidad.lider?.name,
      buttons:
        plan?.valor?.map((p: any) => {
          const tipo_plan =
            p.key == "MES"
              ? "mensual"
              : p.key == "TRIM"
              ? "trimestral"
              : p.key == "SEM"
              ? "semestral"
              : "anual";

          return {
            disabled: !network.status,
            text: `Plan $${p.valor}/${tipo_plan}`,
            icon: cardOutline,
            handler: () =>
              onSubscribe({
                precio: p.valor,
                titulo: "plan " + tipo_plan,
                comunidad: comunidad.id,
              }),
          };
        }) ?? [],
    });

    setTimeout(() => {
      const actionSheetHeader = document.querySelector(
        ".custom-action-sheet .action-sheet-title"
      );

      if (actionSheetHeader && !document.querySelector(".header-container")) {
        const headerContainer = document.createElement("div");
        headerContainer.classList.add("header-container");

        const avatar = document.createElement("img");

        if (network.status) {
          avatar.src = baseURL + comunidad.imagen;
        } else {
          avatar.src = AudioNoWifi;
        }

        avatar.alt = "Avatar";
        avatar.classList.add("avatar");

        const textContainer = document.createElement("div");
        textContainer.classList.add("text-container");

        const title = document.createElement("span");
        title.textContent = comunidad.comunidad;
        title.classList.add("title");

        const subTitle = document.createElement("span");
        subTitle.textContent = comunidad.lider?.name || "";
        subTitle.classList.add("sub-title");

        textContainer.appendChild(title);
        textContainer.appendChild(subTitle);

        headerContainer.appendChild(avatar);
        headerContainer.appendChild(textContainer);

        actionSheetHeader.innerHTML = "";
        actionSheetHeader.appendChild(headerContainer);
      }
    }, 100);
  };

  const onSubscribe = async (item: any) => {
    try {
      await present({
        message: "Cargando...",
        duration: 3000,
      });

      const { data } = await find(item);

      dismiss();
      window.open(data.url, "_blank");
    } catch (error) {
      console.log(error);
      dismiss();
    }
  };

  return (
    <IonCard>
      <img
        alt={comunidad.comunidad}
        src={network.status ? baseURL + comunidad.imagen : AudioNoWifi}
      />
      <IonCardHeader>
        <IonCardTitle> {comunidad.comunidad} </IonCardTitle>
        <IonCardSubtitle> {comunidad.lider?.name} </IonCardSubtitle>

        <p
          className={`${styles["texto"]} ${
            expandido ? styles["expandido"] : ""
          }`}
        >
          {" "}
          {comunidad.descripcion}{" "}
        </p>
        <button
          className={styles["btn-leer"]}
          onClick={() => setExpandido(!expandido)}
        >
          {expandido ? "Leer menos" : "Leer más"}
        </button>
      </IonCardHeader>
      <IonCardContent>
        {finSuscripcion?.vencida ? (
          <>
            <span>Venció el: {finSuscripcion.fecha_formateada}</span>

            <IonButton
              onClick={() => onPresentSheet(comunidad)}
              className={styles["suscribete"]}
              expand="block"
            >
              Suscribete
            </IonButton>
          </>
        ) : (
          <>
            <span>Vence el: {finSuscripcion?.fecha_formateada}</span>
            <IonButton
                fill="outline"
              expand="block"
              className={styles["suscrito"]}
              onClick={() =>
                !finSuscripcion?.vencida && goToCanales(comunidad.id)
              }
            >
              {" "}
              Acceder{" "}
            </IonButton>
          </>
        )}
      </IonCardContent>
    </IonCard>
  );
};
