/**
 * API Error Utility
 * Maps status codes and network exceptions to user-friendly messages.
 * Prevents exposing raw status codes, technical stack traces, or credentials.
 */

export interface FriendlyError {
  messageKey: string;
  defaultMessage: string;
  statusCode?: number;
}

export function mapApiError(error: unknown): FriendlyError {
  if (error && typeof error === 'object' && 'status' in error) {
    const status = Number((error as { status: unknown }).status);
    switch (status) {
      case 400:
      case 422:
        return {
          messageKey: 'invalid_information',
          defaultMessage: "The information entered isn't valid.",
          statusCode: status
        };
      case 401:
        return {
          messageKey: 'session_expired',
          defaultMessage: 'Your session has expired. Please sign in again.',
          statusCode: status
        };
      case 403:
        return {
          messageKey: 'permission_denied',
          defaultMessage: "You don't have permission to access this.",
          statusCode: status
        };
      case 404:
        return {
          messageKey: 'not_found',
          defaultMessage: "We couldn't find what you're looking for.",
          statusCode: status
        };
      case 409:
        return {
          messageKey: 'conflict_error',
          defaultMessage: 'This information has changed. Please try again.',
          statusCode: status
        };
      case 429:
        return {
          messageKey: 'rate_limited',
          defaultMessage: 'Too many requests. Please wait a moment and try again.',
          statusCode: status
        };
      case 500:
        return {
          messageKey: 'server_error',
          defaultMessage: 'Something went wrong on our side.',
          statusCode: status
        };
      case 502:
      case 503:
      case 504:
        return {
          messageKey: 'service_unavailable',
          defaultMessage: 'The service is temporarily unavailable.',
          statusCode: status
        };
      default:
        return {
          messageKey: 'something_went_wrong',
          defaultMessage: 'Something went wrong. Please try again.',
          statusCode: status
        };
    }
  }

  // Network / Offline errors
  if (
    typeof window !== 'undefined' &&
    !window.navigator.onLine
  ) {
    return {
      messageKey: 'you_are_offline',
      defaultMessage: "You're offline or the connection was lost."
    };
  }

  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
      return {
        messageKey: 'you_are_offline',
        defaultMessage: "You're offline or the connection was lost."
      };
    }
    if (msg.includes('timeout')) {
      return {
        messageKey: 'taking_longer_than_expected',
        defaultMessage: 'This is taking longer than expected.'
      };
    }
  }

  return {
    messageKey: 'something_went_wrong',
    defaultMessage: 'Something went wrong. Please try again.'
  };
}
