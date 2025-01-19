"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import savePreferences from "@/lib/preferences-helper";
import { ColorPicker, ColorType } from "@/components/ColorPicker/ColorPicker";
import FileUpload from "@/components/FileUpload/FileUpload";

const AddScreen = () => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [newHeader, setNewHeader] = useState<string>("");
  const [preferences, setPreferences] = useState<any>();
  const [screenName, setScreenName] = useState<string>("");
  const [colors, setColors] = useState<ColorType>({
    cellBackgroundColor: "#000000",
    cellTextColor: "#000000",
    headerTextColor: "#000000",
    rowBackgroundColor: "#000000",
  });

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences || {});
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  const onSave = async () => {
    try {
      const screens = preferences.screens || [];
      screens.push({
        name: screenName,
        headers: headers,
        colors: colors,
      });

      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
      window.location.replace("/config/screens");
    } catch (err) {
      console.log(err);
    }
  };

  const onSetColors = (updatedColors: ColorType) => {
    setColors(updatedColors);
  };

  const uploadFile = async (formData: FormData) => {
    const response = await fetch(`/api/preferences/background?name=${screenName}_background`, {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    console.log(result);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>Add New Screen</div>
      <div className={styles.form}>
        <input className={styles.input} placeholder="Screen Name" onChange={(e) => setScreenName(e.target.value)} />
        {headers.map((header, index) => (
          <div key={index}>{header}</div>
        ))}
        <div className={styles.inputRow}>
          <input className={styles.input} placeholder="Column" onChange={(e) => setNewHeader(e.target.value)} />
          <button className={styles.columnButton} onClick={() => setHeaders([...headers, newHeader])}>
            Add Column
          </button>
        </div>
      </div>
      <ColorPicker colors={colors} onChange={onSetColors} />
      <FileUpload onFileUpload={uploadFile} />
      <div className={styles.buttonRow}>
        <button className={styles.saveButton} onClick={() => onSave()}>Save Screen</button>
        <button className={styles.cancelButton} onClick={() => window.location.replace("/config/screens")}>Cancel</button>
      </div>
    </div>
  );
};

export default AddScreen;