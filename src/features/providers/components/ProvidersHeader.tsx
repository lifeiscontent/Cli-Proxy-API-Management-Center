import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { IconPlus, IconRefreshCw } from '@/components/ui/icons';
import { useRevealGroup } from '@/hooks/motion';
import styles from './ProvidersHeader.module.scss';

export interface ProvidersHeaderSummary {
  totalActive: number;
  totalResources: number;
  providerFamilies: number;
  updatedAtLabel: string;
}

interface ProvidersHeaderProps {
  title: string;
  /** Omitted on the quick-start route, which manages a single bundle. */
  summary?: ProvidersHeaderSummary;
  isFetching: boolean;
  onRefresh: () => void;
  /** Label of the primary action; the action is hidden when omitted. */
  newLabel?: string;
  newDisabled?: boolean;
  onNew?: () => void;
}

/** The providers page header, built on the shared PageHeader. */
export function ProvidersHeader({
  title,
  summary,
  isFetching,
  onRefresh,
  newLabel,
  newDisabled = false,
  onNew,
}: ProvidersHeaderProps) {
  const { t } = useTranslation();
  const revealRef = useRevealGroup<HTMLElement>();
  const refreshLabel = isFetching
    ? t('providersPage.actions.syncing')
    : t('providersPage.actions.refresh');

  return (
    <PageHeader
      ref={revealRef}
      title={title}
      meta={
        summary
          ? [
              <span data-tone={summary.totalActive > 0 ? 'success' : 'muted'}>
                {t('providersPage.header.activeResources', {
                  active: summary.totalActive,
                  total: summary.totalResources,
                })}
              </span>,
              <span>
                {t('providersPage.header.providerFamilies', { count: summary.providerFamilies })}
              </span>,
              <span data-tone="muted">
                {t('providersPage.header.updatedAt', { time: summary.updatedAtLabel })}
              </span>,
            ]
          : undefined
      }
      actions={
        <>
          <button
            type="button"
            className={styles.refreshAction}
            onClick={onRefresh}
            disabled={isFetching}
            aria-busy={isFetching || undefined}
          >
            <IconRefreshCw size={14} data-spinning={isFetching} />
            {refreshLabel}
          </button>
          {newLabel && onNew ? (
            <button
              type="button"
              className={styles.newAction}
              onClick={onNew}
              disabled={newDisabled}
            >
              <IconPlus size={15} />
              {newLabel}
            </button>
          ) : null}
        </>
      }
    />
  );
}
