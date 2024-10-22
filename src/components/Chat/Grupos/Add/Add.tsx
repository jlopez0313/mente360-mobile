import { IonIcon, IonInput } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";

import styles from "./Add.module.scss";
import { camera, cameraOutline } from "ionicons/icons";
import { getUser } from "@/helpers/onboarding";

interface Props {
  doChild?: (params?: any) => {};
}

export const Add = ({ doChild }: Props) => {
  const {user} = getUser();
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [grupo, setGrupo] = useState({ photo: "", grupo: "", users_id: "" });

  const onSetGrupo = (idx: string, value: string) => {
    grupo[idx] = value;

    setGrupo({
      ...grupo,
      users_id: user.id,
    });
  };

  const onClickFile = () => {
    fileRef.current?.click();
  };

  const onUploadImage = (evt: any) => {
    const reader = new FileReader();
    reader.readAsDataURL(evt.target.files[0]);
    reader.onload = function (event: any) {
      onSetGrupo("photo", event.target.result);
      setPhoto(event.target.result);
    };
    reader.onerror = function () {
      // notify(t("profile.alerts.error-image"), "error");
    };
  };

  useEffect(() => {
    if (doChild) doChild(grupo);
  }, [grupo]);

  return (
    <div className="ion-padding">
      <input
        type="file"
        className="ion-hide"
        ref={fileRef}
        onChange={onUploadImage}
        accept="image/png, image/jpeg"
      />
      <div
        style={{
          backgroundImage: `url(${photo})`,
        }}
        className={`${styles["avatar-container"]} ion-margin-bottom`}
        onClick={onClickFile}
      >
        {!photo && (
          <div className={`${styles["no-photo"]}`}>
            <IonIcon icon={camera} size="large"></IonIcon>
            <div className="">Añadir imagen del grupo</div>
          </div>
        )}
      </div>

      <IonInput
        labelPlacement="stacked"
        fill="outline"
        shape="round"
        placeholder="Nombre del grupo"
        className={`ion-margin-bottom ${styles.profile}`}
        value={grupo.grupo}
        onIonInput={(e) => onSetGrupo("grupo", e.target.value)}
      ></IonInput>

    </div>
  );
};
