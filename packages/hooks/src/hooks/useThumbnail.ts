import { useState, useEffect } from 'react';
import type { ImageFile } from '@imageforge/types';
import { useEngineContainer } from '../context/EngineProvider';

// Module-level cache to share thumbnails across hook instances
const thumbnailCache = new Map<string, string>();

export function useThumbnail(image: ImageFile | null): {
  thumbnailUrl: string | null;
  isGenerating: boolean;
  error: Error | null;
} {
  const container = useEngineContainer();
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!image) {
      setThumbnailUrl(null);
      return;
    }

    const cacheKey = `${image.id}-thumb`;
    if (thumbnailCache.has(cacheKey)) {
      setThumbnailUrl(thumbnailCache.get(cacheKey) ?? null);
      return;
    }

    let isMounted = true;
    setIsGenerating(true);
    setError(null);

    container.thumbnails.generate(image)
      .then((url) => {
        if (isMounted) {
          thumbnailCache.set(cacheKey, url);
          setThumbnailUrl(url);
          setIsGenerating(false);
        }
      })
      .catch((e: unknown) => {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setIsGenerating(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [container, image]);

  return {
    thumbnailUrl,
    isGenerating,
    error,
  };
}
