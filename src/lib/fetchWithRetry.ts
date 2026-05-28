const MAX_RETRIES = 3;
const BASE_DELAY_MS = 200; // Exponential backoff base

export async function fetchWithRetry(url: RequestInfo | URL, options?: RequestInit): Promise<Response> {
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      // For the first attempt, use default options (keepalive enabled).
      // For retries, force keepalive: false to bypass potentially dead sockets in the pool.
      const currentOptions = attempt === 0 
        ? options 
        : { ...options, keepalive: false };
        
      return await fetch(url, currentOptions);
    } catch (error: any) {
      attempt++;
      
      const isEconnreset = error?.code === 'ECONNRESET' || error?.cause?.code === 'ECONNRESET';
      const isTimeout = error?.name === 'TimeoutError' || error?.message?.includes('timeout');
      
      if (!isEconnreset && !isTimeout) {
        // If it's not a connection reset or timeout, throw immediately
        throw error;
      }

      if (attempt >= MAX_RETRIES) {
        if (process.env.NODE_ENV === 'development') {
          console.error(`[Fetch Failure] Final attempt failed for ${url} after ${attempt} retries:`, error);
        }
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn(`[Fetch Retry] Network failure (${error?.cause?.code || error?.code || error?.message}) for ${url}. Retrying attempt ${attempt}/${MAX_RETRIES}...`);
      }

      // Exponential backoff: 200ms, 400ms, etc.
      const delay = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  // Fallback (should not be reached due to throw inside loop)
  throw new Error("fetchWithRetry exceeded max retries");
}
