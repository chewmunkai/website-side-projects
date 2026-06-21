"use client";

import { useState } from "react";
import { FAQS } from "@/lib/data";
import ScrubText from "./ScrubText";
import styles from "./Faq.module.css";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className={`${styles.faq} section`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.aside}>
            <span className="eyebrow">Questions</span>
            <ScrubText as="h2" className={styles.title}>
              Before you arrive
            </ScrubText>
            <p className={styles.asideText}>
              Honest answers about a long stay in Malaysia — what it feels like,
              and where to find the official details.
            </p>
          </div>

          <div className={styles.list}>
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={`${styles.item} ${isOpen ? styles.open : ""}`}
                >
                  <button
                    className={styles.q}
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-body-${i}`}
                  >
                    {f.q}
                    <span className={styles.icon} aria-hidden="true" />
                  </button>
                  <div
                    className={styles.body}
                    id={`faq-body-${i}`}
                    inert={!isOpen}
                  >
                    <div className={styles.bodyInner}>
                      <p className={styles.a}>{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
