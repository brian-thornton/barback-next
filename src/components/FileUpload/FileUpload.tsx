"use client";
import { useState, useCallback } from "react";
import { FiUpload, FiX, FiFile } from "react-icons/fi";
import styles from "./FileUpload.module.css";

interface FileUploadProps {
  onFileUpload: (formData: FormData) => Promise<void>;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File) => {
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, or GIF)");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return false;
    }

    return true;
  };

  const handleFile = async (file: File) => {
    setError(null);
    
    if (!validateFile(file)) {
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Automatically upload the file
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      await onFileUpload(formData);
    } catch (err) {
      setError("Failed to upload file. Please try again.");
      console.error("Upload error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={styles.container}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.active : ""} ${error ? styles.error : ""}`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input
          id="fileInput"
          type="file"
          className={styles.fileInput}
          accept="image/jpeg,image/png,image/gif"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <FiUpload className={styles.uploadIcon} />
        <p className={styles.dropzoneText}>
          {isDragging
            ? "Drop the file here"
            : "Drag and drop a file here, or click to select"}
        </p>
        <p className={styles.supportedFormats}>
          Supported formats: JPEG, PNG, GIF (max 5MB)
        </p>
      </div>

      {error && <p className={styles.errorMessage}>{error}</p>}

      {selectedFile && (
        <div className={styles.fileInfo}>
          <div className={styles.filePreview}>
            {previewUrl ? (
              <></>
            ) : (
              <FiFile className={styles.fileIcon} />
            )}
          </div>
          <div className={styles.fileDetails}>
            <p className={styles.fileName}>{selectedFile.name}</p>
            <p className={styles.fileSize}>{formatFileSize(selectedFile.size)}</p>
          </div>
          <button
            onClick={removeFile}
            className={styles.removeButton}
            disabled={isUploading}
          >
            <FiX />
          </button>
        </div>
      )}

      {isUploading && (
        <div className={styles.uploadingOverlay}>
          <div className={styles.uploadingSpinner}></div>
          <p>Uploading...</p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
