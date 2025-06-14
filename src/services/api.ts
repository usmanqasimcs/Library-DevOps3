
import { Book } from '@/types/book';

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('token');
    console.log('ApiService initialized with token:', this.token ? 'Token present' : 'No token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    
    // Ensure we have the latest token
    this.token = localStorage.getItem('token');
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log(`Making request to: ${url}`, {
      method: config.method || 'GET',
      headers: config.headers,
      hasBody: !!config.body
    });
    
    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      console.log(`Response from ${url}:`, { 
        status: response.status, 
        ok: response.ok,
        data 
      });
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error(`Request failed for ${url}:`, error);
      throw error;
    }
  }

  // Auth methods
  async login(email: string, password: string) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    console.log('Token saved after login:', this.token);
    return response;
  }

  async register(name: string, email: string, password: string) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
    this.token = response.token;
    localStorage.setItem('token', response.token);
    console.log('Token saved after registration:', this.token);
    return response;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    console.log('Token removed on logout');
  }

  // Books methods
  async getBooks() {
    console.log('Getting books with token:', this.token ? 'Present' : 'Missing');
    return this.request('/books');
  }

  async createBook(book: Omit<Book, '_id'>) {
    console.log('Creating book with token:', this.token ? 'Present' : 'Missing');
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(book),
    });
  }

  async updateBook(id: string, updates: Partial<Book>) {
    console.log('Updating book with token:', this.token ? 'Present' : 'Missing');
    return this.request(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteBook(id: string) {
    console.log('Deleting book with token:', this.token ? 'Present' : 'Missing');
    return this.request(`/books/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
