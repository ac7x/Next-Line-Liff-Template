/**
 * Retrieves LIFF configuration from environment variables.
 * Ensures that necessary configurations are available.
 */
export function getLiffConfig(): { liffId: string | undefined } {
    const liffId = process.env.NEXT_PUBLIC_LIFF_ID;
  
    // You could add more checks here if needed
    if (!liffId) {
      console.warn(
        'NEXT_PUBLIC_LIFF_ID environment variable is not set. LIFF features may not work correctly.'
      );
    }
  
    return {
      liffId: liffId,
    };
  }