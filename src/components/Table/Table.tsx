import { useState } from "react";
import styles from "./Table.module.css";
import { BsTrash3, BsPencil, BsCheck, BsX } from "react-icons/bs";

type TableProps = {
  columns: string[];
  data: string[][];
  onDeleteClick?: (index: number) => void;
  onEditClick?: (index: number) => void;
  onSave?: (obj: any) => void;
  onDone?: () => void;
  addUrl?: string;
  hideAddButton?: boolean;
};

const Table = ({ columns, data, onDeleteClick, onEditClick, onSave, onDone, addUrl, hideAddButton }: TableProps) => {
  const [addMode, setAddMode] = useState<boolean>(false);
  const [newRow, setNewRow] = useState<any>({});
  const [editingCell, setEditingCell] = useState<{ rowIndex: number; cellIndex: number } | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const handleCellEdit = (rowIndex: number, cellIndex: number, value: string) => {
    setEditingCell({ rowIndex, cellIndex });
    setEditValue(value);
  };

  const handleCellSave = () => {
    if (editingCell && onSave) {
      const updatedRow = [...data[editingCell.rowIndex]];
      updatedRow[editingCell.cellIndex] = editValue;
      onSave({ rowIndex: editingCell.rowIndex, updatedRow });
    }
    setEditingCell(null);
  };

  const handleCellCancel = () => {
    setEditingCell(null);
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={styles.th}>{column}</th>
            ))}
            {(onDeleteClick || onEditClick) && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tr}>
              {columns.map((_, cellIndex) => (
                <td key={cellIndex} className={styles.td}>
                  {editingCell?.rowIndex === rowIndex && editingCell?.cellIndex === cellIndex ? (
                    <div className={styles.editCell}>
                      <input
                        className={styles.input}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        autoFocus
                      />
                      <div className={styles.editActions}>
                        <BsCheck 
                          className={styles.actionIcon} 
                          onClick={handleCellSave}
                        />
                        <BsX 
                          className={styles.actionIcon} 
                          onClick={handleCellCancel}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className={styles.cellContent}>
                      <span>{row[cellIndex] || ''}</span>
                      <BsPencil 
                        className={styles.cellEditIcon} 
                        onClick={() => handleCellEdit(rowIndex, cellIndex, row[cellIndex] || '')}
                      />
                    </div>
                  )}
                </td>
              ))}
              {(onDeleteClick || onEditClick) && (
                <td className={styles.td}>
                  <div className={styles.actionIcons}>
                    {onDeleteClick && (
                      <BsTrash3 
                        className={styles.actionIcon} 
                        onClick={() => onDeleteClick(rowIndex)} 
                      />
                    )}
                    {onEditClick && (
                      <BsPencil 
                        className={styles.actionIcon} 
                        onClick={() => onEditClick(rowIndex)} 
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
          {addMode && (
            <tr className={styles.tr}>
              {columns.map((column, index) => (
                <td key={index} className={styles.td}>
                  <input 
                    className={styles.input}
                    onChange={(e) => {
                      setNewRow({ ...newRow, [column.toLowerCase()]: e.target.value });
                    }} 
                  />
                </td>
              ))}
              <td className={styles.td}>
                <div className={styles.actionIcons}>
                  <button className={styles.button} onClick={() => {
                    setAddMode(false);
                    onSave && onSave(newRow);
                  }}>
                    Save
                  </button>
                  <button className={styles.button} onClick={() => setAddMode(false)}>
                    Cancel
                  </button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!addMode && !hideAddButton && (
        <div className={styles.inputRow}>
          <button
            className={styles.button}
            onClick={() => {
              if (addUrl) {
                window.location.replace(addUrl);
              } else {
                setAddMode(true);
              }
            }}
          >
            Add
          </button>
          {onDone && <button className={styles.button} onClick={onDone}>Done</button>}
        </div>
      )}
    </div>
  );
};

export default Table;