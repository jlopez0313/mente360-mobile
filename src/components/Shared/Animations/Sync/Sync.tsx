import downloadingAnim from "@/assets/json/downloading.json";
import errorAnim from "@/assets/json/error-animation.json";
import successAnim from "@/assets/json/success-animation.json";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";

export const Sync = ({
  loading,
  success,
  error,
  mensaje,
}: {
  loading: boolean;
  success: boolean;
  error: boolean;
  mensaje: string;
}) => {
  return (
    <AnimatePresence>
      {(loading || success || error) && (
        <motion.div
          className="fixed right-4 bottom-4 z-50 rounded-lg bg-white shadow-lg p-4 flex items-center space-x-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          <div className="flex items-center gap-3">
            <Lottie
              animationData={
                loading ? downloadingAnim : success ? successAnim : errorAnim
              }
              loop={loading}
              style={{ width: 35, height: 35 }}
            />
            <span className="text-sm font-semibold" >{mensaje}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
