
export const trackPerformance = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        const perf = performance.getEntriesByType('navigation')[0];
        console.log('Performance Metrics:', {
          'DOM Load': perf.domContentLoadedEventEnd - perf.domContentLoadedEventStart,
          'Page Load': perf.loadEventEnd - perf.loadEventStart,
          'TTFB': perf.responseStart - perf.requestStart,
        });
      }, 0);
    });
  }
};

export const measureComponentRender = (componentName) => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    performance.mark(`${componentName}-start`);
    return () => {
      performance.mark(`${componentName}-end`);
      performance.measure(`${componentName}`, `${componentName}-start`, `${componentName}-end`);
    };
  }
  return () => {};
};
