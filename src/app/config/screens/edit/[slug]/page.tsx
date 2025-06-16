"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Table from "@/components/Table/Table";
import { savePreferences } from "@/lib/preferences-helper";
import { ColorPicker, ColorType } from "@/components/ColorPicker/ColorPicker";
import { BsArrowLeft, BsSave, BsPlus, BsX, BsGripVertical } from "react-icons/bs";
import FileUpload from "@/components/FileUpload/FileUpload";

// Simple Modal Component
const Modal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.modalClose} onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
};

const EditScreen = () => {
  const [preferences, setPreferences] = useState<any>();
  const [colors, setColors] = useState<ColorType>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRow, setNewRow] = useState<any>({});
  const [addError, setAddError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<number | null>(null);
  const [newHeader, setNewHeader] = useState<string>("");
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [draggedColumn, setDraggedColumn] = useState<number | null>(null);
  const lastPart = window.location.href.split("/").pop();
  const screen = preferences?.screens?.find((screen: any) => screen.name === lastPart);
  const headers = screen?.headers || [];
  const rows = screen?.rows || [];

  const loadPreferences = async () => {
    try {
      const res = await fetch(`/api/preferences`);
      const data = await res.json();
      setPreferences(data.preferences);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const defaultColors = {
      cellBackgroundColor: "#FFFFFF",
      cellTextColor: "#000000",
      headerTextColor: "#000000",
      rowBackgroundColor: "#003366",
    }

    if (preferences) {
      const currentScreen = preferences?.screens?.find((screen: any) => screen.name === lastPart);
      setColors(currentScreen?.colors ?? defaultColors);
    }
  }, [preferences])

  useEffect(() => {
    loadPreferences();
  }, []);

  const onSaveColors = async () => {
    try {
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === lastPart);

      screens[index] = {
        ...screens[index],
        name: screens[index].name,
        headers: screens[index].headers,
        rows: screens[index].rows,
        colors: colors,
      };

      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
      
      // Navigate back to screens list after saving
      window.location.replace('/config');
    } catch (err) {
      console.log(err);
    }
  };

  const onSave = async (data: any) => {
    const newRowData = Object.keys(data).map((key) => data[key]);

    try {
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === lastPart);
      const updatedRows = screens[index].rows || [];
      updatedRows.push(newRowData);

      screens[index] = {
        name: lastPart,
        headers,
        rows: updatedRows,
        colors: colors,
      };

      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
    } catch (err) {
      console.log(err);
    }
  };

  // Add Row Modal logic
  const handleAddRow = () => {
    setNewRow({});
    setAddError(null);
    setShowAddModal(true);
  };

  const handleAddRowChange = (header: string, value: string) => {
    setNewRow((prev: any) => ({ ...prev, [header]: value }));
  };

  const handleAddRowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate all fields
    for (const header of headers) {
      if (!newRow[header] || newRow[header].trim() === "") {
        setAddError(`Please fill in the '${header}' field.`);
        return;
      }
    }
    setAddError(null);
    await onSave(newRow);
    setShowAddModal(false);
  };

  const onDone = () => {
    window.location.replace('/config');
  };

  const onColorsUpdated = (updatedColors: ColorType) => {
    setColors(updatedColors);
  };

  const onDeleteClick = (index: number) => {
    setRowToDelete(index);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (rowToDelete === null) return;
    const screens = preferences.screens || [];
    const screenIndex = screens.findIndex((screen: any) => screen.name === lastPart);
    const updatedRows = screens[screenIndex].rows || [];
    updatedRows.splice(rowToDelete, 1);

    screens[screenIndex] = {
      name: lastPart,
      headers,
      rows: updatedRows,
    };

    setPreferences({ ...preferences, screens });
    await savePreferences({ ...preferences, screens });
    setShowDeleteModal(false);
    setRowToDelete(null);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setRowToDelete(null);
  };

  const handleBackgroundUpload = async (formData: FormData) => {
    try {
      const response = await fetch(`/api/preferences/background?name=${lastPart}_background`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      // Update preferences with new background image
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === lastPart);
      
      screens[index] = {
        ...screens[index],
        backgroundImage: `/${lastPart}_background.jpg`,
      };
      
      setPreferences({ ...preferences, screens });
      await savePreferences({ ...preferences, screens });
    } catch (err) {
      console.error('Error uploading background:', err);
    }
  };

  const addColumn = () => {
    if (!newHeader.trim()) {
      alert("Please enter a column name");
      return;
    }
    if (headers.includes(newHeader)) {
      alert("Column name already exists");
      return;
    }

    try {
      const screens = preferences.screens || [];
      const index = screens.findIndex((screen: any) => screen.name === lastPart);
      const updatedHeaders = [...headers, newHeader];
      
      screens[index] = {
        ...screens[index],
        headers: updatedHeaders,
      };

      setPreferences({ ...preferences, screens });
      savePreferences({ ...preferences, screens });
      setNewHeader("");
      setShowAddColumnModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const removeColumn = (index: number) => {
    try {
      const screens = preferences.screens || [];
      const screenIndex = screens.findIndex((screen: any) => screen.name === lastPart);
      const updatedHeaders = headers.filter((_: string, i: number) => i !== index);
      
      screens[screenIndex] = {
        ...screens[screenIndex],
        headers: updatedHeaders,
      };

      setPreferences({ ...preferences, screens });
      savePreferences({ ...preferences, screens });
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedColumn(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedColumn === null) return;

    const newHeaders = [...headers];
    const draggedItem = newHeaders[draggedColumn];
    newHeaders.splice(draggedColumn, 1);
    newHeaders.splice(index, 0, draggedItem);

    try {
      const screens = preferences.screens || [];
      const screenIndex = screens.findIndex((screen: any) => screen.name === lastPart);
      
      screens[screenIndex] = {
        ...screens[screenIndex],
        headers: newHeaders,
      };

      setPreferences({ ...preferences, screens });
      savePreferences({ ...preferences, screens });
      setDraggedColumn(index);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDragEnd = () => {
    setDraggedColumn(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.screenName}>{screen?.name}</h1>
          <button className={styles.cancelButton} onClick={onDone}>
            <BsArrowLeft />
            Back to Screens
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Columns</h2>
          <div className={styles.tableSection}>
            <div className={styles.inputRow}>
              <input 
                className={styles.input} 
                placeholder="Enter column name" 
                value={newHeader}
                onChange={(e) => setNewHeader(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addColumn()}
              />
              <button className={styles.saveButton} onClick={addColumn}>
                <BsPlus /> Add Column
              </button>
            </div>
            
            {headers.length > 0 && (
              <div className={styles.columnList}>
                {headers.map((header: string, index: number) => (
                  <div 
                    key={index} 
                    className={styles.columnTag}
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    <BsGripVertical className={styles.dragHandle} />
                    {header}
                    <BsX 
                      className={styles.removeColumn} 
                      onClick={() => removeColumn(index)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Menu Items</h2>
          <div className={styles.tableSection}>
            <Table columns={headers} data={rows} onSave={onSave} onDeleteClick={onDeleteClick} hideAddButton={true}/> 
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-start' }}>
              <button className={styles.saveButton} onClick={handleAddRow}>
                <BsPlus /> Add Row
              </button>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Colors</h2>
          <div className={styles.colorSection}>
            {colors && <ColorPicker onChange={onColorsUpdated} colors={colors} />}
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Background Image</h2>
          <div className={styles.fileUploadSection}>
            <FileUpload onFileUpload={handleBackgroundUpload} />
          </div>
        </div>

        <div className={styles.buttonRow}>
          <button className={styles.saveButton} onClick={onSaveColors}>
            <BsSave />
            Save Changes
          </button>
        </div>
      </div>

      {/* Add Row Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Add New Row</h2>
        </div>
        <form onSubmit={handleAddRowSubmit} className={styles.modalForm}>
          {headers.map((header: string) => (
            <div key={header} className={styles.formGroup}>
              <label className={styles.formLabel}>{header}</label>
              <input
                type="text"
                className={styles.formInput}
                value={newRow[header] || ''}
                onChange={e => handleAddRowChange(header, e.target.value)}
                placeholder={`Enter ${header}`}
                autoFocus={header === headers[0]}
              />
            </div>
          ))}
          {addError && <div className={styles.errorMessage}>{addError}</div>}
          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={() => setShowAddModal(false)}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              <BsPlus /> Add Row
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal open={showDeleteModal} onClose={handleCancelDelete}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Delete Row</h2>
        </div>
        <p className={styles.modalText}>
          Are you sure you want to delete this row? This action cannot be undone.
        </p>
        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={handleCancelDelete}>
            Cancel
          </button>
          <button className={styles.saveButton} onClick={handleConfirmDelete}>
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default EditScreen;