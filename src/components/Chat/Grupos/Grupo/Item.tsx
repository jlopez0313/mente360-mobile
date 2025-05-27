import Avatar from "@/assets/images/avatar.jpg";
import { IonAvatar, IonItem, IonSkeletonText, IonText } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "./Grupo.module.scss";

export const Item: React.FC<any> = ({ msg, usuarios }) => {

  const baseURL = import.meta.env.VITE_BASE_BACK;
  const { user } = useSelector( (state: any) => state.user);

  const [isLoading, setIsLoading] = useState(true);
  const [usuario, setUsuario] = useState<any>({});
  
  const onGetUser = () => {
    setUsuario( usuarios.find( (u: any) => u.id == msg.user) )
  }

  useEffect(() => {
    onGetUser()
  }, [])

  return (
    <IonItem
      button={true}
      className={`${styles["message"]} ${
        msg.user === user.id ? styles["sender"] : styles["receiver"]
      } `}
    >
      {msg.user !== user.id && (
        <IonAvatar aria-hidden="true" slot="start">
          {isLoading && (
            <IonSkeletonText
              animated
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "50%",
              }}
            />
          )}
          <img
            alt=""
            src={usuario.photo ? baseURL + usuario.photo : Avatar}
            style={{ display: isLoading ? "none" : "block" }}
            onLoad={() => setIsLoading(false)}
          />
        </IonAvatar>
      )}
      <div>
        {msg.user !== user.id && (
          <span className={styles["name"]}> {usuario.name} </span>
        )}
        <IonText className={styles["message"]}> {msg.mensaje} </IonText>
        <span className={styles["time"]}> {msg.hora} </span>
      </div>
    </IonItem>
  );
};
