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
