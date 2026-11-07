import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/Skeleton';
import styles from './PluginStatusBar.module.scss';

interface PluginStatusBarProps {
  pluginsEnabled: boolean;
  pluginsDir: string;
  stats: { label: string; value: ReactNode }[];
  /**
   * The plugin data is loading. The labels show, and each value is a skeleton with the
   * width of a typical value, so the bar keeps its size when the data arrives.
   */
  loading?: boolean;
}

export function PluginStatusBar({
  pluginsEnabled,
  pluginsDir,
  stats,
  loading = false,
}: PluginStatusBarProps) {
  const { t } = useTranslation();
  const dir = pluginsDir || 'plugins';
  const value = (content: ReactNode) =>
    loading ? (
      <Skeleton text>
        {typeof content === 'string' || typeof content === 'number' ? String(content) : '0'}
      </Skeleton>
    ) : (
      content
    );

  return (
    <div className={styles.statusBar}>
      <div className={styles.statusList}>
        <div className={styles.statusPill}>
          <span
            className={`${styles.statusDot} ${pluginsEnabled ? styles.statusDotOn : styles.statusDotOff}`}
          />
          <span className={styles.statusLabel}>{t('plugin_management.global_status')}</span>
          <span className={styles.statusValue}>
            {value(
              pluginsEnabled || loading
                ? t('plugin_management.global_enabled')
                : t('plugin_management.global_disabled')
            )}
          </span>
        </div>

        <div className={styles.statusPill}>
          <span className={styles.statusLabel}>{t('plugin_management.plugins_dir')}</span>
          <span className={`${styles.statusValue} ${styles.statusPathValue}`} title={dir}>
            {value(dir)}
          </span>
        </div>

        {stats.map(({ label, value: statValue }) => (
          <div key={label} className={styles.statusPill}>
            <span className={styles.statusLabel}>{label}</span>
            <span className={styles.statusValue}>{value(statValue)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
