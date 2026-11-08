import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/Skeleton';
import { LogTimestamp } from './LogTimestamp';
import styles from '../LogsPage.module.scss';

const LOG_ROW_COUNT = 24;
const ERROR_ROW_COUNT = 3;
// Different message widths, so the rows read as log lines and not as a table.
const MESSAGE_WIDTHS = [420, 340, 520, 380, 460, 360];

/**
 * The first load of the log viewer: log rows in the panel that will hold the lines.
 * `wrapped` is the wrap setting of the real panel, so the rows have the same layout.
 */
export function LogPanelSkeleton({ wrapped }: { wrapped: boolean }) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.logPanel} ${wrapped ? styles.wrapped : ''}`} aria-busy="true">
      <span className="sr-only">{t('logs.loading')}</span>
      <div className={styles.logList} aria-hidden="true">
        {Array.from({ length: LOG_ROW_COUNT }, (_, index) => (
          <div key={index} className={styles.logRow}>
            <div className={styles.timestamp}>
              <Skeleton text>
                <LogTimestamp value="2026-01-01 00:00:00" />
              </Skeleton>
            </div>
            <div className={`${styles.rowMain} ${styles.rowMainSkeleton}`}>
              <span className={styles.badge}>
                <span>
                  <Skeleton text>INFO</Skeleton>
                </span>
              </span>
              <span className={styles.message}>
                <Skeleton text width={MESSAGE_WIDTHS[index % MESSAGE_WIDTHS.length]} />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** The loading state of the error log list, in the shape of its rows. */
export function ErrorLogListSkeleton() {
  const { t } = useTranslation();

  return (
    <div className="item-list" aria-busy="true">
      <span className="sr-only">{t('common.loading')}</span>
      {Array.from({ length: ERROR_ROW_COUNT }, (_, index) => (
        <div key={index} className="item-row" aria-hidden="true">
          <div className="item-meta">
            <div className="item-title">
              <Skeleton text width={220} />
            </div>
            <div className="item-subtitle">
              <Skeleton text width={160} />
            </div>
          </div>
          <div className="item-actions">
            <Skeleton width={84} height="var(--control-height)" />
            <Skeleton width={96} height="var(--control-height)" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** The loading state of the error log viewer: a box with the size of a long log. */
export function ErrorLogContentSkeleton() {
  const { t } = useTranslation();

  return (
    <div aria-busy="true">
      <span className="sr-only">{t('common.loading')}</span>
      <Skeleton className={styles.errorLogSkeleton} rounded={8} />
    </div>
  );
}
