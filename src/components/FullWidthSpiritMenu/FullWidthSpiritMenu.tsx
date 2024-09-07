"use client";
import { useState, useEffect } from "react";
import styles from "./FullWidthSpiritMenu.module.css";

export default function FullWidthSpiritMenu({preferences}: any) {
  const [spirits, setSpirits] = useState<any>([]);

  const loadSpirits = async () => {
    try {
      const res = await fetch(`/api/spirits`);
      const data = await res.json();
      console.log(data);
      setSpirits(data.spirits);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadSpirits();
  }, []);

  return spirits?.length ? (
    <div className={styles.container}>
      <div className={styles.row} style={{background: preferences?.beerRowBackgroundColor}}>
        <div className={styles.header}>Name</div>
        <div className={styles.header}>Type</div>
        <div className={styles.header}>Distillery</div>
        <div className={styles.header}>ABV</div>
      </div>
      {spirits.map((spirit: any) => (
        <div className={styles.row} style={{background: preferences?.beerRowBackgroundColor}}>
          <div className={styles.text}>{spirit?.name}</div>
          <div className={styles.text}>{spirit?.type}</div>
          <div className={styles.text}>{spirit?.distillery}</div>
          <div className={styles.text}>{spirit?.abv}</div>
        </div>
      ))}
    </div>
  ) : (
    <div>No beers configured</div>
  );
}
