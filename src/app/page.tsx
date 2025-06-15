"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import DisplayMenu from "@/components/DisplayMenu/DisplayMenu";

export default function Home() {
  const [preferences, setPreferences] = useState<any>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [screenIndex, setScreenIndex] = useState<number>(0);

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
    setTimeout(() => changeMenu(), 10000);
  }, []);

  useEffect(() => {
    if (preferences?.screens.length > 0) {
      setHeaders(preferences.screens[screenIndex].headers);
      setRows(preferences.screens[screenIndex].rows);
    }
  }, [preferences]);

  const screens = preferences?.screens || [];

  const changeMenu = () => {
    if (screens.length > 1) {
      if (screenIndex === screens.length - 1) {
        setScreenIndex(0);
      } else {
        setScreenIndex(screenIndex + 1);
      }
    }
  };

  useEffect(() => {
    if (screens.length > 0) {
      setHeaders(screens[screenIndex].headers);
      setRows(screens[screenIndex].rows);
      setTimeout(() => changeMenu(), 10000);
    }
  }, [screenIndex]);

  return (
    <main className={styles.main} style={{ backgroundImage: `url(./${preferences?.screens[screenIndex]?.name}_background.jpg)` }}>
      {preferences?.screens.length > 0 && (
        <DisplayMenu
          preferences={preferences}
          headers={headers}
          // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'rows' implicitly has an 'any' type.
          rows={rows || [[]]}
          colors={preferences.screens[screenIndex].colors}
        />
      )}
      {preferences?.screens.length === 0 && (
        <div>
          <h1>No screens found</h1>
          <p>Please add a screen in the <a className={styles.link} href="/config/screens">configuration</a></p>
        </div>
      )}
    </main>
  );
};
