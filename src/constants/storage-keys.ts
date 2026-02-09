export const STORAGE_KEY_PREFIX = 'magnet_v3_';

export const STORAGE_KEYS = {
  USER: `${STORAGE_KEY_PREFIX}user`,
  TASKS: `${STORAGE_KEY_PREFIX}tasks`,
  REWARDS: `${STORAGE_KEY_PREFIX}rewards`,
  LOGS: `${STORAGE_KEY_PREFIX}logs`,
  SETTINGS: `${STORAGE_KEY_PREFIX}settings`
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];
