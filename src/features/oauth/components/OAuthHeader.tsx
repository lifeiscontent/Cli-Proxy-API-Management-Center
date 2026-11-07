import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import styles from './OAuthHeader.module.scss';

export interface OAuthHeaderProps {
  providerCount: number;
  waitingCount: number;
  addedCount: number;
}

/**
 * OAuth header, with no actions. A waiting flow shows in ink with a pulse; a credential
 * added in this session shows in green.
 */
export function OAuthHeader({ providerCount, waitingCount, addedCount }: OAuthHeaderProps) {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('nav.oauth', { defaultValue: 'OAuth' })}
      meta={[
        <span>{t('auth_login.meta_providers', { count: providerCount })}</span>,
        waitingCount > 0 && (
          <span className={styles.metaWaiting}>
            <span className={styles.pulse} aria-hidden="true" />
            {t('auth_login.meta_waiting', { count: waitingCount })}
          </span>
        ),
        addedCount > 0 && (
          <span data-tone="success">{t('auth_login.meta_added', { count: addedCount })}</span>
        ),
      ]}
    />
  );
}
