export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID || '1044554088609124';

/**
 * Trigger Meta Pixel PageView event
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Trigger Meta Pixel Standard or Custom event
 * @param {string} name - Event name (e.g., 'ViewContent', 'AddToCart', 'InitiateCheckout', 'Purchase')
 * @param {object} options - Event parameters (value, currency, content_name, etc.)
 */
export const trackEvent = (name, options = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};
