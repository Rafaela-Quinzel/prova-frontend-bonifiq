/**
 * Widget Script - Bonifiq
 */
// @ts-nocheck

(function () {
    const BUTTON_ID = 'bonifiq-widget-button';
    const IFRAME_ID = 'bonifiq-widget-iframe';
    const CONTAINER_ID = 'bonifiq-widget-container';

    const WIDGET_URL =
        window.BONIFIQ_WIDGET_URL || 'http://localhost:5173';

    /**
     * Load external CSS
     */
    function loadCSS() {
        if (document.getElementById('bonifiq-widget-css')) return;

        const link = document.createElement('link');

        link.id = 'bonifiq-widget-css';
        link.rel = 'stylesheet';

        link.href =  '../../public/widget.css';

        document.head.appendChild(link);

        console.log(
            '[Bonifiq Widget] CSS Loaded:',
            link.href
        );
    }

    /**
     * Load Font Awesome
     */
    function loadFontAwesome() {
        if (document.getElementById('bonifiq-fontawesome')) return;

        const link = document.createElement('link');

        link.id = 'bonifiq-fontawesome';
        link.rel = 'stylesheet';

        link.href =
            'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';

        document.head.appendChild(link);
    }

    function updateButtonIcon(button, isOpen) {
        button.innerHTML = isOpen
            ? '<i class="fa-solid fa-angle-up"></i>'
            : '<i class="fa-solid fa-angle-down"></i>';
    }

    function initWidget() {
        // loadCSS(() => {
        //     loadFontAwesome();
        // });

        /**
         * BUTTON
         */
        const button = document.createElement('button');

        button.type = 'button';
        button.id = BUTTON_ID;

        updateButtonIcon(button, false);

        /**
         * CONTAINER
         */
        const container = document.createElement('div');

        container.id = CONTAINER_ID;

        /**
         * HEADER
         */
        const header = document.createElement('div');

        header.id = 'bonifiq-widget-header';

        const title = document.createElement('h3');

        title.id = 'bonifiq-widget-title';
        title.textContent = 'BonifiQ';

        /**
         * CLOSE BUTTON
         */
        const closeBtn = document.createElement('button');

        closeBtn.type = 'button';
        closeBtn.id = 'bonifiq-close-btn';

        closeBtn.innerHTML =
            '<i class="fa-solid fa-xmark"></i>';

        /**
         * IFRAME
         */
        const iframe = document.createElement('iframe');

        iframe.id = IFRAME_ID;
        iframe.src = WIDGET_URL;

        /**
         * Assemble
         */
        header.appendChild(title);
        header.appendChild(closeBtn);

        container.appendChild(header);
        container.appendChild(iframe);

        document.body.appendChild(button);
        document.body.appendChild(container);

        /**
         * EVENTS
         */
        button.addEventListener('click', toggleWidget);

        closeBtn.addEventListener('click', closeWidget);

        setupPostMessageListener(iframe);
    }

    function toggleWidget() {
        const container =
            document.getElementById(CONTAINER_ID);

        const button =
            document.getElementById(BUTTON_ID);

        const isVisible =
            container.style.display === 'flex';

        if (isVisible) {
            closeWidget();
        } else {
            openWidget();
        }

        updateButtonIcon(button, !isVisible);
    }

    function openWidget() {
        const container =
            document.getElementById(CONTAINER_ID);

        container.style.display = 'flex';
    }

    function closeWidget() {
        const container =
            document.getElementById(CONTAINER_ID);

        const button =
            document.getElementById(BUTTON_ID);

        container.style.display = 'none';

        updateButtonIcon(button, false);
    }

    function setupPostMessageListener(iframe) {
        window.addEventListener('message', (event) => {
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
        console.log('[Bonifiq Widget] Starting');

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