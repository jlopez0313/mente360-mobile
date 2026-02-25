import animationData from "@/assets/json/success-animation.json";
import { AnimatePresence, motion } from "framer-motion";
import Lottie from "lottie-react";
import { useEffect } from "react";

import confetti from "canvas-confetti";

export const SuccessOverlay = ({
	show,
	onDone,
}: {
	show: boolean;
	onDone?: () => void;
}) => {
	const lanzarConfetti = () => {
		confetti({
			particleCount: 100,
			spread: 70,
			origin: { y: 0.6 },
		});
	};

	useEffect(() => {
		show && lanzarConfetti();
	}, [show]);

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-9999"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					onAnimationComplete={onDone}
				>
					<Lottie
						animationData={animationData}
						style={{ width: 200, height: 200 }}
						loop={false}
					/>
				</motion.div>
			)}
		</AnimatePresence>
	);
};