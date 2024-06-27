import styles from './Texto.module.scss'

interface Props {
  descripcion: any;
}

export const Texto: React.FC<Props> = ({ descripcion }) => {
  return (
    <div className={styles.texto}>
      <p>
       {descripcion}
      </p>
    </div>
  );
};
