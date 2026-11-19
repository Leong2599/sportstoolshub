import {type ReactNode} from 'react';
import {FEATURED_BADGES} from '../../data/chrome';
import styles from './FeaturedBadges.module.css';

function BadgeGroup({isDuplicate}: {isDuplicate: boolean}): ReactNode {
  return (
    <div className={styles.group} aria-hidden={isDuplicate || undefined}>
      {FEATURED_BADGES.map((badge) => (
        <a
          className={styles.badge}
          href={badge.href}
          key={badge.href}
          rel="noopener noreferrer"
          tabIndex={isDuplicate ? -1 : undefined}
          target="_blank"
        >
          {badge.image ? (
            <img
              alt={badge.label}
              height={badge.image.height}
              loading="lazy"
              src={badge.image.src}
              width={badge.image.width}
            />
          ) : (
            <span className={styles.text}>{badge.label}</span>
          )}
        </a>
      ))}
    </div>
  );
}

export function FeaturedBadges(): ReactNode {
  return (
    <section className={styles.container} aria-label="Featured on">
      <div className={styles.viewport}>
        <div className={styles.track}>
          <BadgeGroup isDuplicate={false} />
          <BadgeGroup isDuplicate />
        </div>
      </div>
    </section>
  );
}
