"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import ConfigurationHeader from "../../components/ConfigurationHeader/ConfigurationHeader";

import { postData } from "../../lib/service-client";

enum MenuType {
  FullWidth = "fullWidth",
  TwoColumn = "twoColumn",
};

export default function BeerConfigPage() {
  const [colors, setColors] = useState<any>(undefined);
  const savePreferences = async () => await postData("/api/preferences", { preferences });

  const [preferences, setPreferences] = useState<any>({
    beerMenuType: MenuType.FullWidth,
    beerRowBackgroundColor: colors?.rowBackgroundColor || "#000000",
    beerCellBackgroundColor: colors?.cellBackgroundColor || "#000000",
    beerHeaderTextColor: colors?.headerTextColor || "#000000",
    beerCellTextColor: colors?.cellTextColor || "#000000",
  });

  useEffect(() => {
    if (colors) {
      setPreferences({
        beerCellBackgroundColor: colors.cellBackgroundColor,
        beerCellTextColor: colors.cellTextColor,
        beerHeaderTextColor: colors.headerTextColor,
        beerMenuType: MenuType.FullWidth,
        beerRowBackgroundColor: colors.rowBackgroundColor,
      });
    }
  }, [colors]);

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences || {});
      setColors({
        cellBackgroundColor: data?.preferences?.beerCellBackgroundColor || "#000000",
        cellTextColor: data?.preferences?.beerCellTextColor || "#000000",
        headerTextColor: data?.preferences?.beerHeaderTextColor || "#000000",
        rowBackgroundColor: data?.preferences?.beerRowBackgroundColor || "#000000",
      })
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (preferences.beerRowBackgroundColor !== "#000000") {
      savePreferences();
    }
  }, [preferences]);

  useEffect(() => {
    loadPreferences();
  }, []);

  return (
    <main className={styles.main}>
      <ConfigurationHeader />
    </main>
  );
}
