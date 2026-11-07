import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/Skeleton';
import { IconModelCluster } from '@/components/ui/icons';
import styles from './AuthFileCard.module.scss';
import quotaStyles from './AuthFileQuota.module.scss';

export type AuthFileCardSkeletonProps = {
  compact: boolean;
  /** Show the quota block, as a card does when the quota view is on. */
  withQuota: boolean;
};

/**
 * A loading placeholder in the shape of AuthFileCard. It uses the card's own classes, so
 * each row has the height of the real row and the grid does not move when the data
 * arrives.
 */
export function AuthFileCardSkeleton({ compact, withQuota }: AuthFileCardSkeletonProps) {
  const { t } = useTranslation();

  return (
    <div className={`${styles.card} ${compact ? styles.cardCompact : ''}`} aria-hidden="true">
      <div className={styles.head}>
        <Skeleton className={styles.selection} width={22} height={22} rounded={6} />
        <div className={styles.identity}>
          <Skeleton width={64} height={24} rounded={12} />
          <span className={styles.account}>
            <Skeleton text width="70%" />
          </span>
        </div>
      </div>

      <div className={styles.fileName}>
        <Skeleton text width="80%" />
      </div>

      <div className={styles.health}>
        <div className={styles.healthHead}>
          <span className={styles.healthLabel}>
            <Skeleton text>{t('auth_files.card_requests')}</Skeleton>
          </span>
          <span className={styles.healthCounts}>
            <span>
              <Skeleton text width={120} />
            </span>
          </span>
        </div>
        <div className={styles.statusBar}>
          <Skeleton className={styles.statusBlocks} height={14} rounded={2} />
          <span className={styles.statusRate}>
            <Skeleton text width={32} />
          </span>
        </div>
      </div>

      <div className={styles.metaRow}>
        <span>
          <Skeleton text width={180} />
        </span>
      </div>

      {withQuota && !compact && (
        <div className={quotaStyles.quotaSection}>
          <span className={quotaStyles.quotaMessage}>
            <Skeleton text width="60%" />
          </span>
        </div>
      )}

      <div className={styles.actions}>
        <div className={styles.actionsMain}>
          {/* The label is invisible. It gives the bar the width of the real button. */}
          <Skeleton className={styles.buttonSkeleton}>
            <IconModelCluster size={14} />
            {t('auth_files.models_button')}
          </Skeleton>
          <div className={styles.utilityActions}>
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} width={30} height={30} />
            ))}
          </div>
        </div>
        <div className={styles.toggleWrap}>
          <span className={styles.toggleLabel}>
            <Skeleton text>{t('auth_files.status_toggle_label')}</Skeleton>
          </span>
          <Skeleton width={44} height={24} rounded={12} />
        </div>
      </div>
    </div>
  );
}
