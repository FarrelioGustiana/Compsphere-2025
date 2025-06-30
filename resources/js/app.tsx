import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";
import "@css/app.css";

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob("./src/**/*.tsx", {
            eager: true,
        }) as Record<string, { default: any }>;
        const page = pages[`./src/${name}.tsx`];
        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
