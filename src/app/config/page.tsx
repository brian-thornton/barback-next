"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import savePreferences from "@/lib/preferences-helper";
import ConfigurationHeader from "@/components/ConfigurationHeader/ConfigurationHeader";

const Screens = () => {
  const [preferences, setPreferences] = useState<any>();

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

  useEffect(() => {
    if (preferences?.screens) {
      savePreferences(preferences);
    }
  }, [preferences]);

  const onEditClick = (index: number) => {
    const screen = preferences.screens[index];
    window.location.replace(`/config/screens/edit/${screen.name}`);
  };

  const columns = ["Name", "Columns"];
  const data = preferences?.screens?.map((screen: any) => [screen.name, screen.headers.join(", ")]);

  return (
    <div className={styles.container}>
      <ConfigurationHeader />
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
  );
};

export default Screens;