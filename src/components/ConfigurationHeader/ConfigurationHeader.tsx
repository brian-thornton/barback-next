import styles from "./ConfigurationHeader.module.css";
import { BsDisplay } from "react-icons/bs";

const ConfigurationHeader = () => {
  const onScreensClick = (route: string) => {
    window.location.href = `http://${window.location.host}/config`;
  };

  const onLaunchMenu = () => {
    window.location.href = `http://${window.location.host}`;
  };

  return (
    <header className={styles.configHeader}>
      <button className={styles.headerButton} onClick={() => onScreensClick('config')}>Screens</button>
      <button className={styles.headerButton} onClick={onLaunchMenu}>
        <BsDisplay /> Launch Menu
      </button>
    </header>
  );
}

export default ConfigurationHeader;