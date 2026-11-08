import styles from '../LogsPage.module.scss';

/** A log timestamp with its date part marked, so narrow panels can show only the time. */
export function LogTimestamp({ value }: { value: string }) {
  const space = value.indexOf(' ');
  if (space < 0) return <>{value}</>;
  return (
    <>
      <span className={styles.date}>{value.slice(0, space + 1)}</span>
      {value.slice(space + 1)}
    </>
  );
}
