import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      // Auth
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to continue with Signalink',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        loginButton: 'Sign In',
        registerLink: "Don't have an account? Sign up",
        forgotPassword: 'Forgot your password?',
      },
      register: {
        title: 'Create Account',
        subtitle: 'Join Signalink to communicate without barriers',
        namePlaceholder: 'Enter your name',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordPlaceholder: 'Confirm your password',
        registerButton: 'Create Account',
        loginLink: 'Already have an account? Sign in',
      },
      
      // Onboarding
      onboarding: {
        connectGlove: {
          title: 'Connect Your Signalink',
          subtitle: 'Connect your Signalink via Bluetooth to your mobile device. Please make sure Bluetooth is enabled',
          button: 'Link Glove',
          discoverMore: 'Discover more about Signalink',
        },
        howItWorks: {
          title: 'How It Works',
          subtitle: 'Our glove translates your hand signs into spoken language',
          step1: 'Put on the glove and turn it on',
          step2: 'Connect via Bluetooth',
          step3: 'Start communicating naturally',
        },
        benefits: {
          title: 'Break Communication Barriers',
          subtitle: 'Connect with anyone, anywhere, anytime',
          feature1: 'Real-time translation',
          feature2: 'Multiple languages',
          feature3: 'Accurate recognition',
        },
      },
      
      // Common
      common: {
        continue: 'Continue',
        skip: 'Skip',
        next: 'Next',
        previous: 'Previous',
        done: 'Done',
        cancel: 'Cancel',
        save: 'Save',
        delete: 'Delete',
        edit: 'Edit',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        retry: 'Retry',
      },
      
      // Errors
      errors: {
        invalidCredentials: 'Invalid credentials',
        networkError: 'Network error. Please try above.',
        genericError: 'Something went wrong',
        validationError: 'Please check your input',
      },
    },
  },
  es: {
    translation: {
      // Auth
      login: {
        title: 'Bienvenido de Nuevo',
        subtitle: 'Inicia sesión para continuar con Signalink',
        emailPlaceholder: 'Ingresa tu email',
        passwordPlaceholder: 'Ingresa tu contraseña',
        loginButton: 'Iniciar Sesión',
        registerLink: '¿No tienes cuenta? Regístrate',
        forgotPassword: '¿Olvidaste tu contraseña?',
      },
      register: {
        title: 'Crear Cuenta',
        subtitle: 'Únete a Signalink para comunicarte sin barreras',
        namePlaceholder: 'Ingresa tu nombre',
        emailPlaceholder: 'Ingresa tu email',
        passwordPlaceholder: 'Ingresa tu contraseña',
        confirmPasswordPlaceholder: 'Confirma tu contraseña',
        registerButton: 'Crear Cuenta',
        loginLink: '¿Ya tienes cuenta? Inicia sesión',
      },
      
      // Onboarding
      onboarding: {
        connectGlove: {
          title: 'Conectá tu Signalink',
          subtitle: 'Conectá tu Signalink vía Bluetooth a tu dispositivo móvil. Por favor asegurate que el mismo cuente con el bluetooth encendido',
          button: 'Vincular guante',
          discoverMore: 'Descubrí más sobre Signalink',
        },
        howItWorks: {
          title: 'Cómo Funciona',
          subtitle: 'Nuestro guante traduce tus señas de mano a lenguaje hablado',
          step1: 'Ponte el guante y enciéndelo',
          step2: 'Conecta v via Bluetooth',
          step3: 'Comienza a comunicarte naturalmente',
        },
        benefits: {
          title: 'Rompe Barreras de Comunicación',
          subtitle: 'Conecta con cualquiera, en cualquier lugar, en cualquier momento',
          feature1: 'Eraducción en tiempo real',
          feature2: 'Múltiples idiomas',
          feature3: 'Reconocimiento preciso',
        },
      },
      
      // Common
      common: {
        continue: 'Continuar',
        skip: 'Omitir',
        next: 'Siguiente',
        previous: 'Anterior',
        done: 'Hecho',
        cancel: 'Cancelar',
        save: 'Guardar',
        delete: 'Eliminar',
        edit: 'Editar',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito',
        retry: 'Reintentar',
      },
      
      // Errors
      errors: {
        invalidCredentials: 'Credenciales incorrectas',
        networkError: 'Error de conexión. Inténtalo de nuevo.',
        genericError: 'Algo salió mal',
        validationError: 'Por favor revisa tu entrada',
      },
    },
  },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v4',
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
