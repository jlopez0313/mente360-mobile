import styles from "./Texto.module.scss";

export const Texto: React.FC = () => {
  return (
    <div className={styles.texto}>
      <ol>
        <li className="ion-margin-bottom">
          {" "}
          <strong> Cristo es el centro: </strong> Tu identidad está en ser
          hijo(a) de Dios, no en un eneatipo.{" "}
        </li>
        <li className="ion-margin-bottom">
          {" "}
          <strong> Herramienta, no doctrina: </strong> El eneagrama es solo un
          recurso pedagógico de autoconocimiento.{" "}
        </li>
        <li className="ion-margin-bottom">
          {" "}
          <strong> No sustituye la fe: </strong> No reemplaza la gracia, los
          sacramentos ni la vida espiritual.{" "}
        </li>
        <li className="ion-margin-bottom">
          {" "}
          <strong> Autoconocimiento para crecer: </strong> Sirve para reconocer
          patrones y mejorar tu vida personal y relacional.{" "}
        </li>
        <li className="ion-margin-bottom">
          {" "}
          <strong> Al servicio del Evangelio: </strong> Todo en Mente360 busca
          ayudarte a vivir con mayor libertad, amor y plenitud en Cristo.{" "}
        </li>
      </ol>
    </div>
  );
};
