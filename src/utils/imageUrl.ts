/**
 * Utility to process and optimize image URLs, including Google Drive preview links,
 * Unsplash, Imgur, direct image links, and local assets.
 */

export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();

  // If already a standard image or data URL or relative path
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) {
    return trimmed;
  }

  // Detect Google Drive links
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    // Match /file/d/FILE_ID or id=FILE_ID
    const match = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
                  trimmed.match(/id=([a-zA-Z0-9_-]+)/);

    if (match && match[1]) {
      const fileId = match[1];
      // Google's direct high-res image thumbnail endpoint which doesn't trigger auth redirects
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1200`;
    }
  }

  return trimmed;
}

/**
 * Validates if an image link looks valid
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.startsWith('/') || trimmed.startsWith('data:image/')) return true;
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return true;
  return false;
}
