// To use this service, install the package: npm install react-ga4

// This is a mock implementation - you need to replace G-XXXXXXXXXX with your actual GA tracking ID
const GA_TRACKING_ID = 'G-XXXXXXXXXX';

/**
 * Initialize Google Analytics
 */
export const initGA = () => {
  if (typeof window !== 'undefined') {
    try {
      // Load GA script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);

      // Initialize GA
      window.dataLayer = window.dataLayer || [];
      function gtag(...args: any) {
        window.dataLayer.push(args);
      }
      gtag('js', new Date());
      gtag('config', GA_TRACKING_ID);

      console.log('Google Analytics initialized');
    } catch (error) {
      console.error('Error initializing Google Analytics:', error);
    }
  }
};

/**
 * Track a page view
 * @param path The page path to track
 */
export const trackPageView = (path: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
    });
    console.log('Page view tracked:', path);
  }
};

/**
 * Track an event
 * @param category Event category
 * @param action Event action
 * @param label Optional event label
 * @param value Optional event value
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
    console.log('Event tracked:', { category, action, label, value });
  }
};

/**
 * Track a conversion (completed booking)
 * @param activityId The ID of the booked activity
 * @param totalValue The total value of the booking
 */
export const trackBookingConversion = (activityId: number | string, totalValue: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: Date.now().toString(),
      value: totalValue,
      currency: 'USD',
      items: [
        {
          id: activityId,
          quantity: 1
        }
      ]
    });
    console.log('Booking conversion tracked:', { activityId, totalValue });
  }
};

// Extend the Window interface to include gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}