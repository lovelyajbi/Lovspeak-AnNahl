import type { User } from 'firebase/auth';

export const ACCESS_FULL_MESSAGE = 'Akses LovSpeak saat ini sedang penuh. Silakan hubungi admin untuk informasi lebih lanjut.';
export const ACCESS_UNAVAILABLE_MESSAGE = 'Akses LovSpeak belum dapat diverifikasi. Silakan coba lagi beberapa saat kemudian.';

export type AccessGateResult = {
  allowed: boolean;
  reason?: 'capacity_full' | 'service_unavailable';
  message?: string;
};

export const verifyAccountAccess = async (user: User): Promise<AccessGateResult> => {
  const token = await user.getIdToken();
  const response = await fetch('/api/access-gate', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  });
  const result = await response.json().catch(() => ({})) as Partial<AccessGateResult> & { error?: string };
  if (!response.ok || result.allowed !== true) {
    return {
      allowed: false,
      reason: result.reason === 'capacity_full' ? 'capacity_full' : 'service_unavailable',
      message: result.message || result.error || (result.reason === 'capacity_full' ? ACCESS_FULL_MESSAGE : ACCESS_UNAVAILABLE_MESSAGE),
    };
  }
  return { allowed: true };
};
