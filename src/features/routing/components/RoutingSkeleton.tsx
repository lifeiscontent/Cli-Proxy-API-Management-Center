import type { CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/Skeleton';
import { PolicyPanelSkeleton } from './PolicyPanel';
import styles from '../RoutingPage.module.scss';

// A typical member card is about this wide. The count is a guess: the data is not here yet.
const MEMBER_WIDTHS = [240, 280, 220, 260];

/**
 * The first load of the routing page: the tier ladder and the policy panel, with the
 * classes of the real layout, so the columns stay in place when the board arrives.
 */
export function RoutingSkeleton() {
  const { t } = useTranslation();

  return (
    <div className={styles.layout} aria-busy="true">
      <span className="sr-only">{t('routing.loading')}</span>
      <section className={styles.board} aria-hidden="true">
        <ol className={styles.ladder}>
          <li className={styles.entry}>
            <span className={styles.entryDot} />
            <span className={styles.entryLabel}>{t('routing.entry')}</span>
            <div className={styles.entryControl}>
              <div className={styles.modelPicker}>
                <Skeleton height="var(--control-height)" />
              </div>
            </div>
          </li>
          <li className={styles.gap}>
            <span className={styles.rail} />
          </li>
          <li className={styles.tier}>
            <div className={styles.tierHead}>
              <span className={styles.tierIndex}>1</span>
              <span className={styles.tierName}>{t('routing.tier_primary')}</span>
              <span className={styles.tierPriority}>
                <Skeleton text>{t('routing.tier_priority', { priority: 0 })}</Skeleton>
              </span>
              <span className={styles.tierState}>
                <Skeleton text>{t('routing.tier_state_active')}</Skeleton>
              </span>
            </div>
            <div className={styles.tierMembers}>
              {MEMBER_WIDTHS.map((width, index) => (
                <Skeleton
                  key={index}
                  className={styles.memberSkeleton}
                  style={{ '--member-width': `${width}px` } as CSSProperties}
                  height={48}
                  rounded={10}
                />
              ))}
            </div>
          </li>
          <li className={styles.gap}>
            <span className={styles.rail} />
          </li>
          <li className={styles.exhausted}>
            <span className={styles.exhaustedDot} />
            <span className={styles.entryLabel}>{t('routing.exhausted')}</span>
            <span className={styles.exhaustedText}>
              <Skeleton text>{t('routing.exhausted_no_retry')}</Skeleton>
            </span>
          </li>
        </ol>
        <p className={styles.footnote}>{t('routing.footnote')}</p>
      </section>
      <PolicyPanelSkeleton />
    </div>
  );
}
