import axios, { AxiosInstance } from 'axios';

class HttpClient {
    private client: AxiosInstance;

    constructor(baseURL: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async get<T>(url: string, params?: object): Promise<T> {
        const response = await this.client.get(url, { params });
        return response.data;
    }

    async post<T>(url: string, data: object): Promise<T> {
        const response = await this.client.post(url, data);
        return response.data;
    }

    // 你可以扩展其他 HTTP 方法（put、delete 等）
}

export const httpClient = new HttpClient('https://api.example.com');
