import { logger } from '../logging';

export interface Notification {
  userId: string;
  title: string;
  body: string;
  data?: Record<string, string>;
}

export async function sendPushNotification(notification: Notification): Promise<void> {
  // Stub: In production, integrate with FCM/APNs
  logger.info(`[Notifications] Push to ${notification.userId}: ${notification.title}`);
}

export async function notifyMilestoneUnlocked(
  userId: string,
  milestoneName: string
): Promise<void> {
  await sendPushNotification({
    userId,
    title: 'Milestone Unlocked! 🎉',
    body: `You've reached: ${milestoneName}`,
  });
}

export async function notifyNewMessage(
  userId: string,
  senderName: string,
  channelName: string
): Promise<void> {
  await sendPushNotification({
    userId,
    title: `New message from ${senderName}`,
    body: `In channel: ${channelName}`,
  });
}
