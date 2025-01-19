"use client";
import { useRef } from "react";
import styles from "./FileUpload.module.css";

type FileUploadProps = {
  onFileUpload: (formData: FormData) => void;
};

export const FileUpload = ({onFileUpload}: FileUploadProps) => {
  const fileInput = useRef<HTMLInputElement>(null);

  async function uploadFile(
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    const formData = new FormData();
    formData.append("file", fileInput?.current?.files?.[0]!);
    onFileUpload(formData);
  };

  return (
    <div className={styles.container}>
      <label>
        <span>Upload a file</span>
        <input type="file" name="file" ref={fileInput} />
      </label>
      <button type="submit" onClick={uploadFile} className={styles.backgroundButton}>
        Upload Background Image
      </button>
    </div>
  )
}

export default FileUpload;
