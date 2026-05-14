/**
 * Widget Script - Bonifiq
 */
// @ts-nocheck

const ELEMENT_IDS = {
    BUTTON_ID: 'bonifiq-widget-button',
    IFRAME_ID: 'bonifiq-widget-iframe',
    CONTAINER_ID: 'bonifiq-widget-container',
    HEADER_ID: 'bonifiq-widget-header',
    WIDGET_TITLE_ID: 'bonifiq-widget-title',
    CLOSE_BTN_ID: 'bonifiq-close-btn',
    WIDGET_CSS_ID: 'bonifiq-widget-css',
    FONT_AWESOME_ID: 'bonifiq-fontawesome',
};

const BUTTON_ICONS = {
    OPEN: '<i class="fa-solid fa-angle-up"></i>',
    CLOSE: '<i class="fa-solid fa-xmark"></i>',
    DOWN: '<i class="fa-solid fa-angle-down"></i>',
};

const CONFIG = {
    STYLE_REL: 'stylesheet',
    WIDGET_URL: window.BONIFIQ_WIDGET_URL || 'http://localhost:5173',
    WIDGET_CSS_PATH: window.BONIFIQ_WIDGET_CSS_PATH || '../../public/widget.css',
    FONT_AWESOME_URL: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css',
};

(function () {
    /**
     * Load external CSS
     */
    function loadCSS() {
        if (document.getElementById(ELEMENT_IDS.WIDGET_CSS_ID)) return;

        const link = document.createElement('link');

        link.id = ELEMENT_IDS.WIDGET_CSS_ID;
        link.rel = CONFIG.STYLE_REL;
        link.href = CONFIG.WIDGET_CSS_PATH;

        link.onerror = () => {
            console.error(
                '[Bonifiq Widget] Failed to load CSS:',
                CONFIG.WIDGET_CSS_PATH
            );
        };

        document.head.appendChild(link);
    }

    /**
     * Load Font Awesome
     */
    function loadFontAwesome() {
        if (document.getElementById(ELEMENT_IDS.FONT_AWESOME_ID)) return;

        const link = document.createElement('link');
        link.id = ELEMENT_IDS.FONT_AWESOME_ID;
        link.rel = CONFIG.STYLE_REL;
        link.href = CONFIG.FONT_AWESOME_URL;
        document.head.appendChild(link);
    }

    function updateButtonIcon(button, isOpen) {
        button.innerHTML = isOpen
            ? BUTTON_ICONS.OPEN
            : BUTTON_ICONS.DOWN;
    }

    function initWidget() {
        /**
         * BUTTON
         */
        const button = document.createElement('button');
        button.type = 'button';
        button.id = ELEMENT_IDS.BUTTON_ID;
        updateButtonIcon(button, false);

        /**
         * CONTAINER
         */
        const container = document.createElement('div');
        container.id = ELEMENT_IDS.CONTAINER_ID;

        /**
         * HEADER
         */
        const header = document.createElement('div');
        header.id = ELEMENT_IDS.HEADER_ID;

        const title = document.createElement('h3');
        title.id = ELEMENT_IDS.WIDGET_TITLE_ID;
        title.textContent = 'BonifiQ';

        /**
         * CLOSE BUTTON
         */
        const closeBtn = document.createElement('button');

        closeBtn.type = 'button';
        closeBtn.id = ELEMENT_IDS.CLOSE_BTN_ID;
        closeBtn.innerHTML = BUTTON_ICONS.CLOSE;


        /**
         * IFRAME
         */
        const iframe = document.createElement('iframe');
        iframe.id = ELEMENT_IDS.IFRAME_ID;
        iframe.src = CONFIG.WIDGET_URL;

        // ESCONDE O IFRAME INICIALMENTE
        iframe.style.display = 'none';

        /**
         * LOADING
         */
        const loadingMessage = document.createElement('div');
        loadingMessage.id = 'bonifiq-widget-loading';

        loadingMessage.innerHTML = `
            <div class="bonifiq-loading-content">
                <i class="fa-solid fa-spinner fa-spin" style="font-size:28px;"></i>
                <p>Carregando widget...</p>
            </div>
        `;

        /**
         * ERROR MESSAGE
         */
        const errorMessage = document.createElement('div');
        errorMessage.id = 'bonifiq-widget-error';
        errorMessage.innerHTML = `
                <div class="bonifiq-error-content">
                    <i class="fa-solid fa-triangle-exclamation" style="font-size: 32px; margin-bottom: 12px;"></i>
                    <p style="margin: 0 0 8px 0;">Não foi possível carregar o widget</p>
                    <small style="color: #555;">Verifique se o sistema está online ou tente novamente mais tarde.</small>
                </div>
            `;
        errorMessage.style.display = 'none';

        // Tratamento de erro do iframe com timeout
        let widgetReady = false;
        const errorTimeout = setTimeout(() => {
            if (!widgetReady) {
                loadingMessage.style.display = 'none';

                errorMessage.style.display = 'flex';

                iframe.style.display = 'none';

                console.error(
                    '[Bonifiq Widget] Widget failed to initialize'
                );
            }
        }, 5000);

        /**
         * Assemble
         */
        header.appendChild(title);
        header.appendChild(closeBtn);

        container.appendChild(header);
        container.appendChild(loadingMessage);
        container.appendChild(iframe);
        container.appendChild(errorMessage);

        document.body.appendChild(button);
        document.body.appendChild(container);

        /**
         * EVENTS
         */
        button.addEventListener('click', toggleWidget);
        closeBtn.addEventListener('click', closeWidget);
        setupPostMessageListener(
            iframe,
            loadingMessage,
            errorMessage,
            errorTimeout,
            () => {
                widgetReady = true;
            }
        );
    }

    function toggleWidget() {
        const container = document.getElementById(ELEMENT_IDS.CONTAINER_ID);
        const button = document.getElementById(ELEMENT_IDS.BUTTON_ID);
        const isVisible = container.style.display === 'flex';

        if (isVisible) {
            closeWidget();
        } else {
            openWidget();
        }

        updateButtonIcon(button, !isVisible);
    }

    function openWidget() {
        const container = document.getElementById(ELEMENT_IDS.CONTAINER_ID);
        container.style.display = 'flex';
    }

    function closeWidget() {
        const container = document.getElementById(ELEMENT_IDS.CONTAINER_ID);
        const button = document.getElementById(ELEMENT_IDS.BUTTON_ID);

        container.style.display = 'none';
        updateButtonIcon(button, false);
    }

    function setupPostMessageListener(iframe, loadingMessage, errorMessage, errorTimeout, onWidgetReady) {
        window.addEventListener('message', (event) => {
            if (event.data?.type === 'WIDGET_READY') {
                widgetReady = true;

                clearTimeout(errorTimeout);

                loadingMessage.style.display = 'none';
                errorMessage.style.display = 'none';

                iframe.style.display = 'block';
            }

            if (
                event.data &&
                event.data.type === 'GET_USER_ID'
            ) {
                const userId =
                    window.loggedUserId !== undefined
                        ? window.loggedUserId
                        : null;

                iframe.contentWindow.postMessage(
                    {
                        type: 'USER_ID_RESPONSE',
                        userId,
                    },
                    '*'
                );
            }
        });
    }

    function startWidget() {
        loadCSS();
        loadFontAwesome();

        initWidget();
    }

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            startWidget
        );
    } else {
        startWidget();
    }
})();