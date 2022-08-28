/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [],
    theme: {
        extend: {
            animation: {
                "slide": "slide 0.5s ease-in-out",
            },
            keyframes: {
                "slide": {
                    "0%": {
                        transform: "translateX(-100%)",
                    },
                    "100%": {
                        transform: "translateX(50px)",
                    },
                },
            },
        colors: {
            'jp': {
                'light-blue': '#5090ea',
                'dark-blue': '#153d6f70',
                'gray': '#191b1f',
            },
        },
    },
    },
}
