import AudioNoWifi from "@/assets/images/audio_no_wifi.jpg";
import { Modal } from "@/components/Shared/Modal/Modal";
import { Buttons } from "@/components/Shared/Premium/Buttons/Buttons";
import { Premium } from "@/components/Shared/Premium/Premium";
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
  IonCol,
  IonGrid,
  IonRow,
  useIonActionSheet,
  useIonLoading,
} from "@ionic/react";
import { useLiveQuery } from "dexie-react-hooks";
import { cardOutline } from "ionicons/icons";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";

import styles from "./Comunidades.module.scss";

export const Comunidades = () => {
  const baseURL = import.meta.env.VITE_BASE_BACK;

  const history = useHistory();
  const network = useNetwork();

  const [present, dismiss] = useIonLoading();
  const [presentSheet, dismissSheet] = useIonActionSheet();

  const { user } = useSelector((state: any) => state.user);

  const { userEnabled, payment_status } = usePayment();

  const comunidades = useLiveQuery(() => db.comunidades.toArray());
  const plan = useLiveQuery(() =>
    db.planes.where("key").equals("COMUNIDAD").first()
  );

  const [isPremiumOpen, setIsPremiumOpen] = useState(false);

  const goToCanales = (comunidadId: number, liderId: number) => {
    if (!userEnabled || payment_status == "free") {
      setIsPremiumOpen(true);
    } else {
      if (user.suscripciones.some((s: any) => s.id == comunidadId)) {
        history.replace(`/lideres/${liderId}/canales`);
      } else {
        return;
      }
    }
  };

  const hasSuscription = (comunidadId: number) => {
    if (
      !userEnabled ||
      payment_status == "free" ||
      !user.suscripciones.some((s: any) => s.id == comunidadId)
    ) {
      return false;
    }
    return true;
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
    if ((userEnabled && payment_status != "free") || !network.status) return;

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
    <div className={styles["ion-content"]}>
      <IonGrid>
        <IonRow>
          {comunidades?.map((comunidad: any, idx: number) => {
            return (
              <IonCol size="6" key={idx}>
                <IonCard
                  onClick={() => goToCanales(comunidad.id, comunidad.lider?.id)}
                >
                  <img
                    alt={comunidad.comunidad}
                    src={
                      network.status ? baseURL + comunidad.imagen : AudioNoWifi
                    }
                  />

                  <IonCardHeader>
                    <IonCardTitle> {comunidad.comunidad} </IonCardTitle>
                    <IonCardSubtitle> {comunidad.lider?.name} </IonCardSubtitle>
                  </IonCardHeader>
                  <IonCardContent>
                    {!hasSuscription(comunidad.id) && (
                      <IonButton
                        onClick={() => onPresentSheet(comunidad)}
                        expand="block"
                        className={styles["suscribete"]}
                      >
                        Suscribete
                      </IonButton>
                    )}
                  </IonCardContent>
                </IonCard>
              </IonCol>
            );
          })}
        </IonRow>
      </IonGrid>

      <Modal
        isOpen={isPremiumOpen}
        title={import.meta.env.VITE_NAME + " premium"}
        hideButtons={!network.status || false}
        showButtons={false}
        onConfirm={() => {}}
        onWillDismiss={() => setIsPremiumOpen(false)}
      >
        <div className="ion-padding">
          <Premium />
          <Buttons />
        </div>
      </Modal>
    </div>
  );
};
