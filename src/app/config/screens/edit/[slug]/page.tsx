"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { savePreferences } from "@/lib/preferences-helper";
import { ColorPicker, ColorType } from "@/components/ColorPicker/ColorPicker";

const EditScreen = () => {
  const [preferences, setPreferences] = useState<any>();
  const [colors, setColors] = useState<ColorType>()
  const lastPart = window.location.href.split("/").pop();
  const screen = preferences?.screens?.find((screen: any) => screen.name === lastPart);
  const headers = screen?.headers || [];
  const rows = screen?.rows || [];

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
    const defaultColors = {
      cellBackgroundColor: "#000000",
      cellTextColor: "#000000",
      headerTextColor: "#000000",
      rowBackgroundColor: "#000000",
    }

    if (preferences) {
      setColors(preferences?.screens?.find((screen: any) => screen.name === lastPart).colors ?? defaultColors);
    }
  }, [preferences])

  useEffect(() => {
    loadPreferences();
  }, []);

  const onSaveColors = async () => {
    try {
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === lastPart);

      screens[index] = {
        name: screens[index].name,
        headers: screens[index].headers,
        rows: screens[index].rows,
        colors: colors,
      };

      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = async (data: any) => {
    const newRow = Object.keys(data).map((key) => data[key]);

    try {
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === lastPart);
      const updatedRows = screens[index].rows || [];
      updatedRows.push(newRow);

      screens[index] = {
        name: lastPart,
        headers,
        rows: updatedRows,
        colors: colors,
      };

      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
    } catch (err) {
      console.log(err);
    }
  };

  const onDone = () => {
    window.location.replace('/config/screens');
  };

  const onColorsUpdated = (updatedColors: ColorType) => {
    setColors(updatedColors);
  };

  const onDeleteClick = async (index: number) => {
    const screens = preferences.screens || [];
    const screenIndex = screens.findIndex((screen: any) => screen.name === lastPart);
    const updatedRows = screens[screenIndex].rows || [];
    updatedRows.splice(index, 1);

    screens[screenIndex] = {
      name: lastPart,
      headers,
      rows: updatedRows,
    };

    setPreferences({ ...preferences, screens });
    await savePreferences({ ...preferences, screens });
  };

  return (
    <div className={styles.container}>
      <div className={styles.screenName}>{screen?.name}</div>
      <Table columns={headers} data={rows} onSave={onSave} onDeleteClick={onDeleteClick} onDone={onDone} /> 
      {colors && <ColorPicker onChange={onColorsUpdated} colors={colors} />}
      <button className={styles.saveButton} onClick={onSaveColors}>Save</button>
    </div>
  );
};

export default EditScreen;