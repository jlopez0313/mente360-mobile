import downloadingAnim from "@/assets/json/downloading.json";
import errorAnim from "@/assets/json/error-animation.json";
import successAnim from "@/assets/json/success-animation.json";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import styles from "./Sync.module.scss";

export const Sync = ({
    loading,
    success,
    mensaje,
}: {
    loading: boolean;
    success: boolean;
    mensaje: string;
}) => {
    return (
        <AnimatePresence>
            {(loading || success) && (
                <motion.div
                    className={styles["clip-sync-toast"]}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                >
                    <div className={styles["clip-sync-content"]}>
                        <Lottie
                            animationData={loading ? downloadingAnim : success ? successAnim : errorAnim}
                            loop={loading}
                            style={{ width: 35, height: 35 }}
                        />
                        <div className={styles["clip-sync-text"]}>
                            {mensaje}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
