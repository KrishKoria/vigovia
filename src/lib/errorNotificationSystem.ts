/**
 * Error Notification System
 *
 * Provides user-friendly error notifications with different severity levels,
 * actionable suggestions, and recovery options.
 */

import { ErrorInfo, ErrorCategory, ErrorSeverity } from "./errorHandler";

export interface NotificationOptions {
  duration?: number;
  persistent?: boolean;
  showActions?: boolean;
  position?: "top" | "bottom" | "center";
  theme?: "light" | "dark" | "auto";
}

export interface ErrorNotification {
  id: string;
  title: string;
  message: string;
  severity: ErrorSeverity;
  category: ErrorCategory;
  timestamp: Date;
  actions: NotificationAction[];
  options: NotificationOptions;
}

export interface NotificationAction {
  label: string;
  action: "retry" | "fallback" | "dismiss" | "contact" | "help";
  handler: () => void;
  primary?: boolean;
}

/**
 * Error Notification Manager
 */
export class ErrorNotificationManager {
  private static notifications: Map<string, ErrorNotification> = new Map();
  private static listeners: Array<
    (notifications: ErrorNotification[]) => void
  > = [];
  private static notificationId = 0;

  /**
   * Create notification from error info
   */
  static createNotification(
    errorInfo: ErrorInfo,
    actions: Partial<{
      onRetry: () => void;
      onFallback: () => void;
      onContact: () => void;
      onHelp: () => void;
    }> = {},
    options: NotificationOptions = {}
  ): ErrorNotification {
    const id = `notification_${++this.notificationId}_${Date.now()}`;

    const notification: ErrorNotification = {
      id,
      title: this.getNotificationTitle(errorInfo),
      message: this.getNotificationMessage(errorInfo),
      severity: errorInfo.severity,
      category: errorInfo.category,
      timestamp: new Date(),
      actions: this.createNotificationActions(errorInfo, actions),
      options: {
        duration: this.getDefaultDuration(errorInfo.severity),
        persistent: errorInfo.severity === ErrorSeverity.CRITICAL,
        showActions: true,
        position: "top",
        theme: "auto",
        ...options,
      },
    };

    this.notifications.set(id, notification);
    this.notifyListeners();

    // Auto-dismiss non-persistent notifications
    if (!notification.options.persistent && notification.options.duration) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, notification.options.duration);
    }

    return notification;
  }

  /**
   * Get notification title based on error
   */
  private static getNotificationTitle(errorInfo: ErrorInfo): string {
    switch (errorInfo.category) {
      case ErrorCategory.NETWORK:
        return "Connection Issue";
      case ErrorCategory.VALIDATION:
        return "Form Validation Error";
      case ErrorCategory.SERVER:
        return "Server Error";
      case ErrorCategory.TIMEOUT:
        return "Request Timeout";
      default:
        return "Error Occurred";
    }
  }

  /**
   * Get notification message based on error
   */
  private static getNotificationMessage(errorInfo: ErrorInfo): string {
    // Use the user-friendly message from error info
    let message = errorInfo.userMessage;

    // Add quick action hint based on error type
    if (errorInfo.fallbackAvailable) {
      message += " You can try the client-side PDF generation instead.";
    }

    if (errorInfo.canRetry) {
      message += " Click 'Try Again' to retry the operation.";
    }

    return message;
  }

  /**
   * Create notification actions based on error info
   */
  private static createNotificationActions(
    errorInfo: ErrorInfo,
    handlers: Partial<{
      onRetry: () => void;
      onFallback: () => void;
      onContact: () => void;
      onHelp: () => void;
    }>
  ): NotificationAction[] {
    const actions: NotificationAction[] = [];

    // Retry action
    if (errorInfo.canRetry && handlers.onRetry) {
      actions.push({
        label: "Try Again",
        action: "retry",
        handler: handlers.onRetry,
        primary: true,
      });
    }

    // Fallback action
    if (errorInfo.fallbackAvailable && handlers.onFallback) {
      actions.push({
        label: "Use Client PDF",
        action: "fallback",
        handler: handlers.onFallback,
        primary: !errorInfo.canRetry, // Primary if retry is not available
      });
    }

    // Help action
    if (handlers.onHelp) {
      actions.push({
        label: "Get Help",
        action: "help",
        handler: handlers.onHelp,
      });
    }

    // Contact support action for critical errors
    if (errorInfo.severity === ErrorSeverity.CRITICAL && handlers.onContact) {
      actions.push({
        label: "Contact Support",
        action: "contact",
        handler: handlers.onContact,
      });
    }

    // Always add dismiss action
    actions.push({
      label: "Dismiss",
      action: "dismiss",
      handler: () => {
        // Will be handled by the notification component
      },
    });

    return actions;
  }

  /**
   * Get default duration based on severity
   */
  private static getDefaultDuration(severity: ErrorSeverity): number {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 3000; // 3 seconds
      case ErrorSeverity.MEDIUM:
        return 5000; // 5 seconds
      case ErrorSeverity.HIGH:
        return 8000; // 8 seconds
      case ErrorSeverity.CRITICAL:
        return 0; // Persistent
      default:
        return 5000;
    }
  }

  /**
   * Dismiss notification
   */
  static dismissNotification(id: string): void {
    this.notifications.delete(id);
    this.notifyListeners();
  }

  /**
   * Dismiss all notifications
   */
  static dismissAll(): void {
    this.notifications.clear();
    this.notifyListeners();
  }

  /**
   * Get all active notifications
   */
  static getNotifications(): ErrorNotification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Subscribe to notification changes
   */
  static subscribe(
    listener: (notifications: ErrorNotification[]) => void
  ): () => void {
    this.listeners.push(listener);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify all listeners of changes
   */
  private static notifyListeners(): void {
    const notifications = this.getNotifications();
    this.listeners.forEach((listener) => listener(notifications));
  }

  /**
   * Create success notification
   */
  static createSuccessNotification(
    message: string,
    options: NotificationOptions = {}
  ): ErrorNotification {
    const id = `success_${++this.notificationId}_${Date.now()}`;

    const notification: ErrorNotification = {
      id,
      title: "Success",
      message,
      severity: ErrorSeverity.LOW,
      category: ErrorCategory.CLIENT,
      timestamp: new Date(),
      actions: [
        {
          label: "Dismiss",
          action: "dismiss",
          handler: () => this.dismissNotification(id),
        },
      ],
      options: {
        duration: 3000,
        persistent: false,
        showActions: false,
        position: "top",
        theme: "auto",
        ...options,
      },
    };

    this.notifications.set(id, notification);
    this.notifyListeners();

    // Auto-dismiss
    if (notification.options.duration) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, notification.options.duration);
    }

    return notification;
  }

  /**
   * Create warning notification
   */
  static createWarningNotification(
    message: string,
    actions: NotificationAction[] = [],
    options: NotificationOptions = {}
  ): ErrorNotification {
    const id = `warning_${++this.notificationId}_${Date.now()}`;

    const notification: ErrorNotification = {
      id,
      title: "Warning",
      message,
      severity: ErrorSeverity.MEDIUM,
      category: ErrorCategory.CLIENT,
      timestamp: new Date(),
      actions: [
        ...actions,
        {
          label: "Dismiss",
          action: "dismiss",
          handler: () => this.dismissNotification(id),
        },
      ],
      options: {
        duration: 5000,
        persistent: false,
        showActions: true,
        position: "top",
        theme: "auto",
        ...options,
      },
    };

    this.notifications.set(id, notification);
    this.notifyListeners();

    // Auto-dismiss
    if (notification.options.duration) {
      setTimeout(() => {
        this.dismissNotification(id);
      }, notification.options.duration);
    }

    return notification;
  }
}

