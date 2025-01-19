"use client";
import { useState, useEffect } from "react";
import { savePreferences } from "@/lib/preferences-helper";
import { saveSpirits } from "@/lib/spirits-helper";
import { postData } from "@/lib/service-client";
import Table from "@/components/Table/Table";
import ColorPicker from "@/components/ColorPicker/ColorPicker";

import styles from "./page.module.css";
import ConfigurationHeader from "../../../components/ConfigurationHeader/ConfigurationHeader";

enum MenuType {
  FullWidth = "fullWidth",
  TwoColumn = "twoColumn",
};

export default function SpiritsConfigPage() {
  const [spirits, setSpirits] = useState<any>([]);
  const [colors, setColors] = useState<any>(undefined);
  const [colorsOpen, setColorsOpen] = useState<boolean>(false);
  const saveSpirits = async () => await postData("/api/spirits", { spirits });
  const [preferences, setPreferences] = useState<any>({
    spiritMenuType: MenuType.FullWidth
  });
  const columnHeaders = ["Name", "Type", "Distillery", "ABV", "Quantity"];
  const tableData = spirits.map((spirit: any) => [spirit.name, spirit.type, spirit.distillery, spirit.abv, spirit.quantity]);

  const loadSpirits = async () => {
    try {
      const res = await fetch(`/api/spirits`);
      const data = await res.json();
      setSpirits(data.spirits);
    } catch (err) {
      console.log(err);
    }
  };

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences || {});
      console.log(data);
      setColors({
        cellBackgroundColor: data?.preferences?.spiritCellBackgroundColor || "#000000",
        cellTextColor: data?.preferences?.spiritCellTextColor || "#000000",
        headerTextColor: data?.preferences?.spiritHeaderTextColor || "#000000",
        rowBackgroundColor: data?.preferences?.spiritRowBackgroundColor || "#000000",
      })
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = async () => {
    await saveSpirits();
    await savePreferences(preferences);
  };

  const onDeleteClick = (index: number) => {
    const newSpirits = spirits.filter((beer: any, i: number) => i !== index);
    setSpirits(newSpirits);
  };

  useEffect(() => {
    loadSpirits();
    loadPreferences();
  }, []);

  useEffect(() => {
    if (spirits && spirits.length) {
      saveSpirits();
    }
  }, [spirits]);

  useEffect(() => {
    if (preferences.spiritRowBackgroundColor !== "#000000") {
      savePreferences(preferences);
    }
  }, [preferences]);

  const onSelectMenuType = (e: any) => {
    setPreferences({ menuType: e.target.value });
  };

  return (
    <main className={styles.main}>
      <ConfigurationHeader />
      <h1 className={styles.header}>Spirits</h1>
      <div className={styles.beerContainer}>
        <div className={styles.selectContainer}>
          <div>Menu Type:</div>
          <select className={styles.selectContainer} onChange={onSelectMenuType}>
            <option value={MenuType.FullWidth}>Full Width</option>
            <option value={MenuType.TwoColumn}>Two Column</option>
          </select>
          <button onClick={() => setColorsOpen(!colorsOpen)}>Colors</button>
        </div>
        {colors && colorsOpen && <ColorPicker colors={colors} onChange={setColors} />}
        <Table
          columns={columnHeaders}
          data={tableData}
          onDeleteClick={onDeleteClick}
          onSave={(obj: any) => {
            setSpirits([...spirits, obj]);
          }}
        />
      </div>
    </main>
  );
}
