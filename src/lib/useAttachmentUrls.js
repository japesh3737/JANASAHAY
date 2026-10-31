import { db } from '@/api/base44Client';

import { useEffect, useState } from 'react';

export function useAttachmentUrls(uris = []) {
  const [urls, setUrls] = useState([]);
  const key = uris.join('|');

  useEffect(() => {
    let active = true;
    if (!uris.length) {
      setUrls([]);
      return undefined;
    }

    (async () => {
      const resolved = await Promise.all(
        uris.map(async (uri) => {
          try {
            const result = await db.integrations.Core.CreateFileSignedUrl({
              file_uri: uri,
              expires_in: 3600,
            });
            return result?.signed_url || null;
          } catch {
            return null;
          }
        })
      );
      if (active) setUrls(resolved.filter(Boolean));
    })();

    return () => {
      active = false;
    };
  }, [key]);

  return urls;
}