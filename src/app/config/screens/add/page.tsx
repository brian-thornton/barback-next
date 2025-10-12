"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import savePreferences from "@/lib/preferences-helper";
import { ColorPicker, ColorType } from "@/components/ColorPicker/ColorPicker";
import FileUpload from "@/components/FileUpload/FileUpload";
import { BsX } from "react-icons/bs";

const AddScreen = () => {
  const [headers, setHeaders] = useState<string[]>([]);
  const [newHeader, setNewHeader] = useState<string>("");
  const [preferences, setPreferences] = useState<any>();
  const [screenName, setScreenName] = useState<string>("");
  const [screenTitle, setScreenTitle] = useState<string>("");
  const [colors, setColors] = useState<ColorType>({
    cellBackgroundColor: "#FFFFFF",
    cellTextColor: "#000000",
    headerTextColor: "#000000",
    rowBackgroundColor: "#003366",
    titleColor: "#FFFFFF",
    titleFontSize: "4rem",
    titleFontFamily: "system-ui, -apple-system, sans-serif",
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
    if (!screenName.trim()) {
      alert("Please enter a screen name");
      return;
    }
    if (headers.length === 0) {
      alert("Please add at least one column");
      return;
    }

    try {
      const screens = preferences.screens || [];
      screens.push({
        name: screenName,
        title: screenTitle,
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

  const addColumn = () => {
    if (!newHeader.trim()) {
      alert("Please enter a column name");
      return;
    }
    if (headers.includes(newHeader)) {
      alert("Column name already exists");
      return;
    }
    setHeaders([...headers, newHeader]);
    setNewHeader("");
  };

  const removeColumn = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.header}>Add New Screen</h1>
        
        <div className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Screen Name</label>
            <input 
              className={styles.input} 
              placeholder="Enter screen name" 
              value={screenName}
              onChange={(e) => setScreenName(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Screen Title (Optional)</label>
            <p className={styles.inputHelper}>
              Add a custom title that will be displayed at the top of this screen
            </p>
            <input 
              className={styles.input} 
              placeholder="Enter screen title (optional)" 
              value={screenTitle}
              onChange={(e) => setScreenTitle(e.target.value)} 
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Columns</label>
            <div className={styles.inputRow}>
              <input 
                className={styles.input} 
                placeholder="Enter column name" 
                value={newHeader}
                onChange={(e) => setNewHeader(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addColumn()}
              />
              <button className={styles.columnButton} onClick={addColumn}>
                Add Column
              </button>
            </div>
            
            {headers.length > 0 && (
              <div className={styles.columnList}>
                {headers.map((header, index) => (
                  <div key={index} className={styles.columnTag}>
                    {header}
                    <BsX 
                      className={styles.removeColumn} 
                      onClick={() => removeColumn(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.colorSection}>
          <h2 className={styles.sectionTitle}>Colors</h2>
          <div className={styles.colorPickerContainer}>
            <ColorPicker colors={colors} onChange={onSetColors} />
          </div>
        </div>

        <div className={styles.fileUploadSection}>
          <h2 className={styles.sectionTitle}>Background Image</h2>
          <div className={styles.fileUploadContainer}>
            <FileUpload onFileUpload={uploadFile} />
          </div>
        </div>

        <div className={styles.previewSection}>
          <h3 className={styles.previewTitle}>Preview</h3>
          <div style={{ 
            backgroundColor: colors.rowBackgroundColor,
            padding: '1rem',
            borderRadius: '8px'
          }}>
            <div style={{ 
              color: colors.headerTextColor,
              fontWeight: 'bold',
              marginBottom: '0.5rem'
            }}>
              {headers.join(' | ')}
            </div>
            <div style={{ 
              backgroundColor: colors.cellBackgroundColor,
              color: colors.cellTextColor,
              padding: '0.5rem',
              borderRadius: '4px'
            }}>
              Sample Data
            </div>
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.saveButton} onClick={onSave}>
            Save Screen
          </button>
          <button 
            className={styles.cancelButton} 
            onClick={() => window.location.replace("/config")}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddScreen;