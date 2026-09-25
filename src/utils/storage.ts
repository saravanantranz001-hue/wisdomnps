export function readStored<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;

    return JSON.parse(saved) as T;
  } catch (error) {
    console.error(`Unable to read saved data for "${key}". Using defaults.`, error);
    return fallback;
  }
}

export function writeStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Unable to save data for "${key}".`, error);
  }
}

export const SCHOOL_STORAGE_KEYS = [
  'wisdom_students',
  'wisdom_teachers',
  'wisdom_staff',
  'wisdom_payments',
  'wisdom_notices',
  'wisdom_van_routes',
  'wisdom_activities',
  'wisdom_classes_sections',
  'wisdom_exam_marks',
  'wisdom_finances',
  'wisdom_homework',
  'wisdom_library',
  'wisdom_subjects',
  'wisdom_timetable_schedules',
  'wisdom_general_settings',
  'wisdom_gpay_accounts',
  'wisdom_contact_numbers',
  'wisdom_school_logo',
] as const;

export function createStorageBackup(): Record<string, unknown> {
  return SCHOOL_STORAGE_KEYS.reduce<Record<string, unknown>>((backup, key) => {
    const value = readStored<unknown>(key, null);
    if (value !== null) backup[key] = value;
    return backup;
  }, {});
}

export function restoreStorageBackup(backup: unknown): number {
  if (!backup || typeof backup !== 'object' || Array.isArray(backup)) {
    throw new Error('Backup must be a JSON object.');
  }

  let restored = 0;
  for (const key of SCHOOL_STORAGE_KEYS) {
    if (Object.prototype.hasOwnProperty.call(backup, key)) {
      writeStored(key, (backup as Record<string, unknown>)[key]);
      restored += 1;
    }
  }
  return restored;
}
