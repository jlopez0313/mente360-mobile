import styles from './Texto.module.scss'

interface Props {
  descripcion: any;
  children: any
}

export const Texto: React.FC<Props> = ({ descripcion, children= null }) => {
  return (
    <div className={styles.texto}>
      <p>
       {descripcion}
      </p>

      { children }
    </div>
  );
};
