type EventPayload = Record<string, unknown>;

class AnalyticsService {
  track(event: string, payload: EventPayload = {}) {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[analytics] ${event}`, payload);
    }
    // Hook up Segment/Amplitude here when keys are provided.
  }
}

export const analytics = new AnalyticsService();
