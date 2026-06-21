"use client";

import { useEffect, useState } from "react";
import { SITE, SOCIALS, NAV_LINKS, FOOTER_TAGLINE } from "@/lib/data";
import { scrollTo } from "@/lib/lenis";
import styles from "./Footer.module.css";

export default function Footer() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () =>
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kuala_Lumpur",
          hour12: false,
        })
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.top}>
          <div className={styles.cols}>
            <div className={styles.col}>
              <h4>Explore</h4>
              <ul>
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollTo(l.href, { offset: -40 });
                      }}
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Official</h4>
              <ul>
                {SOCIALS.map((s) => (
                  <li key={s.label}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Kuala Lumpur · Local Time</h4>
              <div className={styles.clock}>
                <b>{time}</b> MYT
              </div>
            </div>
          </div>

          <button
            type="button"
            className={styles.toTop}
            onClick={() => scrollTo("#top", { offset: 0 })}
          >
            Back to top
            <i aria-hidden="true">↑</i>
          </button>
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        MALAYSIA
      </div>

      <div className="container">
        <div className={styles.legal}>
          <span>
            © {SITE.year} {SITE.name}. An independent concept experience — not
            affiliated with the official MM2H programme.
          </span>
          <span className={styles.legalLinks}>
            <span className="muted">{FOOTER_TAGLINE}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
