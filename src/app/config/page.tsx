"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import savePreferences from "@/lib/preferences-helper";
import ConfigurationHeader from "@/components/ConfigurationHeader/ConfigurationHeader";

const Screens = () => {
  const [preferences, setPreferences] = useState<any>();
  const [cycleInterval, setCycleInterval] = useState<number>(10);
  const [isEditingInterval, setIsEditingInterval] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [isEditingRowsPerPage, setIsEditingRowsPerPage] = useState(false);

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences);
      setCycleInterval(data.preferences.cycleInterval || 10);
      setRowsPerPage(data.preferences.rowsPerPage || 10);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences?.screens) {
      savePreferences(preferences);
    }
  }, [preferences]);

  const onEditClick = (index: number) => {
    const screen = preferences.screens[index];
    window.location.replace(`/config/screens/edit/${screen.name}`);
  };

  const handleCycleIntervalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setCycleInterval(value);
    }
  };

  const saveCycleInterval = async () => {
    const updatedPreferences = {
      ...preferences,
      cycleInterval: cycleInterval
    };
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
    setIsEditingInterval(false);
  };

  const handleRowsPerPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setRowsPerPage(value);
    }
  };

  const saveRowsPerPage = async () => {
    const updatedPreferences = {
      ...preferences,
      rowsPerPage: rowsPerPage
    };
    setPreferences(updatedPreferences);
    await savePreferences(updatedPreferences);
    setIsEditingRowsPerPage(false);
  };

  const columns = ["Name", "Columns"];
  const data = preferences?.screens?.map((screen: any) => [screen.name, screen.headers.join(", ")]);

  return (
    <div className={styles.container}>
      <ConfigurationHeader />
      
      <div className={styles.settingsCard}>
        <h2 className={styles.settingsTitle}>Display Settings</h2>
        
        <div className={styles.settingRow}>
          <label className={styles.settingLabel}>
            Cycle Interval (seconds):
            <span className={styles.settingHelper}>
              Time between page/screen changes (default: 10 seconds)
            </span>
          </label>
          <div className={styles.settingControl}>
            {isEditingInterval ? (
              <>
                <input
                  type="number"
                  className={styles.input}
                  value={cycleInterval}
                  onChange={handleCycleIntervalChange}
                  min="1"
                  step="1"
                  autoFocus
                />
                <button className={styles.button} onClick={saveCycleInterval}>
                  Save
                </button>
                <button 
                  className={styles.button} 
                  onClick={() => {
                    setCycleInterval(preferences?.cycleInterval || 10);
                    setIsEditingInterval(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className={styles.settingValue}>
                  {cycleInterval} seconds
                </span>
                <button 
                  className={styles.button} 
                  onClick={() => setIsEditingInterval(true)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>

        <div className={styles.settingRow}>
          <label className={styles.settingLabel}>
            Rows Per Page:
            <span className={styles.settingHelper}>
              Number of rows to display per page (default: 10). If a screen has more rows, they will be split across multiple pages.
            </span>
          </label>
          <div className={styles.settingControl}>
            {isEditingRowsPerPage ? (
              <>
                <input
                  type="number"
                  className={styles.input}
                  value={rowsPerPage}
                  onChange={handleRowsPerPageChange}
                  min="1"
                  step="1"
                  autoFocus
                />
                <button className={styles.button} onClick={saveRowsPerPage}>
                  Save
                </button>
                <button 
                  className={styles.button} 
                  onClick={() => {
                    setRowsPerPage(preferences?.rowsPerPage || 10);
                    setIsEditingRowsPerPage(false);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <span className={styles.settingValue}>
                  {rowsPerPage} rows
                </span>
                <button 
                  className={styles.button} 
                  onClick={() => setIsEditingRowsPerPage(true)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.screensSection}>
        <h2 className={styles.sectionHeader}>Screens</h2>
        <Table
          columns={columns || []}
          data={data || []}
          onDeleteClick={(index: number) => {
            preferences.screens.splice(index, 1);
            setPreferences({ ...preferences });
          }}
          onEditClick={onEditClick}
          addUrl="/config/screens/add"
        />
      </div>
    </div>
  );
};

export default Screens;