import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from '../dashboard.module.scss';

const FLEET_ROW_COUNT = 3;

/**
 * Loading placeholders for the dashboard panels that wait for the credential list. They
 * use the classes of the real rows, so the sections below do not move when it arrives.
 */
export function FleetListSkeleton() {
  const { t } = useTranslation();

  return (
    <ul className={styles.fleetList} aria-busy="true">
      <li className="sr-only">{t('common.loading')}</li>
      {Array.from({ length: FLEET_ROW_COUNT }, (_, index) => (
        <li key={index} className={styles.fleetRow} aria-hidden="true">
          <span className={styles.fleetRank}>{String(index + 1).padStart(2, '0')}</span>
          <div className={styles.fleetIdentity}>
            <span className={styles.fleetName}>
              <Skeleton text width={96} />
            </span>
            <span className={styles.fleetMeta}>
              <Skeleton text width={72} />
            </span>
          </div>
          <Skeleton className={styles.fleetSpark} rounded={6} />
          <div className={styles.fleetNumbers}>
            <span className={styles.fleetTotal}>
              <Skeleton text width={40} />
            </span>
            <span className={styles.fleetTotalLabel}>{t('dashboard.fleet_requests')}</span>
          </div>
          <div className={styles.fleetRate}>
            <span className={styles.fleetRateValue}>
              <Skeleton text width={44} />
            </span>
            <Skeleton className={styles.fleetMeter} rounded={999} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function CredentialHealthSkeleton() {
  const { t } = useTranslation();

  return (
    <div className={styles.healthSkeleton} aria-busy="true">
      <span className="sr-only">{t('common.loading')}</span>
      <Skeleton className={styles.healthBar} rounded={3} aria-hidden="true" />
      <ul className={styles.healthLegend} aria-hidden="true">
        {(['health_active', 'health_unavailable', 'health_disabled'] as const).map((key) => (
          <li key={key}>
            <Skeleton className={styles.healthKey} rounded={2} />
            {t(`dashboard.${key}`)}
            <b>
              <Skeleton text width={16} />
            </b>
          </li>
        ))}
      </ul>
      <div className={styles.typeBreakdown} aria-hidden="true">
        <span className={styles.typeBreakdownLabel}>{t('dashboard.health_by_type')}</span>
        <ul className={styles.typeList}>
          {[64, 80, 56].map((width) => (
            <li key={width} className={styles.typeChip}>
              <Skeleton text width={width} />
            </li>
          ))}
        </ul>
      </div>
      <span className={styles.panelLink} aria-hidden="true">
        {t('dashboard.health_link')}{' '}
        <span className={styles.linkArrow}>→</span>
      </span>
    </div>
  );
}
