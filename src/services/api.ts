
import { Book } from '@/types/book';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private token: string | null = localStorage.getItem('token');

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making request to: ${url}`, config);
    
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`Response from ${url}:`, { status: response.status, data });
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
  }

  // Books methods
  async getBooks() {
    return this.request('/books');
  }

  async createBook(book: Omit<Book, '_id'>) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: string, updates: Partial<Book>) {
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBook(id: string) {
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
