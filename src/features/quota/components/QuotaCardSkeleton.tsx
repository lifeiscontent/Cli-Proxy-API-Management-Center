import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './QuotaCard.module.scss';

/**
 * A loading placeholder in the shape of a QuotaCard before its quota loads. It uses the
 * card's own classes, so the grid does not move when the credentials arrive.
 */
export function QuotaCardSkeleton() {
  const { t } = useTranslation();

  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.head}>
        <Skeleton width={26} height={26} rounded={8} />
        <span className={styles.titles}>
          <span className={styles.account}>
            <Skeleton text width={160} />
          </span>
          <span className={styles.fileName}>
            <Skeleton text width={200} />
          </span>
        </span>
      </div>
      <div className={styles.body}>
        {/* The label is invisible. It gives the bar the width of the real refresh pill. */}
        <span className={`${styles.actionPill} ${styles.idleAction}`}>
          <Skeleton width={13} height={13} rounded={4} />
          <span>
            <Skeleton text>{t('codex_quota.idle')}</Skeleton>
          </span>
        </span>
      </div>
    </div>
  );
}
