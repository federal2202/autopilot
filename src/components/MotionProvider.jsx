"use client";

import { LazyMotion, domMax } from "framer-motion";

export default function MotionProvider({ children }) {
  return (
    // domMax (not domAnimation) — layout animations (ServicesList's
    // `layout="position"`, see that file) need the bigger feature bundle;
    // domAnimation alone doesn't include them.
    <LazyMotion features={domMax} strict>
      {children}
    </LazyMotion>
  );
}
