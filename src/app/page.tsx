"use client";
import { createContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import FullWidthBeerMenu from "@/components/FullWidthBeerMenu/FullWidthBeerMenu";
import FullWidthSpiritMenu from "@/components/FullWidthSpiritMenu/FullWidthSpiritMenu";

export default function Home() {
  const [menu, setMenu] = useState<string>("beer");
  const [preferences, setPreferences] = useState<any>();

  // setInterval(() => changeMenu(), 30000);

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const changeMenu = () => {
    if (menu === "beer") {
      setMenu("spirits");
    }

    if (menu === "spirits") {
      setMenu("beer");
    }
  };

  return (
    <main className={styles.main}>
      {menu === 'beer' && <FullWidthBeerMenu preferences={preferences} />}
      {menu === 'spirits' && <FullWidthSpiritMenu preferences={preferences} />}
    </main>
  );
};
