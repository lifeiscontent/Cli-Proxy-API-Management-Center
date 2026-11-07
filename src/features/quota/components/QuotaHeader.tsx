import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { IconRefreshCw } from '@/components/ui/icons';
import { useCountUp } from '@/hooks/motion';
import styles from './QuotaHeader.module.scss';

export type QuotaHeaderProps = {
  totalCount: number;
  loadedCount: number;
  attentionCount: number;
  refreshing: boolean;
  disableControls: boolean;
  onRefreshAll: () => void;
};

/** Quota header. The page's useRevealGroup animates it in before the tabs. */
export function QuotaHeader(props: QuotaHeaderProps) {
  const { totalCount, loadedCount, attentionCount, refreshing, disableControls, onRefreshAll } =
    props;
  const { t } = useTranslation();
  // The loaded count is the only number that counts up while batch results arrive.
  const displayLoadedCount = useCountUp(loadedCount);

  return (
    <PageHeader
      title={t('quota_management.title')}
      meta={[
        <span>{t('quota_management.meta_credentials', { count: totalCount })}</span>,
        <span data-tone={loadedCount > 0 ? 'success' : 'muted'}>
          {t('quota_management.meta_loaded', { count: displayLoadedCount })}
        </span>,
        attentionCount > 0 && (
          <span data-tone="failure">
            {t('quota_management.meta_attention', { count: attentionCount })}
          </span>
        ),
      ]}
      actions={
        <button
          type="button"
          className={styles.refreshAction}
          onClick={onRefreshAll}
          disabled={disableControls || refreshing}
        >
          <IconRefreshCw size={14} data-spinning={refreshing} />
          {t('quota_management.refresh_all_credentials')}
        </button>
      }
    />
  );
}
