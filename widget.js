/**
 * Widget Script - Bonifiq
 * This script creates a floating chat-like widget that loads a React app in an iFrame
 * 
 * Usage: <script src="path/to/widget.js"></script>
 * 
 * The parent page should define: window.loggedUserId = <number>
 */
// @ts-nocheck

(function () {
  // Configuration
  const WIDGET_ID = 'bonifiq-widget';
  const BUTTON_ID = 'bonifiq-widget-button';
  const IFRAME_ID = 'bonifiq-widget-iframe';
  const CONTAINER_ID = 'bonifiq-widget-container';

  // Widget URL - adjust this to your deployed React app URL
  const WIDGET_URL =
    (window).BONIFIQ_WIDGET_URL ||
    'http://localhost:5173'; // Default for local development

  // Create widget button styles
  const buttonStyles = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.4);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    font-family: Arial, sans-serif;
  `;

  const buttonHoverStyles = `
    transform: scale(1.1);
    box-shadow: 0 6px 16px rgba(0, 123, 255, 0.6);
  `;

  // Create iframe container styles
  const containerStyles = `
    position: fixed;
    bottom: 90px;
    right: 20px;
    width: 320px;
    height: 600px;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
    background: white;
    z-index: 998;
    border: none;
    overflow: hidden;
    display: none;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  `;

  // Header styles
  const headerStyles = `
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
    color: white;
    border-bottom: 1px solid #e0e0e0;
  `;

  const closeButtonStyles = `
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  `;

  const closeButtonHoverStyles = `
    background: rgba(255, 255, 255, 0.4);
  `;

  // iFrame styles
  const iframeStyles = `
    flex: 1;
    border: none;
    width: 100%;
  `;

  /**
   * Initialize the widget
   */
  function initWidget() {
    // Check if user ID is defined
    if (typeof window.loggedUserId === 'undefined') {
      console.warn(
        '[Bonifiq Widget] window.loggedUserId is not defined. Widget will not function properly.'
      );
    }

    // Create button
    const button = document.createElement('button');
    button.id = BUTTON_ID;
    button.setAttribute('aria-label', 'Open Bonifiq Widget');
    button.innerHTML = '💬';
    button.style.cssText = buttonStyles;

    // Create container
    const container = document.createElement('div');
    container.id = CONTAINER_ID;
    container.style.cssText = containerStyles;

    // Create header with title and close button
    const header = document.createElement('div');
    header.style.cssText = headerStyles;

    const title = document.createElement('h3');
    title.textContent = 'Bonifiq Widget';
    title.style.cssText = 'margin: 0; font-size: 16px; font-weight: 600;';

    const closeBtn = document.createElement('button');
    closeBtn.id = 'bonifiq-close-btn';
    closeBtn.setAttribute('aria-label', 'Close widget');
    closeBtn.innerHTML = '✕';
    closeBtn.style.cssText = closeButtonStyles;

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Create iframe
    const iframe = document.createElement('iframe');
    iframe.id = IFRAME_ID;
    iframe.src = WIDGET_URL;
    iframe.style.cssText = iframeStyles;
    iframe.setAttribute('allow', 'same-origin');
    iframe.setAttribute('sandbox', 'allow-same-origin allow-scripts');
    iframe.setAttribute('title', 'Bonifiq Widget Content');

    // Assemble container
    container.appendChild(header);
    container.appendChild(iframe);

    // Add to DOM
    document.body.appendChild(button);
    document.body.appendChild(container);

    // Event listeners
    button.addEventListener('mouseenter', () => {
      button.style.cssText = buttonStyles + buttonHoverStyles;
    });

    button.addEventListener('mouseleave', () => {
      button.style.cssText = buttonStyles;
    });

    button.addEventListener('click', toggleWidget);

    closeBtn.addEventListener('mouseenter', () => {
      closeBtn.style.cssText = closeButtonStyles + closeButtonHoverStyles;
    });

    closeBtn.addEventListener('mouseleave', () => {
      closeBtn.style.cssText = closeButtonStyles;
    });

    closeBtn.addEventListener('click', closeWidget);

    // Handle postMessage communication
    setupPostMessageListener(iframe);
  }

  /**
   * Toggle widget visibility
   */
  function toggleWidget() {
    const container = document.getElementById(CONTAINER_ID);
    if (container) {
      const isVisible = container.style.display === 'flex';
      if (isVisible) {
        closeWidget();
      } else {
        openWidget();
      }
    }
  }

  /**
   * Open the widget
   */
  function openWidget() {
    const container = document.getElementById(CONTAINER_ID);
    if (container) {
      container.style.display = 'flex';
    }
  }

  /**
   * Close the widget
   */
  function closeWidget() {
    const container = document.getElementById(CONTAINER_ID);
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Setup postMessage listener for iframe communication
   */
  function setupPostMessageListener(iframe) {
    window.addEventListener('message', (event) => {
      // For security, you could add origin checks here
      // if (event.origin !== 'http://expected-origin.com') return;

      // Handle GET_USER_ID request from iframe
      if (event.data && event.data.type === 'GET_USER_ID') {
        const userId =
          window.loggedUserId !== undefined
            ? window.loggedUserId
            : null;

        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              type: 'USER_ID_RESPONSE',
              userId: userId,
            },
            '*'
          );
        }
      }
    });
  }

  /**
   * Wait for DOM to be ready, then initialize
   */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }

  // Expose API for external control
  window.BonifiqWidget = {
    open: openWidget,
    close: closeWidget,
    toggle: toggleWidget,
  };
})();
