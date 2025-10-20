import { Circle, Marker } from 'react-native-maps';
import { palette } from '../constants/theme';
import { Strike } from '../types/strike';

type StrikeMarkerProps = {
  strike: Strike;
};

export function StrikeMarker({ strike }: StrikeMarkerProps) {
  return (
    <>
      <Marker
        coordinate={{ latitude: strike.targetLat, longitude: strike.targetLon }}
        title={`Strike ${strike.distanceMi.toFixed(1)} mi`}
        description={`Bearing ${strike.bearingDeg.toFixed(0)}°`}
        pinColor={palette.accent}
      />
      <Circle
        center={{ latitude: strike.targetLat, longitude: strike.targetLon }}
        radius={strike.radiusKm * 1000}
        strokeColor="rgba(240,165,0,0.6)"
        fillColor="rgba(240,165,0,0.2)"
      />
    </>
  );
}
