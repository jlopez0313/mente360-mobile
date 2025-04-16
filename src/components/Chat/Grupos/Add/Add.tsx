import { IonIcon, IonInput } from "@ionic/react";
import { useEffect, useRef, useState } from "react";

import { getUser } from "@/helpers/onboarding";
import { camera } from "ionicons/icons";
import styles from "./Add.module.scss";

export const Add: React.FC<any> = ({ doChild }) => {
  const { user } = getUser();
  const fileRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [grupo, setGrupo] = useState<any>({ photo: "", grupo: "", users_id: "" });

  const onSetGrupo = (idx: string, value: any) => {
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
            <div className="">Debes añadir una imagen al grupo</div>
          </div>
        )}
      </div>

      <IonInput
        labelPlacement="stacked"
        fill="outline"
        placeholder="Nombre del grupo"
        className={`ion-margin-bottom ${styles.profile}`}
        value={grupo.grupo}
        onIonInput={(e) => onSetGrupo("grupo", e.target.value)}
      ></IonInput>
    </div>
  );
};
