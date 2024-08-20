"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { BsTrash3 } from "react-icons/bs";

export default function Config() {
  const [beers, setBeers] = useState<any>([]);

  const loadBeer = async () => {
    try {
      const res = await fetch(`/api/beers`);
      const data = await res.json();
      setBeers(data.beers);
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = async () => {
    try {
      await fetch(`/api/beers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ beers }),
      });
    } catch (err) {
      console.log(err);
    }
  };

  const onAddClick = () => {
    if (beers?.length > 0) {
      setBeers([...beers, { name: "", type: "", brewery: "", abv: 0, quantity: 0 }]);
    } else {
      setBeers([{
        name: "", type: "", brewery: "", abv: 0, quantity: 0
      }]);
    };
  };

  const onDeleteClick = (index: number) => {
    const newBeers = beers.filter((beer: any, i: number) => i !== index);
    setBeers(newBeers);
  };

  useEffect(() => {
    loadBeer();
  }, []);

  const onChange = (e: any, beer: any, field: string) => {
    beer[field] = e.target.value;
  }

  return (
    <main className={styles.main}>
      <h1>Beers</h1>
      <div className={styles.beerContainer}>
        {beers?.map((beer: any, index: number) => (
          <div className={styles.inputRow}>
            <input className={styles.input} defaultValue={beer?.name} onChange={(e) => onChange(e, beer, "name")} />
            <input className={styles.input} defaultValue={beer?.type} onChange={(e) => onChange(e, beer, "type")} />
            <input className={styles.input} defaultValue={beer?.brewery} onChange={(e) => onChange(e, beer, "brewery")} />
            <input className={styles.input} defaultValue={beer?.abv} onChange={(e) => onChange(e, beer, "abv")} />
            <input className={styles.input} defaultValue={beer?.quantity} onChange={(e) => onChange(e, beer, "quantity")} />
            <BsTrash3 className={styles.trash} onClick={() => onDeleteClick(index)}/>
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
