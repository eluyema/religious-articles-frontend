"use client";

import { useEffect } from "react";
import styles from "./index.module.scss";

const HeaderScrollScript = () => {
    useEffect(() => {
        const header = document.getElementById("main-header");
        if (!header) return;

        let lastScrollY = window.scrollY;

        const onScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY && currentScrollY > 50) {
                header.classList.add(styles["header-hidden"]);
            } else {
                header.classList.remove(styles["header-hidden"]);
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return null; // this component only runs script, no UI
};

export default HeaderScrollScript;
