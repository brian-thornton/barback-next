import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import styles from "./ColorPicker.module.css";

export type ColorType = {
  rowBackgroundColor: string;
  cellBackgroundColor: string;
  headerTextColor: string;
  cellTextColor: string;
  titleColor?: string;
  titleFontSize?: string;
  titleFontFamily?: string;
}

type ColorPickerProps = {
  colors: ColorType;
  onChange: (colors: ColorType) => void;
}

export const ColorPicker = ({ colors, onChange }: ColorPickerProps) => {
  const [rowBackgroundColor, setRowBackgroundColor] = useState(colors.rowBackgroundColor);
  const [cellBackgroundColor, setCellBackgroundColor] = useState(colors.cellBackgroundColor);
  const [headerTextColor, setHeaderTextColor] = useState(colors.headerTextColor);
  const [cellTextColor, setCellTextColor] = useState(colors.cellTextColor);
  const [titleColor, setTitleColor] = useState(colors.titleColor || "#FFFFFF");
  const [titleFontSize, setTitleFontSize] = useState(colors.titleFontSize || "4rem");
  const [titleFontFamily, setTitleFontFamily] = useState(colors.titleFontFamily || "system-ui, -apple-system, sans-serif");

  useEffect(() => {
    onChange({
      rowBackgroundColor,
      cellBackgroundColor,
      headerTextColor,
      cellTextColor,
      titleColor,
      titleFontSize,
      titleFontFamily,
    });
  }, [rowBackgroundColor, cellBackgroundColor, headerTextColor, cellTextColor, titleColor, titleFontSize, titleFontFamily]);

  return (
    <div className={styles.colorPickerContainer}>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Row Background Color</label>
        <HexColorPicker color={rowBackgroundColor} onChange={setRowBackgroundColor} />
      </div>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Cell Background Color</label>
        <HexColorPicker color={cellBackgroundColor} onChange={setCellBackgroundColor} />
      </div>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Header Text Color</label>
        <HexColorPicker color={headerTextColor} onChange={setHeaderTextColor} />
      </div>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Cell Text Color</label>
        <HexColorPicker color={cellTextColor} onChange={setCellTextColor} />
      </div>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Screen Title Color</label>
        <HexColorPicker color={titleColor} onChange={setTitleColor} />
      </div>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Screen Title Font Size</label>
        <select 
          className={styles.fontSizeSelect}
          value={titleFontSize} 
          onChange={(e) => setTitleFontSize(e.target.value)}
        >
          <option value="2rem">Small (2rem)</option>
          <option value="3rem">Medium (3rem)</option>
          <option value="4rem">Large (4rem)</option>
          <option value="5rem">Extra Large (5rem)</option>
          <option value="6rem">Huge (6rem)</option>
        </select>
      </div>
      <div className={styles.colorPicker}>
        <label className={styles.colorLabel}>Screen Title Font Family</label>
        <select 
          className={styles.fontSizeSelect}
          value={titleFontFamily} 
          onChange={(e) => setTitleFontFamily(e.target.value)}
        >
          <option value="system-ui, -apple-system, sans-serif">System Default</option>
          <option value="Arial, sans-serif">Arial</option>
          <option value="'Times New Roman', serif">Times New Roman</option>
          <option value="Georgia, serif">Georgia</option>
          <option value="'Courier New', monospace">Courier New</option>
          <option value="Impact, fantasy">Impact</option>
          <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
          <option value="Verdana, sans-serif">Verdana</option>
          <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
          <option value="'Brush Script MT', cursive">Brush Script</option>
          <option value="'Lucida Console', monospace">Lucida Console</option>
        </select>
        <div 
          className={styles.fontPreview} 
          style={{ 
            fontSize: titleFontSize, 
            color: titleColor,
            fontFamily: titleFontFamily
          }}
        >
          Preview Text
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;