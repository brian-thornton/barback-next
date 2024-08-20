"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";

type Beer = {
  id: number;
  name: string;
  brewery: string;
  abv: number;
  ibu: number;
  style: string;
  description: string;
};

export default function Home() {
  const [beers, setBeers] = useState<any>([]);

  const loadBeer = async () => {
    try {
      const res = await fetch(`/api/beers`);
      const data = await res.json();
      console.log(data);
      setBeers(data.beers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBeer();
  }, []);

  return beers?.length ? (
    <main className={styles.main}>
      <div className={styles.row}>
        <div className={styles.header}>Name</div>
        <div className={styles.header}>Type</div>
        <div className={styles.header}>Brewery</div>
        <div className={styles.header}>ABV</div>
      </div>
      {beers.map((beer: any) => (
        <div className={styles.row}>
          <div className={styles.text}>{beer?.name}</div>
          <div className={styles.text}>{beer?.type}</div>
          <div className={styles.text}>{beer?.brewery}</div>
          <div className={styles.text}>{beer?.abv}</div>
        </div>
      ))}
    </main>
  ) : (
    <div>No beers configured</div>
  );
}
