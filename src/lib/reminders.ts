/**
 * Daily reminder scheduling, built on expo-notifications local notifications.
 *
 * Everything here is a no-op on web (Platform.OS === 'web') — the browser has
 * no equivalent to a scheduled OS-level local notification, and the web build
 * is the only one we can verify in CI, so we must never let these calls throw
 * there. On native we lazily import expo-notifications so the module is only
 * pulled in when it's actually usable.
 */
import { Platform } from 'react-native';
import { getItem, setItem } from './storage';

export type ReminderPrefs = {
  enabled: boolean;
  hour: number; // 0-23
  minute: number; // 0-59
};

export const REMINDER_KEY = 'servant.reminder.prefs';
export const DEFAULT_PREFS: ReminderPrefs = { enabled: false, hour: 7, minute: 0 };

const CHANNEL_ID = 'daily-devotional';

// A small rotation of gentle nudges so the notification doesn't read the same
// way every single morning.
const PROMPTS: { title: string; body: string }[] = [
  { title: 'A few quiet minutes', body: 'Today’s devotional is ready when you are.' },
  { title: 'Begin the day well', body: 'Five minutes before the noise starts.' },
  { title: 'Today’s reading', body: 'A short devotional for the work ahead.' },
  { title: 'Steady your heart', body: 'A quiet moment before the day’s demands.' },
];

export async function loadReminderPrefs(): Promise<ReminderPrefs> {
  return getItem<ReminderPrefs>(REMINDER_KEY, DEFAULT_PREFS);
}

async function persistPrefs(prefs: ReminderPrefs): Promise<void> {
  await setItem(REMINDER_KEY, prefs);
}

/**
 * Ask the OS for notification permission. Returns true if granted.
 * Always false on web.
 */
export async function ensurePermission(): Promise<boolean> {
  if (Platform.OS === 'web') return false;
  try {
    const Notifications = await import('expo-notifications');
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    if (!current.canAskAgain) return false;
    const req = await Notifications.requestPermissionsAsync();
    return req.granted;
  } catch {
    return false;
  }
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
      name: 'Daily devotional',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  } catch {
    // ignore — channel is an Android nicety
  }
}

/**
 * Cancel any previously scheduled daily reminders so we never stack duplicates.
 */
export async function cancelDailyReminder(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const Notifications = await import('expo-notifications');
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch {
    // ignore
  }
}

/**
 * Schedule (or reschedule) the daily reminder for the given time and persist
 * the preference. Returns the prefs actually in effect — if permission was
 * denied, `enabled` comes back false.
 */
export async function scheduleDailyReminder(
  hour: number,
  minute: number,
): Promise<ReminderPrefs> {
  const desired: ReminderPrefs = { enabled: true, hour, minute };

  if (Platform.OS === 'web') {
    await persistPrefs({ ...desired, enabled: false });
    return { ...desired, enabled: false };
  }

  const ok = await ensurePermission();
  if (!ok) {
    const denied = { ...desired, enabled: false };
    await persistPrefs(denied);
    return denied;
  }

  try {
    const Notifications = await import('expo-notifications');
    await ensureAndroidChannel();
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Vary the copy by day-of-month so it isn't identical every morning.
    const prompt = PROMPTS[new Date().getDate() % PROMPTS.length];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: prompt.title,
        body: prompt.body,
        ...(Platform.OS === 'android' ? { channelId: CHANNEL_ID } : null),
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      },
    });

    await persistPrefs(desired);
    return desired;
  } catch {
    const failed = { ...desired, enabled: false };
    await persistPrefs(failed);
    return failed;
  }
}

/**
 * Turn the reminder off, cancelling the schedule and persisting the choice
 * (time is retained so re-enabling restores the last picked time).
 */
export async function disableDailyReminder(prev: ReminderPrefs): Promise<ReminderPrefs> {
  await cancelDailyReminder();
  const next = { ...prev, enabled: false };
  await persistPrefs(next);
  return next;
}

export function formatTime(hour: number, minute: number): string {
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour < 12 ? 'AM' : 'PM';
  return `${h12}:${String(minute).padStart(2, '0')} ${ampm}`;
}
