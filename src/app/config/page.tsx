"use client";
import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import ConfigurationHeader from "../../components/ConfigurationHeader/ConfigurationHeader";
import Table from "@/components/Table/Table";
import FileUpload from "@/components/FileUpload/FileUpload";

import { getData, postData } from "../../lib/service-client";
import ColorPicker from "@/components/ColorPicker/ColorPicker";

enum MenuType {
  FullWidth = "fullWidth",
  TwoColumn = "twoColumn",
};

export default function BeerConfigPage() {
  const [beers, setBeers] = useState<any>([]);
  const [colors, setColors] = useState<any>(undefined);
  const columnHeaders = ["Name", "Type", "Brewery", "ABV"];
  const tableData = beers.map((beer: any) => [beer.name, beer.type, beer.brewery, beer.abv]);
  const saveBeers = async () => await postData("/api/beers", { beers });
  const savePreferences = async () => await postData("/api/preferences", { preferences });
  const [colorsOpen, setColorsOpen] = useState<boolean>(false);

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
      setPreferences(data.preferences || {});
      console.log(data);
      setColors({
        cellBackgroundColor: data?.preferences?.beerCellBackgroundColor || "#000000",
        cellTextColor: data?.preferences?.beerCellTextColor || "#000000",
        headerTextColor: data?.preferences?.beerHeaderTextColor || "#000000",
        rowBackgroundColor: data?.preferences?.beerRowBackgroundColor || "#000000",
      })
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (preferences.beerRowBackgroundColor !== "#000000") {
      savePreferences();
    }
  }, [preferences]);

  const onSave = async () => {
    await saveBeers();
    await savePreferences();
  };

  const onDeleteClick = (index: number) => {
    const newBeers = beers.filter((beer: any, i: number) => i !== index);
    setBeers(newBeers);
  };

  useEffect(() => {
    loadBeer();
    loadPreferences();
  }, []);

  const onSelectMenuType = (e: any) => {
    setPreferences({ menuType: e.target.value });
  };

  useEffect(() => {
    if (beers && beers.length) {
      saveBeers();
    }
  }, [beers]);

  const fileInput = useRef<HTMLInputElement>(null);

  const uploadFile = async (formData: FormData) => {
    const response = await fetch("/api/preferences/background?name=beer_background", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <main className={styles.main}>
      <ConfigurationHeader />
      <h1 className={styles.header}>Beers</h1>
      <div className={styles.beerContainer}>
        <div className={styles.selectContainer}>
          <FileUpload onFileUpload={uploadFile} />
          <div>Menu Type:</div>
          <select className={styles.selectContainer} onSelect={onSelectMenuType} >
            <option value={MenuType.FullWidth} >Full Width</option>
            <option value={MenuType.TwoColumn}>Two Column</option>
          </select>
          <button onClick={() => setColorsOpen(!colorsOpen)}>Colors</button>
        </div>
        {colors && colorsOpen && <ColorPicker colors={colors} onChange={setColors} />}
      </div>
      <Table
        columns={columnHeaders}
        data={tableData}
        onDeleteClick={onDeleteClick}
        onSave={(obj: any) => {
          setBeers([...beers, obj]);
        }}
      />
    </main>
  );
}
