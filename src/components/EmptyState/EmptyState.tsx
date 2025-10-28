import React from "react";
import { IonText } from "@ionic/react";
import styles from "./EmptyState.module.scss";

const EmptyState = ({ image, title, subtitle }) => {
  return (
    <div className={styles.emptyContainer}>
      <img src={image} alt={title} className={styles.emptyImage} />
      <IonText color="medium">
        <h2 className={styles.emptyTitle}>{title}</h2>
      </IonText>
      <IonText color="medium">
        <p className={styles.emptySubtitle}>{subtitle}</p>
      </IonText>
    </div>
  );
};

export default EmptyState;
