import type { PostMessagePayload } from '../types';

/**
 * Recupera o ID do usuário logado da janela pai utilizando postMessage.
 * Suporta comunicação entre diferentes domínios (integração via iframe).
 * @returns Uma Promise que resolve com o ID do usuário.
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
      // Garante que a mensagem contém o payload de resposta esperado
      if (event.data.type === 'USER_ID_RESPONSE' && event.data.userId) {
        clearTimeout(timeout);
        window.removeEventListener('message', handleMessage);
        resolve(event.data.userId);
      }
    };

    // Aguarda a resposta da janela pai
    window.addEventListener('message', handleMessage);

    // Solicita o ID do usuário para a aplicação pai
    const payload: PostMessagePayload = { type: 'GET_USER_ID' };
    window.parent.postMessage(payload, '*');
  });
};

/**
 * Envia uma mensagem para a janela pai.
 * @param type - Tipo da mensagem enviada.
 * @param data - Dados adicionais opcionais.
 */
export const sendMessageToParent = (
  type: PostMessagePayload['type'],
  data?: Record<string, unknown>
): void => {
  const payload: PostMessagePayload = { type, ...data };
  window.parent.postMessage(payload, '*');
};

/**
 * Registra um listener para mensagens recebidas da janela pai.
 * @param callback - Função executada quando uma mensagem é recebida.
 */
export const onParentMessage = (
  callback: (payload: PostMessagePayload) => void
): void => {
  window.addEventListener('message', (event) => {
    callback(event.data);
  });
};
