import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#f4c025",
                "background-light": "#f8f8f5",
                "background-dark": "#0a0904",
                "accent-purple": "#4a1d96",
                "glass-bg": "rgba(255, 255, 255, 0.03)",
                "glass-border": "rgba(255, 255, 255, 0.1)",
            },
            fontFamily: {
                "display": ["Space Grotesk", "sans-serif"],
                "serif": ["Playfair Display", "serif"]
            },
            borderRadius: {
                "DEFAULT": "0.5rem",
                "lg": "1rem",
                "xl": "1.5rem",
                "full": "9999px"
            },
        },
    },
    plugins: [],
};
export default config;
