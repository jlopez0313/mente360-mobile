import { db } from "@/hooks/useDexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useHistory } from "react-router-dom";

const HIPNOSIS_CATEGORY_KEY = "hipnosis";

/**
 * Categoría "Hipnosis sanadoras" de Musicoterapia (tabla `categorias`/`clips`,
 * NO `categorias_noche`): es el CTA fijo que se muestra tanto en el menú de "Mi
 * noche" como al final de "Elige otro audio" en la noche guiada. Si la categoría
 * no existe (aún no sincronizada / renombrada), goToHipnosis cae a /musicaterapia
 * sin filtro en vez de no hacer nada.
 */
export const useHipnosisCategory = () => {
  const history = useHistory();

  const hipnosisCategory = useLiveQuery(async () => {
    const cats = await db.categorias.toArray();
    return (
      cats.find((c) =>
        (c.categoria || "").toLowerCase().includes(HIPNOSIS_CATEGORY_KEY)
      ) ?? null
    );
  });

  const goToHipnosis = () => {
    if (hipnosisCategory?.id) {
      sessionStorage.setItem(
        "musicaterapia_category",
        String(hipnosisCategory.id)
      );
      sessionStorage.setItem("musicaterapia_tab", "clips");
      sessionStorage.removeItem("musicaterapia_search");
    }

    history.push("/musicaterapia");
  };

  return { hipnosisCategory, goToHipnosis };
};
