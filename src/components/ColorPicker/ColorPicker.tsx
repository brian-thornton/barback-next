import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import styles from "./ColorPicker.module.css";

type ColorType = {
  rowBackgroundColor: string;
  cellBackgroundColor: string;
  headerTextColor: string;
  cellTextColor: string;
}

type ColorPickerProps = {
  colors: ColorType;
  onChange: (colors: ColorType) => void;
}

const ColorPicker = ({ colors, onChange }: ColorPickerProps) => {
  const [rowBackgroundColor, setRowBackgroundColor] = useState(colors.rowBackgroundColor);
  const [cellBackgroundColor, setCellBackgroundColor] = useState(colors.cellBackgroundColor);
  const [headerTextColor, setHeaderTextColor] = useState(colors.headerTextColor);
  const [cellTextColor, setCellTextColor] = useState(colors.cellTextColor);

  useEffect(() => {
    onChange({
      rowBackgroundColor,
      cellBackgroundColor,
      headerTextColor,
      cellTextColor,
    });
  }, [rowBackgroundColor, cellBackgroundColor, headerTextColor, cellTextColor]);

  return (
    <div className={styles.colorPickerContainer}>
      <div className={styles.colorPicker}>
        Row Background Color
        <HexColorPicker color={rowBackgroundColor} onChange={setRowBackgroundColor} />
      </div>
      <div className={styles.colorPicker}>
        Cell Background Color
        <HexColorPicker color={cellBackgroundColor} onChange={setCellBackgroundColor} />
      </div>
      <div className={styles.colorPicker}>
        Header Text Color
        <HexColorPicker color={headerTextColor} onChange={setHeaderTextColor} />
      </div>
      <div className={styles.colorPicker}>
        Cell Text Color
        <HexColorPicker color={cellTextColor} onChange={setCellTextColor} />
      </div>
    </div>
  );
};

export default ColorPicker;