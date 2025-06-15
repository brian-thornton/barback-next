"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { savePreferences } from "@/lib/preferences-helper";

const EditColumns= () => {
  const [preferences, setPreferences] = useState<any>();
  const secondToLastPart = window.location.href.split("/").slice(-2)[0];
  const screen = preferences?.screens?.find((screen: any) => screen.name === secondToLastPart);
  const headers = screen?.headers || [];
  const rows = screen?.headers || [];

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

  const onSave = async (data: any) => {
    const newRow = Object.keys(data).map((key) => data[key]);

    try {
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === secondToLastPart);
      const updatedRows = screens[index].rows || [];
      updatedRows.push(newRow);

      screens[index] = {
        name: secondToLastPart,
        headers,
        rows: updatedRows,
      };

      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
    } catch (err) {
      console.log(err);
    }
  };

  const onDone = () => {
    window.location.replace('/config');
  };

  const onDeleteClick = async (index: number) => {
    const screens = preferences.screens || [];
    const screenIndex = screens.findIndex((screen: any) => screen.name === secondToLastPart);
    const updatedRows = screens[screenIndex].rows || [];
    updatedRows.splice(index, 1);

    screens[screenIndex] = {
      name: secondToLastPart,
      headers,
      rows: updatedRows,
    };

    setPreferences({ ...preferences, screens });
    await savePreferences({ ...preferences, screens });
  };

  console.log(headers);
  console.log(rows);

  return (
    <div className={styles.container}>
      <div className={styles.screenName}>{screen?.name}</div>
      <Table columns={headers} data={rows} onSave={onSave} onDeleteClick={onDeleteClick}/> 
    </div>
  );
};

export default EditColumns;