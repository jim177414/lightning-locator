import { useRef } from 'react';
import { Button, Share } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import { palette } from '../constants/theme';

type ShareSnapshotProps = {
  targetRef: React.RefObject<any>;
  filename?: string;
};

export function ShareSnapshot({ targetRef, filename = 'lightning-strike' }: ShareSnapshotProps) {
  const isSharing = useRef(false);

  const handleShare = async () => {
    if (!targetRef.current || isSharing.current) {
      return;
    }
    try {
      isSharing.current = true;
      const uri = await captureRef(targetRef, {
        format: 'png',
        fileName: filename,
        quality: 0.9,
        result: 'tmpfile'
      });
      await Share.share({ url: uri, message: 'Check out where lightning struck!' });
    } catch (error) {
      console.warn('Failed to share snapshot', error);
    } finally {
      isSharing.current = false;
    }
  };

  return <Button title="Share snapshot" onPress={handleShare} color={palette.accent} />;
}
