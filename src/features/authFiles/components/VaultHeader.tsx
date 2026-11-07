import { useTranslation } from 'react-i18next';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { PageHeader } from '@/components/ui/PageHeader';
import { IconRefreshCw, IconUpload } from '@/components/ui/icons';
import { useRevealGroup } from '@/hooks/motion';
import styles from './VaultHeader.module.scss';

export type VaultHeaderProps = {
  syncingModelCatalog?: boolean;
  onSyncModelCatalog?: () => void;
  modelCatalogSyncDisabled?: boolean;
  totalCount: number;
  activeCount: number;
  problemCount: number;
  loading: boolean;
  refreshing: boolean;
  uploading: boolean;
  disableControls: boolean;
  onUpload: () => void;
  onRefresh: () => void;
  refreshingCredentials?: boolean;
  credentialRefreshDisabled?: boolean;
  onRefreshCredentials?: () => void;
};

/**
 * Auth files header. The meta line also gives the text for VaultPulse, whose bar is
 * aria-hidden.
 */
export function VaultHeader(props: VaultHeaderProps) {
  const {
    syncingModelCatalog = false,
    onSyncModelCatalog,
    modelCatalogSyncDisabled = false,
    totalCount,
    activeCount,
    problemCount,
    loading,
    refreshing,
    uploading,
    disableControls,
    onUpload,
    onRefresh,
    refreshingCredentials = false,
    credentialRefreshDisabled = false,
    onRefreshCredentials,
  } = props;
  const { t } = useTranslation();
  const revealRef = useRevealGroup<HTMLElement>();

  return (
    <PageHeader
      ref={revealRef}
      title={t('auth_files.title')}
      meta={[
        <span>{t('auth_files.meta_total', { count: totalCount })}</span>,
        <span data-tone={activeCount > 0 ? 'success' : 'muted'}>
          {t('auth_files.meta_active', { count: activeCount })}
        </span>,
        problemCount > 0 && (
          <span data-tone="failure">{t('auth_files.meta_problem', { count: problemCount })}</span>
        ),
      ]}
      actions={
        <>
          {onSyncModelCatalog && (
            <button
              type="button"
              className={styles.quietAction}
              onClick={onSyncModelCatalog}
              disabled={modelCatalogSyncDisabled || syncingModelCatalog}
              aria-busy={syncingModelCatalog}
            >
              {syncingModelCatalog ? <LoadingSpinner size={14} /> : <IconRefreshCw size={14} />}
              {t('auth_files.sync_catalog_button')}
            </button>
          )}
          {onRefreshCredentials && (
            <button
              type="button"
              className={styles.quietAction}
              onClick={onRefreshCredentials}
              disabled={
                disableControls || loading || refreshingCredentials || credentialRefreshDisabled
              }
            >
              {refreshingCredentials ? <LoadingSpinner size={14} /> : <IconRefreshCw size={14} />}
              {t('auth_files.refresh_all_button')}
            </button>
          )}
          <button
            type="button"
            className={styles.quietAction}
            onClick={onRefresh}
            disabled={loading || refreshing}
          >
            <IconRefreshCw size={14} data-spinning={refreshing} />
            {t('common.refresh')}
          </button>
          <button
            type="button"
            className={styles.primaryAction}
            onClick={onUpload}
            disabled={disableControls || uploading}
          >
            {uploading ? <LoadingSpinner size={14} /> : <IconUpload size={15} />}
            {t('auth_files.upload_button')}
          </button>
        </>
      }
    />
  );
}
