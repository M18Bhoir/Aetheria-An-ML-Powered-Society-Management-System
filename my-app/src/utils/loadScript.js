export const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve(true);
      return;
    }
    
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      reject(new Error('Failed to load Razorpay script.'));
    };
    document.body.appendChild(script);
  });
};