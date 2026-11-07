import { useTranslation } from 'react-i18next';
import { PageHeader } from '@/components/ui/PageHeader';
import { IconRefreshCw } from '@/components/ui/icons';
import type { HeaderMetaSegment } from '../uiState';
import styles from './ConfigHeader.module.scss';

export type ConfigHeaderProps = {
  /** Meta line segments, from uiState.buildHeaderMeta. */
  meta: HeaderMetaSegment[];
  reloadDisabled: boolean;
  reloading: boolean;
  onReload: () => void;
};

const SEGMENT_TONE: Record<HeaderMetaSegment['tone'], string | undefined> = {
  muted: undefined,
  warning: 'warning',
  error: 'failure',
  ok: 'success',
};

/** Config header. Save is not here: FloatingSaveBar shows it when there are changes. */
export function ConfigHeader({ meta, reloadDisabled, reloading, onReload }: ConfigHeaderProps) {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('config_management.title')}
      meta={meta.map((segment) => (
        <span key={segment.key} data-tone={SEGMENT_TONE[segment.tone]}>
          {segment.count !== undefined
            ? t(segment.labelKey, { count: segment.count })
            : t(segment.labelKey)}
        </span>
      ))}
      actions={
        <button
          type="button"
          className={styles.reloadAction}
          onClick={onReload}
          disabled={reloadDisabled}
        >
          <IconRefreshCw size={14} data-spinning={reloading} />
          {t('config_management.reload')}
        </button>
      }
    />
  );
}
