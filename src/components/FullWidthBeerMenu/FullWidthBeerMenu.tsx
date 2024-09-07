"use client";
import { useState, useEffect } from "react";
import styles from "./FullWidthBeerMenu.module.css";

export default function FullWidthBeerMenu({preferences}: any) {
  const [beers, setBeers] = useState<any>([]);
  const { beerRowBackgroundColor, beerCellBackgroundColor, beerCellTextColor, beerHeaderTextColor  } = preferences || {};

  const loadBeer = async () => {
    try {
      const res = await fetch(`/api/beers`);
      const data = await res.json();
      setBeers(data.beers);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadBeer();
  }, []);

  const cellStyles = {
    backgroundColor: beerCellBackgroundColor,
    color: beerCellTextColor,
  };

  return beers?.length ? (
    <div className={styles.container}>
      <div className={styles.row} style={{background: beerRowBackgroundColor}}>
        <div className={styles.header} style={cellStyles}>Name</div>
        <div className={styles.header} style={cellStyles}>Type</div>
        <div className={styles.header} style={cellStyles}>Brewery</div>
        <div className={styles.header} style={cellStyles}>ABV</div>
      </div>
      {beers.map((beer: any) => (
        <div className={styles.row} style={{background: beerRowBackgroundColor}}>
          <div className={styles.text} style={cellStyles}>{beer?.name}</div>
          <div className={styles.text} style={cellStyles}>{beer?.type}</div>
          <div className={styles.text} style={cellStyles}>{beer?.brewery}</div>
          <div className={styles.text} style={cellStyles}>{beer?.abv}</div>
        </div>
      ))}
    </div>
  ) : (
    <div>No beers configured</div>
  );
}
