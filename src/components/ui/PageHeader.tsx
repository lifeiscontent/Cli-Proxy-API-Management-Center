import type { ReactNode, Ref } from 'react';
import styles from './PageHeader.module.scss';

export type PageHeaderProps = {
  title: ReactNode;
  /**
   * Telemetry segments, shown in one mono line and joined with a dot. Empty segments are
   * skipped. Set `data-tone` on a segment to color it: success, failure, warning, or muted.
   */
  meta?: ReactNode[];
  /** A prose line under the title. Use it when the page has no telemetry. */
  description?: ReactNode;
  /**
   * Page actions. They align right on desktop and wrap under the title on phones. An icon
   * with `data-spinning={true}` turns while its action runs.
   */
  actions?: ReactNode;
  /** A full-width row under the title, for example view tabs. */
  children?: ReactNode;
  ref?: Ref<HTMLElement>;
};

/**
 * The header of every page. Its parts have `data-reveal`, so a `useRevealGroup` container
 * animates them in.
 */
export function PageHeader({ title, meta, description, actions, children, ref }: PageHeaderProps) {
  const segments = meta?.filter(
    (segment) => segment !== null && segment !== undefined && segment !== false
  );

  return (
    <header className={styles.header} ref={ref}>
      <div className={styles.copy}>
        <h1 className={styles.title} data-reveal>
          {title}
        </h1>
        {segments?.length ? (
          <p className={styles.meta} data-reveal>
            <span className={styles.metaList}>
              {segments.map((segment, index) => (
                <span key={index} className={styles.metaSegment}>
                  {segment}
                </span>
              ))}
            </span>
          </p>
        ) : null}
        {description ? (
          <p className={styles.description} data-reveal>
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className={styles.actions} data-reveal>
          {actions}
        </div>
      ) : null}
      {children ? (
        <div className={styles.row} data-reveal>
          {children}
        </div>
      ) : null}
    </header>
  );
}
