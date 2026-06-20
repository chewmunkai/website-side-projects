"use client";

import { useState } from "react";
import { FAQS } from "@/lib/data";
import styles from "./Faq.module.css";

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className={`${styles.faq} section`}>
      <div className="container">
        <div className={styles.layout}>
          <div className={styles.aside}>
            <span className="eyebrow">Questions</span>
            <h2 className={styles.title}>
              Before you <em>orbit</em>
            </h2>
            <p className={styles.asideText}>
              Everything you need to know about the collection, ownership and
              how to claim your world.
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
                  <div className={styles.body} id={`faq-body-${i}`} role="region">
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
