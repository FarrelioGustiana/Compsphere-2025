import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "@css/app.css";
import "@css/sponsors.css";

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
