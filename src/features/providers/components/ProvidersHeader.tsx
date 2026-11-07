import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { IconPlus, IconRefreshCw } from '@/components/ui/icons';
import styles from './ProvidersHeader.module.scss';

interface ProvidersHeaderProps {
  totalActive: number;
  totalResources: number;
  providerFamilies: number;
  updatedAtLabel: string;
  isFetching?: boolean;
  isNewDisabled?: boolean;
  newLabel?: string;
  onRefresh: () => void;
  onNew: () => void;
}

export function ProvidersHeader({
  totalActive,
  totalResources,
  providerFamilies,
  updatedAtLabel,
  isFetching = false,
  isNewDisabled = false,
  newLabel,
  onRefresh,
  onNew,
}: ProvidersHeaderProps) {
  const { t } = useTranslation();
  const refreshLabel = isFetching
    ? t('providersPage.actions.syncing')
    : t('providersPage.actions.refresh');

  return (
    <PageHeader
      title={t('providersPage.header.title')}
      meta={[
        <span data-tone={totalActive > 0 ? 'success' : 'muted'}>
          {t('providersPage.header.activeResources', {
            active: totalActive,
            total: totalResources,
          })}
        </span>,
        <span>{t('providersPage.header.providerFamilies', { count: providerFamilies })}</span>,
        <span>{t('providersPage.header.updatedAt', { time: updatedAtLabel })}</span>,
      ]}
      actions={
        <>
          <button
            type="button"
            className={styles.refreshAction}
            onClick={onRefresh}
            disabled={isFetching}
            aria-label={refreshLabel}
          >
            <IconRefreshCw size={14} data-spinning={isFetching} />
            {refreshLabel}
          </button>
          <button
            type="button"
            className={styles.newAction}
            onClick={onNew}
            disabled={isNewDisabled}
          >
            <IconPlus size={15} />
            {newLabel ?? t('providersPage.actions.new')}
          </button>
        </>
      }
    />
  );
}
