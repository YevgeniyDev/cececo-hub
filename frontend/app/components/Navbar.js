"use client";

import { useState } from "react";
import styles from "../ui.module.css";
import NavLink from "./NavLink";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Close menu when clicking a link
  function close() {
    setOpen(false);
  }

  return (
    <div className={styles.navWrap}>
      {/* Desktop nav */}
      <nav className={styles.navDesktop}>
        <NavLink
          href="/"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Home
        </NavLink>
        <NavLink
          href="/countries"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Countries
        </NavLink>
        <NavLink
          href="/projects"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Projects
        </NavLink>
        <NavLink
          href="/startups"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Startups
        </NavLink>
        <NavLink
          href="/investors"
          className={styles.navLink}
          activeClassName={styles.navLinkActive}
        >
          Investors
        </NavLink>
      </nav>

      {/* Mobile hamburger */}
      <button
        className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ""}`}
        onClick={() => setOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={open}
      >
        <div className={styles.hamburgerIcon}>
          <span />
          <span />
          <span />
        </div>
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div className={styles.mobileMenu}>
          <NavLink
            href="/"
            className={styles.mobileLink}
            activeClassName={styles.mobileLinkActive}
            onClick={close}
          >
            Home
          </NavLink>

          <NavLink
            href="/countries"
            className={styles.mobileLink}
            activeClassName={styles.mobileLinkActive}
            onClick={close}
          >
            Countries
          </NavLink>

          <NavLink
            href="/projects"
            className={styles.mobileLink}
            activeClassName={styles.mobileLinkActive}
            onClick={close}
          >
            Projects
          </NavLink>

          <NavLink
            href="/startups"
            className={styles.mobileLink}
            activeClassName={styles.mobileLinkActive}
            onClick={close}
          >
            Startups
          </NavLink>

          <NavLink
            href="/investors"
            className={styles.mobileLink}
            activeClassName={styles.mobileLinkActive}
            onClick={close}
          >
            Investors
          </NavLink>
        </div>
      )}
    </div>
  );
}
