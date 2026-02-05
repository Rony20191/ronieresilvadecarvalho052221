import type { Config } from 'tailwindcss'

const config: Config = {
    // 1. Especifique onde o Tailwind deve procurar classes
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/**/*.{js,ts,jsx,tsx,mdx}', // se você usar a pasta src
    ],

    // 2. Habilite o modo dark
    darkMode: 'class', // ou 'media' para usar prefers-color-scheme

    // 3. Tema - estenda ou substitua as configurações padrão
    theme: {
        extend: {
            // Cores personalizadas
            colors: {
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                    800: '#1e40af',
                    900: '#1e3a8a',
                    950: '#172554',
                },
                secondary: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
            },

            // Fontes personalizadas
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['Fira Code', 'monospace'],
            },

            // Espaçamento personalizado
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },

            // Bordas personalizadas
            borderRadius: {
                '4xl': '2rem',
            },

            // Animações personalizadas
            animation: {
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'bounce-slow': 'bounce 2s infinite',
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
            },

            // Gradientes personalizados
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },

    // 4. Plugins do Tailwind
    plugins: [
        require('@tailwindcss/forms'), // para estilizar formulários
        require('@tailwindcss/typography'), // para estilizar conteúdo markdown
        require('@tailwindcss/aspect-ratio'), // para proporções de aspecto
        require('tailwindcss-animate'), // para animações
    ],
}

export default config