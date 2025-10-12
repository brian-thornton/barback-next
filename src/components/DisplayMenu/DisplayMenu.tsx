"use client";
import styles from "./DisplayMenu.module.css";
import { ColorType } from "@/components/ColorPicker/ColorPicker";

type DisplayMenuProps = {
  headers: string[];
  rows: string[][];
  colors: ColorType;
  title?: string;
};

function getResponsiveFontSize(text: string, isHeader: boolean = false): string {
  const length = text?.length || 0;
  
  if (isHeader) {
    if (length <= 10) return 'clamp(1.75rem, 2.5vw, 2.5rem)';
    if (length <= 15) return 'clamp(1.5rem, 2.25vw, 2.25rem)';
    if (length <= 20) return 'clamp(1.25rem, 2vw, 2rem)';
    if (length <= 30) return 'clamp(1rem, 1.75vw, 1.75rem)';
    if (length <= 40) return 'clamp(0.9rem, 1.5vw, 1.5rem)';
    return 'clamp(0.8rem, 1.25vw, 1.25rem)';
  }
  
  // For cell text
  if (length <= 10) return 'clamp(1.5rem, 2vw, 2rem)';
  if (length <= 15) return 'clamp(1.25rem, 1.75vw, 1.75rem)';
  if (length <= 20) return 'clamp(1.1rem, 1.5vw, 1.5rem)';
  if (length <= 30) return 'clamp(0.95rem, 1.35vw, 1.35rem)';
  if (length <= 40) return 'clamp(0.85rem, 1.2vw, 1.2rem)';
  if (length <= 50) return 'clamp(0.75rem, 1.1vw, 1.1rem)';
  return 'clamp(0.65rem, 1vw, 1rem)';
}

export default function DisplayMenu({ headers, rows, colors, title }: DisplayMenuProps) {
  const { rowBackgroundColor, cellBackgroundColor, headerTextColor, cellTextColor } = colors || {};

  const cellStyles = {
    backgroundColor: cellBackgroundColor,
    color: cellTextColor,
  };

  return headers?.length ? (
    <>
      {title && (
        <div className={styles.titleContainer}>
          <h1 
            className={styles.screenTitle} 
            style={{ 
              color: colors.titleColor || '#ffffff',
              fontSize: colors.titleFontSize || 'clamp(2.5rem, 4vw, 4rem)',
              fontFamily: colors.titleFontFamily || 'system-ui, -apple-system, sans-serif'
            }}
          >
            {title}
          </h1>
        </div>
      )}
      <div className={styles.container}>  
        <div className={styles.row} style={{ background: rowBackgroundColor }}>
          {headers.map((header: string, index) => (
            <div 
              key={index} 
              className={styles.header} 
              style={{
                ...cellStyles,
                fontSize: getResponsiveFontSize(header, true)
              }}
            >
              {header}
            </div>
          ))}
        </div>
        {rows.map((row: string[], rowIndex) => (
          <div key={rowIndex} className={styles.row} style={{ background: rowBackgroundColor }}>
            {headers.map((_, colIndex) => (
              <div 
                key={colIndex} 
                className={styles.text} 
                style={{
                  ...cellStyles,
                  fontSize: getResponsiveFontSize(row[colIndex] || '')
                }}
              >
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
