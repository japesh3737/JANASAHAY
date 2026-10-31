import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

// Same-origin requests use the existing Vite plugin proxy during local development.
export const base44 = createClient({
  appId: appParams.appId,
  token: appParams.token,
  functionsVersion: appParams.functionsVersion,
  serverUrl: '',
  requiresAuth: false,
});

export const db = base44;
export default base44;
