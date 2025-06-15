"use client";
import styles from "./DisplayMenu.module.css";
import { ColorType } from "@/components/ColorPicker/ColorPicker";

type DisplayMenuProps = {
  headers: string[];
  rows: string[][];
  colors: ColorType;
};

export default function DisplayMenu({ headers, rows, colors }: DisplayMenuProps) {
  const { rowBackgroundColor, cellBackgroundColor, headerTextColor, cellTextColor } = colors || {};

  const cellStyles = {
    backgroundColor: cellBackgroundColor,
    color: cellTextColor,
  };

  return headers?.length ? (
    <>
      <div className={styles.container}>  
        <div className={styles.row} style={{ background: rowBackgroundColor }}>
          {headers.map((header: string, index) => (
            <div key={index} className={styles.header} style={cellStyles}>{header}</div>
          ))}
        </div>
        {rows.map((row: string[], rowIndex) => (
          <div key={rowIndex} className={styles.row} style={{ background: rowBackgroundColor }}>
            {headers.map((_, colIndex) => (
              <div key={colIndex} className={styles.text} style={cellStyles}>
                {row[colIndex] || ''}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  ) : (
    <div>No data configured</div>
  );
}
