import { useHistory } from "react-router-dom";

/**
 * Guard de comunidad principal. Devuelve una función para llamar al intentar
 * abrir contenido del home (audio del día, tareas, mensaje, noche, S.O.S.):
 * si no hay una comunidad principal válida seleccionada, redirige a
 * /seleccionar-comunidad y devuelve false para cortar la acción.
 *
 * "Válida" = un id numérico > 0 (un "0" guardado por error no cuenta). La
 * limpieza de una principal que apunta a una comunidad ya no suscrita la hace
 * usePrincipalReminder al entrar al Home.
 */
export const useRequirePrincipal = () => {
  const history = useHistory();

  return (): boolean => {
    const stored = Number(localStorage.getItem("principal"));
    if (Number.isFinite(stored) && stored > 0) return true;

    localStorage.removeItem("principal");
    history.push("/seleccionar-comunidad");
    return false;
  };
};
