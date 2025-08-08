interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

class Analytics {
  private isProduction = process.env.NODE_ENV === 'production'
  private events: AnalyticsEvent[] = []

  track(event: string, properties?: Record<string, any>) {
    const eventData: AnalyticsEvent = {
      event,
      properties,
      timestamp: Date.now()
    }

    this.events.push(eventData)

    // In production, send to analytics service
    if (this.isProduction) {
      this.sendToAnalytics(eventData)
    } else {
      console.log('Analytics Event:', eventData)
    }
  }

  private sendToAnalytics(_eventData: AnalyticsEvent) {
    // Example: Send to your analytics service
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(eventData)
    // })
  }

  trackPageView(page: string) {
    this.track('page_view', { page })
  }

  trackIntentCreated(type: string, amount: string, chains: string[]) {
    this.track('intent_created', { type, amount, chains })
  }

  trackWalletConnected(address: string) {
    this.track('wallet_connected', { address: address.slice(0, 6) + '...' })
  }

  trackIntentProcessed(type: string, success: boolean, txHash?: string) {
    this.track('intent_processed', { type, success, txHash })
  }

  trackError(error: string, context?: string) {
    this.track('error', { error, context })
  }

  getEvents() {
    return this.events
  }

  clearEvents() {
    this.events = []
  }
}

export const analytics = new Analytics() 