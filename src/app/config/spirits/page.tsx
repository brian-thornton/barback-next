"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { BsTrash3 } from "react-icons/bs";
import ConfigurationHeader from "../../../components/ConfigurationHeader/ConfigurationHeader";

enum MenuType {
  FullWidth = "fullWidth",
  TwoColumn = "twoColumn",
};

export default function SpiritsConfigPage() {
  const [spirits, setSpirits] = useState<any>([]);
  const [preferences, setPreferences] = useState<any>({
    spiritMenuType: MenuType.FullWidth
  });

  const loadSpirits = async () => {
    try {
      const res = await fetch(`/api/spirits`);
      const data = await res.json();
      setSpirits(data.spirits);
    } catch (err) {
      console.log(err);
    }
  };

  const saveSpirits = async () => {
    try {
      await fetch(`/api/spirits`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ spirits }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const savePreferences = async () => {
    try {
      await fetch(`/api/preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ preferences }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = async () => {
    await saveSpirits();
    await savePreferences();
  };

  const onAddClick = () => {
    if (spirits?.length > 0) {
      setSpirits([...spirits, { name: "", type: "", distillery: "", abv: 0, quantity: 0 }]);
    } else {
      setSpirits([{
        name: "", type: "", distillery: "", abv: 0, quantity: 0
      }]);
    };
  };

  const onDeleteClick = (index: number) => {
    const newSpirits = spirits.filter((beer: any, i: number) => i !== index);
    setSpirits(newSpirits);
  };

  useEffect(() => {
    loadSpirits();
  }, []);

  const onChange = (e: any, spirit: any, field: string) => {
    spirit[field] = e.target.value;
  }

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
        </div>
        {spirits?.map((spirit: any, index: number) => (
          <div className={styles.inputRow}>
            <input className={styles.input} defaultValue={spirit?.name} onChange={(e) => onChange(e, spirit, "name")} />
            <input className={styles.input} defaultValue={spirit?.distillery} onChange={(e) => onChange(e, spirit, "type")} />
            <input className={styles.input} defaultValue={spirit?.abv} onChange={(e) => onChange(e, spirit, "distillery")} />
            <input className={styles.input} defaultValue={spirit?.quantity} onChange={(e) => onChange(e, spirit, "quantity")} />
            <BsTrash3 className={styles.trash} onClick={() => onDeleteClick(index)} />
          </div>
        ))}
        <div className={styles.inputRow}>
          <button className={styles.button} onClick={onSave}>Save</button>
          <button className={styles.button} onClick={onAddClick}>Add</button>
        </div>
      </div>
    </main>
  );
}
