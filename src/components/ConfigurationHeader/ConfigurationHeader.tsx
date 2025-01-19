import styles from "./ConfigurationHeader.module.css";

const ConfigurationHeader = () => {
  const onScreensClick = (route: string) => {
    window.location.href = `http://${window.location.host}/config/screens`;
  };

  return (
    <header className={styles.configHeader}>
      <button className={styles.headerButton} onClick={() => onScreensClick('config')}>Screens</button>
    </header>
  );
}

export default ConfigurationHeader;