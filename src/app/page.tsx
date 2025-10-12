"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./page.module.css";
import DisplayMenu from "@/components/DisplayMenu/DisplayMenu";

export default function Home() {
  const [preferences, setPreferences] = useState<any>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const [pageIndex, setPageIndex] = useState<number>(0);

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.log(err);
    }
  };

  const screens = preferences?.screens || [];
  const cycleIntervalSeconds = preferences?.cycleInterval || 10;
  const cycleInterval = cycleIntervalSeconds * 1000; // Convert seconds to milliseconds
  const rowsPerPage = preferences?.rowsPerPage || 10;

  // Get current screen data
  const currentScreen = screens[screenIndex];
  const allRows = currentScreen?.rows || [];
  
  // Calculate pagination
  const totalPages = Math.ceil(allRows.length / rowsPerPage);
  const startIndex = pageIndex * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const paginatedRows = allRows.slice(startIndex, endIndex);

  const changeToNextPageOrScreen = useCallback(() => {
    // If there are more pages in the current screen, go to next page
    if (pageIndex < totalPages - 1) {
      setPageIndex((prev) => prev + 1);
    } else {
      // Otherwise, go to next screen and reset page index
      setPageIndex(0);
      if (screens.length > 1) {
        setScreenIndex((prevIndex) => 
          prevIndex === screens.length - 1 ? 0 : prevIndex + 1
        );
      }
    }
  }, [pageIndex, totalPages, screens.length]);

  useEffect(() => {
    loadPreferences();
  }, []);

  useEffect(() => {
    if (preferences?.screens.length > 0) {
      setHeaders(preferences.screens[screenIndex].headers);
      setRows(paginatedRows);
    }
  }, [preferences, screenIndex, pageIndex, rowsPerPage]);

  useEffect(() => {
    if (screens.length > 0) {
      const timer = setTimeout(() => changeToNextPageOrScreen(), cycleInterval);
      return () => clearTimeout(timer);
    }
  }, [screenIndex, pageIndex, screens.length, cycleInterval, changeToNextPageOrScreen]);

  return (
    <main className={styles.main} style={{ backgroundImage: `url(./${preferences?.screens[screenIndex]?.name}_background.jpg)` }}>
      {preferences?.screens.length > 0 && (
        <>
          <DisplayMenu
            headers={headers}
            rows={rows || [[]]}
            colors={preferences.screens[screenIndex].colors}
            title={preferences.screens[screenIndex].title}
          />
          {totalPages > 1 && (
            <div className={styles.pageIndicator}>
              Page {pageIndex + 1} of {totalPages}
            </div>
          )}
        </>
      )}
      {preferences?.screens.length === 0 && (
        <div>
          <h1>No screens found</h1>
          <p>Please add a screen in the <a className={styles.link} href="/config/screens">configuration</a></p>
        </div>
      )}
    </main>
  );
};
