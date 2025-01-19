import { useState } from "react";
import styles from "./Table.module.css";
import { BsTrash3, BsPencil } from "react-icons/bs";

type TableProps = {
  columns: string[];
  data: [
    string[],
  ];
  onDeleteClick?: (index: number) => void;
  onEditClick?: (index: number) => void;
  onSave?: (obj: any) => void;
  onDone?: () => void;
  addUrl?: string;
};

const Table = ({ columns, data, onDeleteClick, onEditClick, onSave, onDone, addUrl }: TableProps) => {
  const [addMode, setAddMode] = useState<boolean>(false);
  const [newRow, setNewRow] = useState<any>({});

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th key={index} className={styles.th}>{column}</th>
            ))}
            <th className={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={styles.tr}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={styles.td}>{cell}</td>
              ))}
              <td className={styles.td}>
                <BsTrash3 onClick={() => onDeleteClick && onDeleteClick(rowIndex)} />
                <BsPencil className={styles.editIcon} onClick={() => onEditClick && onEditClick(rowIndex)} />
              </td>
            </tr>
          ))}
          {addMode && (
            <tr className={styles.tr}>
              {columns.map((column, index) => (
                <td key={index} className={styles.td}>
                  <input className={styles.input}
                    onChange={() => {
                      // @ts-expect-error ts-migrate(7006) FIXME: Parameter 'event' implicitly has an 'any' type.
                      setNewRow({ ...newRow, [column.toLowerCase()]: event.target.value });
                    }} />
                </td>
              ))}
              <td className={styles.td}>
                <button className={styles.button} onClick={() => {
                  setAddMode(false);
                  onSave && onSave(newRow);
                }}>
                  Save
                </button>
                <button className={styles.button} onClick={() => setAddMode(false)}>Cancel</button>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {!addMode && (
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