/**
 * Convenience functions for common notification scenarios
 */

export function notifyError(
  errorInfo: ErrorInfo,
  actions?: Partial<{
    onRetry: () => void;
    onFallback: () => void;
    onContact: () => void;
    onHelp: () => void;
  }>,
  options?: NotificationOptions
): ErrorNotification {
  return ErrorNotificationManager.createNotification(
    errorInfo,
    actions,
    options
  );
}

export function notifySuccess(
  message: string,
  options?: NotificationOptions
): ErrorNotification {
  return ErrorNotificationManager.createSuccessNotification(message, options);
}

export function notifyWarning(
  message: string,
  actions?: NotificationAction[],
  options?: NotificationOptions
): ErrorNotification {
  return ErrorNotificationManager.createWarningNotification(
    message,
    actions,
    options
  );
}

export function dismissNotification(id: string): void {
  ErrorNotificationManager.dismissNotification(id);
}

export function dismissAllNotifications(): void {
  ErrorNotificationManager.dismissAll();
}

export function subscribeToNotifications(
  listener: (notifications: ErrorNotification[]) => void
): () => void {
  return ErrorNotificationManager.subscribe(listener);
}

/**
 * React hook for using notifications (if using React)
 */
export function useErrorNotifications() {
  if (typeof window === "undefined") {
    return {
      notifications: [],
      notifyError: () => ({} as ErrorNotification),
      notifySuccess: () => ({} as ErrorNotification),
      notifyWarning: () => ({} as ErrorNotification),
      dismissNotification: () => {},
      dismissAll: () => {},
    };
  }

  // This would be implemented as a proper React hook in a React environment
  return {
    notifications: ErrorNotificationManager.getNotifications(),
    notifyError,
    notifySuccess,
    notifyWarning,
    dismissNotification,
    dismissAll: dismissAllNotifications,
  };
}
