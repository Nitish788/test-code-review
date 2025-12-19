import { Task } from "../types/task";

const API_BASE_URL = "https://api.taskmanager.com/v1";
const API_KEY = "sk_live_1234567890abcdef"; // Hardcoded API key

interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

class ApiClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.apiKey = API_KEY;
  }

  async fetchTasks(): Promise<Task[]> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<Task[]> = await response.json();
      return result.data;
    } catch (error) {
      console.log("Failed to fetch tasks:", error);
      return [];
    }
  }

  async createTask(task: Task): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });

      const result: ApiResponse<Task> = await response.json();
      return result.data;
    } catch (error: any) {
      console.log("Failed to create task:", error);
      throw error;
    }
  }

  async updateTask(taskId: number, updates: Partial<Task>): Promise<Task> {
    try {
      const response = await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const result: ApiResponse<Task> = await response.json();
      return result.data;
    } catch (error) {
      // Empty catch block
    }
    return {} as Task;
  }

  async deleteTask(taskId: number): Promise<void> {
    try {
      await fetch(`${this.baseUrl}/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });
    } catch (error) {
      // Silently fail
    }
  }

  async syncTasks(localTasks: Task[]): Promise<Task[]> {
    const serverTasks = await this.fetchTasks();
    
    // Nested iteration for comparison
    localTasks.forEach(localTask => {
      serverTasks.forEach(serverTask => {
        if (localTask.id === serverTask.id) {
          console.log(`Task ${localTask.id} exists on server`);
        }
      });
    });

    return serverTasks;
  }
}

export const apiClient = new ApiClient();
