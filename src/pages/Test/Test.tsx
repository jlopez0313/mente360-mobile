import {
  IonItemDivider,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar
} from "@ionic/react";

import { Test as TestComponent } from "@/components/Test/Test";
import { arrowBack } from "ionicons/icons";
import { Link, useHistory } from "react-router-dom";
import styles from "./Test.module.scss";

import { setShowGlobalAudio } from "@/store/slices/audioSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft } from "lucide-react";

const Test: React.FC = () => {

  const history = useHistory();
  const dispatch = useDispatch();

  const { route } = useSelector((state: any) => state.route);

  useEffect(() => {

    const handleBackButton = (ev: Event) => {
      ev.preventDefault();
      ev.stopPropagation();
      history.replace(route);
    };

    document.addEventListener("ionBackButton", handleBackButton);

    return () => {
      document.removeEventListener("ionBackButton", handleBackButton);
    };
  }, [history]);

  useEffect(() => {
    dispatch(setShowGlobalAudio(false))
  }, [])

  return (
    <IonPage>
        <IonToolbar>
          <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border/50">
            <div className="flex items-center justify-between px-4 py-3">
              <Link to="/" className="p-2 -ml-2 hover:bg-muted rounded-full">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </Link>
              <h1 className="font-display font-semibold text-lg">Realizar Test Eneagrama</h1>
              <div className="w-9" />
            </div>
          </header>
        </IonToolbar>

      <IonContent className={`ion-padding ${styles["ion-content"]}`}>
        <TestComponent />
      </IonContent>
    </IonPage>
  );
};

export default Test;
