"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { scrollTo, getLenis } from "@/lib/lenis";
import { NAV_LINKS, SITE, SOCIALS } from "@/lib/data";
import MagneticButton from "./MagneticButton";
import styles from "./Nav.module.css";

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);

  // scroll: glass + hide-on-down / show-on-up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(y > last && y > 320);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // overlay open/close choreography + scroll lock
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    const lenis = getLenis();
    const links = overlay.querySelectorAll(`.${styles.overlayLink}`);
    const foot = overlay.querySelector(`.${styles.overlayFoot}`);

    if (open) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
      gsap.to(overlay, {
        clipPath: "inset(0 0 0% 0)",
        duration: 0.7,
        ease: "expo.out",
      });
      gsap.fromTo(
        links,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 0.7,
          ease: "expo.out",
          stagger: 0.07,
          delay: 0.12,
        }
      );
      gsap.fromTo(foot, { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.4 });
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      gsap.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.55,
        ease: "expo.in",
      });
    }
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    // wait for the overlay to start closing before scrolling
    setTimeout(() => scrollTo(href, { offset: -40 }), open ? 280 : 0);
  };

  return (
    <>
      <header
        ref={navRef}
        className={`${styles.nav} ${scrolled ? styles.scrolled : ""} ${
          hidden && !open ? styles.hidden : ""
        } ${open ? styles.open : ""}`}
      >
        <a
          href="#top"
          className={styles.logo}
          onClick={(e) => {
            e.preventDefault();
            scrollTo("#top", { offset: 0 });
          }}
          aria-label={`${SITE.name} — back to top`}
        >
          <span className={styles.logoMark} />
          {SITE.name}
        </a>

        <nav className={styles.links} aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
            >
              <span className={styles.flip}>
                <span>{l.label}</span>
                <span>{l.label}</span>
              </span>
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <span className={styles.mintWrap}>
            <MagneticButton href="#mint" variant="primary" dataCursor="Mint">
              Mint Now
            </MagneticButton>
          </span>
          <button
            className={styles.burger}
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={overlayRef}
        className={`${styles.overlay} ${open ? styles.shown : ""}`}
      >
        <div className={styles.overlayLinks}>
          {NAV_LINKS.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              className={styles.overlayLink}
              onClick={(e) => {
                e.preventDefault();
                go(l.href);
              }}
            >
              <span className={styles.idx}>0{i + 1}</span>
              {l.label}
            </a>
          ))}
          <a
            href="#mint"
            className={styles.overlayLink}
            onClick={(e) => {
              e.preventDefault();
              go("#mint");
            }}
          >
            <span className={styles.idx}>→</span>
            <span className="text-gradient">Mint Now</span>
          </a>
        </div>
        <div className={styles.overlayFoot}>
          {SOCIALS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
