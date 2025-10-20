import * as Haptics from 'expo-haptics';
import { ENV } from './env';

export async function strikeConfirmHaptic() {
  if (!ENV.hapticsEnabled) {
    return;
  }
  await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
}
