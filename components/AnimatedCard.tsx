"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

type AnimatedCardProps = {
  index: number;
  children: ReactNode;
};

export default function AnimatedCard({ index, children }: AnimatedCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, delay: index * 0.1, type: "spring", stiffness: 200 }}
    >
      {children}
    </motion.article>
  );
}
