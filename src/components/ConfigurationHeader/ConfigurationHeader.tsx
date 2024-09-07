import styles from "./ConfigurationHeader.module.css";

const ConfigurationHeader = () => {
  const onButtonClick = (route: string) => {
    console.log(`${window.location.host}/${route}`)
    window.location.href = `http://${window.location.host}/${route}`;
  };

  return (
    <header className={styles.configHeader}>
      <button className={styles.headerButton} onClick={() => onButtonClick('config')}>Beer</button>
      <button className={styles.headerButton} onClick={() => onButtonClick('config/spirits')}>Spirits</button>
    </header>
  );
}

export default ConfigurationHeader;