"use client";

import { useEffect, useState } from "react";
import { SITE, SOCIALS } from "@/lib/data";
import { scrollTo } from "@/lib/lenis";
import styles from "./Footer.module.css";

export default function Footer() {
  const [time, setTime] = useState("--:--:--");

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          timeZone: "UTC",
          hour12: false,
        })
      );
    };
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
              <h4>Community</h4>
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
              <h4>Explore</h4>
              <ul>
                <li>
                  <a
                    href="#collection"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("#collection", { offset: -40 });
                    }}
                  >
                    Collection
                  </a>
                </li>
                <li>
                  <a
                    href="#roadmap"
                    onClick={(e) => {
                      e.preventDefault();
                      scrollTo("#roadmap", { offset: -40 });
                    }}
                  >
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href={SITE.openSeaUrl} target="_blank" rel="noopener noreferrer">
                    OpenSea
                  </a>
                </li>
              </ul>
            </div>
            <div className={styles.col}>
              <h4>Mission Clock · UTC</h4>
              <div className={styles.clock}>
                T+ <b>{time}</b>
              </div>
            </div>
          </div>

          <button
            className={styles.toTop}
            onClick={() => scrollTo("#top", { offset: 0 })}
          >
            Back to top
            <i aria-hidden="true">↑</i>
          </button>
        </div>
      </div>

      <div className={styles.wordmark} aria-hidden="true">
        {SITE.name}
      </div>

      <div className="container">
        <div className={styles.legal}>
          <span>
            © {SITE.year} {SITE.name}. Reimagined design build. Original concept
            by{" "}
            <a href={SITE.credit.url} target="_blank" rel="noopener noreferrer">
              {SITE.credit.name}
            </a>
            .
          </span>
          <span className={styles.legalLinks}>
            <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo("#top"); }}>
              Privacy Policy
            </a>
            <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo("#top"); }}>
              Terms &amp; Conditions
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
