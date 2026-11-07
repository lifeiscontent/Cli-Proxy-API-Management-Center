import { Skeleton } from '@/components/ui/Skeleton';
import listStyles from '../PluginsPage.module.scss';
import storeStyles from '../PluginStorePage.module.scss';

/**
 * Loading placeholders for the plugin pages. They use the classes of the real rows and
 * cards, so the list keeps its geometry when the plugin data arrives.
 */
export function PluginRowSkeleton() {
  return (
    <div className={listStyles.pluginRow} aria-hidden="true">
      <div className={listStyles.logoBox}>
        <Skeleton width="100%" height="100%" rounded={0} />
      </div>
      <div className={listStyles.pluginInfo}>
        <div className={listStyles.pluginName}>
          <h2>
            <Skeleton text width={120} />
          </h2>
          <div className={listStyles.badgeRow}>
            <Skeleton width={72} height={22} rounded={999} />
            <Skeleton width={72} height={22} rounded={999} />
            <Skeleton width={72} height={22} rounded={999} />
          </div>
        </div>
        <span className={listStyles.pluginId}>
          <Skeleton text width={96} />
        </span>
        <div className={listStyles.pluginMeta}>
          <span className={listStyles.metaItem}>
            <span>
              <Skeleton text width={180} />
            </span>
          </span>
        </div>
      </div>
      <div className={listStyles.rowActions}>
        <Skeleton width={44} height={24} rounded={12} />
        <Skeleton width={114} height="var(--control-height)" />
        <Skeleton width={30} height={30} />
      </div>
    </div>
  );
}

export function PluginStoreCardSkeleton() {
  return (
    <div className={storeStyles.card} aria-hidden="true">
      <div className={storeStyles.cardHeader}>
        <div className={storeStyles.logoBox}>
          <Skeleton width="100%" height="100%" rounded={0} />
        </div>
        <div className={storeStyles.cardTitleBlock}>
          <span className={storeStyles.cardTitle}>
            <Skeleton text width={140} />
          </span>
          <span className={storeStyles.cardId}>
            <Skeleton text width={80} />
          </span>
        </div>
        <div className={storeStyles.cardBadges}>
          <Skeleton width={96} height={22} rounded={999} />
        </div>
      </div>
      <div className={storeStyles.cardDescBlock}>
        <span className={storeStyles.cardDesc}>
          <Skeleton text width="90%" />
        </span>
      </div>
      <div className={storeStyles.cardMeta}>
        <span className={storeStyles.metaItem}>
          <Skeleton text width={220} />
        </span>
      </div>
      <div className={storeStyles.cardFooter}>
        <div className={storeStyles.cardActions}>
          <Skeleton width={83} height="var(--control-height)" />
        </div>
      </div>
    </div>
  );
}
