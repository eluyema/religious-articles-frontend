'use client';

import { useEffect, useRef } from 'react';
import styles from './AdSenseAd.module.scss';

const AD_CLIENT = 'ca-pub-7752563209985738';

type AdSenseAdProps = {
  adSlot: string;
  adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
  className?: string;
};

export default function AdSenseAd({ adSlot, adFormat = 'auto', className }: AdSenseAdProps) {
  const ref = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !ref.current) return;
    try {
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // ignore
    }
  }, [adSlot]);

  return (
    <div className={`${styles.wrapper} ${className ?? ''}`.trim()}>
      <ins
        ref={ref}
        className="adsbygoogle"
        data-ad-client={AD_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={adFormat === 'auto' ? 'true' : undefined}
        style={{ display: 'block' }}
      />
    </div>
  );
}
