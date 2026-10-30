/**
 * Helper to dynamically append Cloudinary or ImageKit transformation parameters
 * for responsive, high-performance web delivery without changing raw asset data.
 */
export function getOptimizedImageUrl(
  url: string | undefined,
  width = 800,
  quality = 'auto'
): string {
  if (!url) return '';
  
  // Do not transform video files
  if (url.includes('.mp4')) {
    return url;
  }

  // Cloudinary image URLs
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    // Avoid double transformation
    if (url.includes('/image/upload/w_') || url.includes('/image/upload/c_') || url.includes('/image/upload/f_auto')) {
      return url;
    }
    return url.replace('/image/upload/', `/image/upload/w_${width},c_limit,q_${quality},f_auto/`);
  }

  // ImageKit image URLs
  if (url.includes('ik.imagekit.io')) {
    // Avoid double transformation
    if (url.includes('tr=') || url.includes('/tr:')) {
      return url;
    }
    const qValue = quality === 'auto' ? '80' : quality;
    const transform = `tr=w-${width},q-${qValue},f-auto`;
    return url.includes('?') ? `${url}&${transform}` : `${url}?${transform}`;
  }

  return url;
}
