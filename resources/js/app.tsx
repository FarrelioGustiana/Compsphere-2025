import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "@css/app.css";
import { router } from "@inertiajs/react";

router.on("navigate", (event) => {
    const url = event.detail.page.url;

    switch (url) {
        case "/":
            document.title = "Compsphere 2025";
            break;
        case "/events":
            document.title = "Events - Compsphere 2025";
            break;
        // Add more cases as needed
        default:
            document.title = "Compsphere 2025";
    }
});

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./src/**/*.tsx", {
            eager: true,
        }) as Record<string, { default: any }>;

        // Try with direct path first
        let page = pages[`./src/${name}.tsx`];

        // If not found, try with Pages prefix
        if (!page) {
            page = pages[`./src/Pages/${name}.tsx`];
            if (!page) {
                console.error(`Page not found: ${name}`);
            }
        }

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
