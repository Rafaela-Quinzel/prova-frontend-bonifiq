import type { PostMessagePayload } from '../types';

/**
 * Get the logged user ID from the parent window via postMessage
 * Works across different domains (iframe communication)
 * @returns Promise with the user ID
 */
export const getUserIdFromParent = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(
        new Error(
          'Timeout waiting for user ID from parent window. Make sure window.loggedUserId is defined.'
        )
      );
    }, 5000);

    const handleMessage = (event: MessageEvent<PostMessagePayload>) => {
      // Validate that the message is from the expected source
      if (event.data.type === 'USER_ID_RESPONSE' && event.data.userId) {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        resolve(event.data.userId);
      }
    };

    // Listen for the response from parent window
    window.addEventListener('message', handleMessage);

    // Request the user ID from parent
    const payload: PostMessagePayload = { type: 'GET_USER_ID' };
    window.parent.postMessage(payload, '*');
  });
};

/**
 * Send a message to the parent window
 * @param type - Message type
 * @param data - Additional data to send
 */
export const sendMessageToParent = (
  type: PostMessagePayload['type'],
  data?: Record<string, unknown>
): void => {
  const payload: PostMessagePayload = { type, ...data };
  window.parent.postMessage(payload, '*');
};

/**
 * Register a message listener for parent window messages
 * @param callback - Function to call when a message is received
 */
export const onParentMessage = (
  callback: (payload: PostMessagePayload) => void
): void => {
  window.addEventListener('message', (event) => {
    callback(event.data);
  });
};
