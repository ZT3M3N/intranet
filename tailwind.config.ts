import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'var(--background)',
  			foreground: 'var(--foreground)',
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
      typography: {
        DEFAULT: {
          css: {
            // Asegurarse de que no hay fondos o bordes que interfieran con el tema oscuro
            backgroundColor: 'transparent',
            color: 'white',
            a: {
              color: '#93c5fd', // Un azul claro que se ve bien en fondos oscuros
              '&:hover': {
                color: '#bfdbfe',
              },
              textDecoration: 'underline',
              textDecorationColor: '#60a5fa',
              textUnderlineOffset: '2px',
              target: '_blank', // Para asegurarse de que todos los enlaces se abren en una nueva ventana
            },
            // Evitar cajas o backgrounds en blockquotes, code, etc.
            'blockquote p': {
              backgroundColor: 'transparent',
              color: '#e2e8f0',
            },
            code: {
              color: '#f8fafc',
              backgroundColor: 'rgba(255, 255, 255, 0.1)', // Fondo muy sutil
              padding: '0.1em 0.3em',
              borderRadius: '0.2em',
            },
            // Colores para encabezados
            h1: { color: 'white' },
            h2: { color: 'white' },
            h3: { color: 'white' },
            h4: { color: 'white' },
            strong: { color: 'white' },
            // Espaciado para párrafos
            p: { 
              marginTop: '0.75em',
              marginBottom: '0.75em',
            },
          },
        },
        // Versión invertida (para fondos oscuros)
        invert: {
          css: {
            color: 'white',
            a: {
              color: '#93c5fd',
              '&:hover': {
                color: '#bfdbfe',
              },
            },
            strong: { color: 'white' },
          },
        },
      },
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require('@tailwindcss/typography'),
  ],
};
export default config;
