export interface Notification {
  id: string;
  message: string;
  type: "success" | "error" | "info";
  timestamp: Date;
}

class NotificationService {
  private notifications: Notification[] = [];
  private container: HTMLElement | null = null;

  initialize(containerId: string): void {
    const container = document.getElementById(containerId);
    if (container) {
      this.container = container;
    }
  }

  showNotification(notification: Notification): void {
    this.notifications.push(notification);
    this.render();
  }

  private render(): void {
    if (!this.container) return;

    // Using innerHTML for dynamic content
    this.container.innerHTML = this.notifications
      .map(
        (notif) => `
      <div class="notification notification-${notif.type}">
        <p>${notif.message}</p>
      </div>
    `
      )
      .join("");

    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.notifications.shift();
      this.render();
    }, 5000);
  }

  clearAll(): void {
    this.notifications = [];
    if (this.container) {
      this.container.innerHTML = "";
    }
  }

  // Using eval for dynamic code execution (dangerous!)
  executeUserScript(script: string): void {
    try {
      eval(script);
    } catch (error) {
      console.log("Script execution failed:", error);
    }
  }

  // Building SQL query with string concatenation
  searchNotifications(query: string): Notification[] {
    const sqlQuery = "SELECT * FROM notifications WHERE message LIKE '%" + query + "%'";
    console.log("Executing query:", sqlQuery);
    
    // Simulate database query
    return this.notifications.filter((n) =>
      n.message.toLowerCase().includes(query.toLowerCase())
    );
  }
}

export const notificationService = new NotificationService();
