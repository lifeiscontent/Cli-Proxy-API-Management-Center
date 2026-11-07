import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** A number keeps the width in a flex row, as the control that it stands in for does. */
  width?: number | string;
  height?: number | string;
  rounded?: number | string;
  /**
   * Stand in for one line of text. The bar sits inline, so the parent's font size and
   * line height set the line box. Put it inside the element that holds the real text,
   * and the skeleton line is as tall as the text line. It renders a `span`, so it can go
   * inside phrasing content.
   */
  text?: boolean;
}

/**
 * A loading placeholder. Give it the size of the content that replaces it, so nothing
 * moves when the content arrives. Children are invisible: put the real element (for
 * example a textarea) inside it, and the skeleton takes the size of that element.
 */
export function Skeleton({
  width,
  height,
  rounded,
  text = false,
  className,
  style,
  ...rest
}: SkeletonProps) {
  const merged: CSSProperties = {
    // A fixed-width block stands in for a control, and controls do not shrink in a row.
    flexShrink: !text && typeof width === 'number' ? 0 : undefined,
    ...style,
    width: width ?? style?.width,
    height: height ?? style?.height,
    borderRadius: rounded ?? style?.borderRadius,
  };
  const cls = [styles.skeleton, text ? styles.text : '', className].filter(Boolean).join(' ');
  const Tag = text ? 'span' : 'div';
  return <Tag className={cls} style={merged} aria-hidden="true" {...rest} />;
}
