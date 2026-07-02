import { motion } from "framer-motion";

const MotionDiv = motion.div;

function RouteTransition({ children }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      {children}
    </MotionDiv>
  );
}

export default RouteTransition;

