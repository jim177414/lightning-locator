import { PropsWithChildren, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { interstitialController } from '../services/ads.service';

export function InterstitialManager({ children }: PropsWithChildren) {
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active') {
        // reset ad strike counter when returning if needed in future
      }
    });
    return () => subscription.remove();
  }, []);

  return children;
}

export function notifyStrikeRecorded() {
  interstitialController.recordStrikeAndMaybeShow().catch(error => {
    console.warn('Interstitial error', error);
  });
}
