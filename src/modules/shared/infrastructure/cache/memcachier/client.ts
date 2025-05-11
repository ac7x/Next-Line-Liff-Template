import Memcached from 'memcached';

class MemcachierClient {
  private static instance: Memcached;

  private constructor() {}

  public static getInstance(): Memcached {
    if (!MemcachierClient.instance) {
      const servers = process.env.MEMCACHIER_SERVERS;

      if (!servers) {
        throw new Error(
          'Memcachier configuration is missing. Please set MEMCACHIER_SERVERS in your environment variables.'
        );
      }

      MemcachierClient.instance = new Memcached(servers, {
        timeout: 5000, // 5 seconds timeout
        retries: 10, // Retry up to 10 times
        retry: 1000, // Retry every 1 second
      });

      MemcachierClient.instance.on('failure', (details) => {
        console.error('Memcachier connection failure:', details);
      });

      MemcachierClient.instance.on('reconnecting', (details) => {
        console.log('Reconnecting to Memcachier:', details);
      });
    }

    return MemcachierClient.instance;
  }
}

export const memcachierCache = {
  async get(key: string): Promise<string | null> {
    const client = MemcachierClient.getInstance();
    return new Promise((resolve, reject) => {
      client.get(key, (err, data) => {
        if (err) {
          console.error('Error getting key from Memcachier:', err);
          return reject(err);
        }
        resolve(data || null);
      });
    });
  },

  async set(key: string, value: string, expirationSeconds: number): Promise<void> {
    const client = MemcachierClient.getInstance();
    return new Promise((resolve, reject) => {
      client.set(key, value, expirationSeconds, (err) => {
        if (err) {
          console.error('Error setting key in Memcachier:', err);
          return reject(err);
        }
        resolve();
      });
    });
  },
};
