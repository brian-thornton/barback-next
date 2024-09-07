"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { BsTrash3 } from "react-icons/bs";
import ConfigurationHeader from "../../components/ConfigurationHeader/ConfigurationHeader";

import { getData, postData } from "../../lib/service-client";
import ColorPicker from "@/components/ColorPicker/ColorPicker";

enum MenuType {
  FullWidth = "fullWidth",
  TwoColumn = "twoColumn",
};

export default function BeerConfigPage() {
  const [beers, setBeers] = useState<any>([]);
  const [colors, setColors] = useState<any>(undefined);

  const saveBeers = async () => await postData("/api/beers", { beers });
  const savePreferences = async () => await postData("/api/preferences", { preferences });

  const [preferences, setPreferences] = useState<any>({
    beerMenuType: MenuType.FullWidth,
    beerRowBackgroundColor: colors?.rowBackgroundColor || "#000000",
    beerCellBackgroundColor: colors?.cellBackgroundColor || "#000000",
    beerHeaderTextColor: colors?.headerTextColor || "#000000",
    beerCellTextColor: colors?.cellTextColor || "#000000",
  });

  useEffect(() => {
    if (colors) {
      setPreferences({
        beerCellBackgroundColor: colors.cellBackgroundColor,
        beerCellTextColor: colors.cellTextColor,
        beerHeaderTextColor: colors.headerTextColor,
        beerMenuType: MenuType.FullWidth,
        beerRowBackgroundColor: colors.rowBackgroundColor,
      });
    }
  }, [colors]);

  const loadBeer = async () => {
    const data = await getData("/api/beers");
    setBeers(data.beers);
  };

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences);
      setColors({
        cellBackgroundColor: data.preferences.beerCellBackgroundColor || "#000000",
        cellTextColor: data.preferences.beerCellTextColor || "#000000",
        headerTextColor: data.preferences.beerHeaderTextColor || "#000000",
        rowBackgroundColor: data.preferences.beerRowBackgroundColor || "#000000",
      })
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = async () => {
    await saveBeers();
    await savePreferences();
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
    loadPreferences();
  }, []);

  const onChange = (e: any, beer: any, field: string) => {
    beer[field] = e.target.value;
  }

  const onSelectMenuType = (e: any) => {
    setPreferences({ menuType: e.target.value });
  };

  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {

    setPreferences({
      ...preferences,
      beerBackgroundImage: fileInput?.current?.files?.[0].name,
    });

    evt.preventDefault();

    const formData = new FormData();
    formData.append("file", fileInput?.current?.files?.[0]!);

    const response = await fetch("/api/preferences/background", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);
  }

  return (
    <main className={styles.main}>
      <ConfigurationHeader />
      <h1 className={styles.header}>Beers</h1>
      <div className={styles.beerContainer}>
        <div className={styles.selectContainer}>
          <form className="flex flex-col gap-4">
            <label>
              <span>Upload a file</span>
              <input type="file" name="file" ref={fileInput} />
            </label>
            <button type="submit" onClick={uploadFile}>
              Submit
            </button>
          </form>
          <div>Menu Type:</div>
          <select className={styles.selectContainer} onSelect={onSelectMenuType} >
            <option value={MenuType.FullWidth} >Full Width</option>
            <option value={MenuType.TwoColumn}>Two Column</option>
          </select>
        </div>
        {beers?.map((beer: any, index: number) => (
          <div className={styles.inputRow}>
            <input className={styles.input} defaultValue={beer?.name} onChange={(e) => onChange(e, beer, "name")} />
            <input className={styles.input} defaultValue={beer?.type} onChange={(e) => onChange(e, beer, "type")} />
            <input className={styles.input} defaultValue={beer?.brewery} onChange={(e) => onChange(e, beer, "brewery")} />
            <input className={styles.input} defaultValue={beer?.abv} onChange={(e) => onChange(e, beer, "abv")} />
            <input className={styles.input} defaultValue={beer?.quantity} onChange={(e) => onChange(e, beer, "quantity")} />
            <BsTrash3 className={styles.trash} onClick={() => onDeleteClick(index)} />
          </div>
        ))}
        {colors && <ColorPicker colors={colors} onChange={setColors} />}
        <div className={styles.inputRow}>
          <button className={styles.button} onClick={onSave}>Save</button>
          <button className={styles.button} onClick={onAddClick}>Add</button>
        </div>
      </div>
    </main>
  );
}
