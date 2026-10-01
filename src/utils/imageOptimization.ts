/**
 * Helper to dynamically append Cloudinary transformation parameters
 * for responsive, high-performance web delivery without changing raw asset data.
 */
export function getOptimizedImageUrl(
  url: string | undefined,
  width = 800,
  quality = 'auto'
): string {
  if (!url) return '';
  
  // Only transform Cloudinary image URLs
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    // Avoid double transformation
    if (url.includes('/image/upload/w_') || url.includes('/image/upload/c_') || url.includes('/image/upload/f_auto')) {
      return url;
    }
    return url.replace('/image/upload/', `/image/upload/w_${width},c_limit,q_${quality},f_auto/`);
  }

  return url;
}
