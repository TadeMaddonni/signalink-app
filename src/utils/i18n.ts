import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Translation resources
const resources = {
  en: {
    translation: {
      // Auth - Login
      login: {
        title: 'Welcome Back',
        subtitle: 'Sign in to continue with Signalink',
        usernameLabel: 'Username',
        passwordLabel: 'Password',
        usernamePlaceholder: 'Enter your username',
        passwordPlaceholder: 'Enter your password',
        signingIn: 'Signing In...',
        signIn: 'Sign In',
        noAccount: "Don't have an account? ",
        signUp: 'Sign up',
        continueAsGuest: 'Continue as guest',
        demoCredentials: 'Demo credentials:\nUsername: testuser\nPassword: 123456',
        usernameRequired: 'Username is required',
        passwordRequired: 'Password is required',
      },

      // Auth - Register
      register: {
        title: 'Create Account',
        subtitle: 'Join Signalink to communicate without barriers',
        nameLabel: 'Name',
        surnameLabel: 'Surname',
        userTypeLabel: 'User Type',
        usernameLabel: 'Username',
        emailLabel: 'Email',
        languageLabel: 'Language',
        passwordLabel: 'Password',
        confirmPasswordLabel: 'Confirm Password',
        namePlaceholder: 'Enter your first name',
        surnamePlaceholder: 'Enter your last name',
        usernamePlaceholder: 'Choose a username',
        emailPlaceholder: 'Enter your email',
        passwordPlaceholder: 'Enter your password',
        confirmPasswordPlaceholder: 'Confirm your password',
        regularUser: 'Regular User',
        regularUserDesc: 'Standard user account',
        gloveUser: 'Glove User',
        gloveUserDesc: 'User with sign language glove',
        english: 'English',
        spanish: 'Español',
        creatingAccount: 'Creating Account...',
        createAccount: 'Create Account',
        haveAccount: 'Already have an account? ',
        signIn: 'Sign in',
        // Validation errors
        nameRequired: 'Name is required',
        surnameRequired: 'Surname is required',
        usernameRequired: 'Username is required',
        usernameTooShort: 'Username must be at least 3 characters',
        emailRequired: 'Email is required',
        emailInvalid: 'Invalid email format',
        passwordRequired: 'Password is required',
        passwordTooShort: 'Password must be at least 6 characters',
        confirmPasswordRequired: 'Confirm password is required',
        passwordsMismatch: 'Passwords do not match',
        languageRequired: 'Language is required',
      },

      // Onboarding - Connect Glove
      onboarding: {
        connectGlove: {
          title: 'Connect Your Glove',
          subtitle: 'Turn on your Signalink glove and tap the button below to connect via Bluetooth',
          successMessage: 'Glove Connected Successfully!',
          connecting: 'Connecting...',
          connected: 'Connected',
          connectButton: 'Connect Glove',
          skipButton: 'Skip for now',
        },

        // Onboarding - How It Works
        howItWorks: {
          title: 'How It Works',
          subtitle: 'Learn how to use your Signalink glove in 3 simple steps',
          step1Title: 'Wear the Glove',
          step1Desc: 'Put on the Signalink glove and ensure it\'s powered on',
          step2Title: 'Connect via Bluetooth',
          step2Desc: 'Connect the glove to your phone via Bluetooth',
          step3Title: 'Start Signing',
          step3Desc: 'Start signing and watch your gestures turn into speech',
          continueButton: 'Continue',
          nextButton: 'Next',
          previousButton: 'Previous',
          skipTutorial: 'Skip tutorial',
        },

        // Onboarding - Benefits
        benefits: {
          title: 'Why Signalink?',
          subtitle: 'Discover the features that make communication effortless',
          feature1Title: 'Real-Time Translation',
          feature1Desc: 'Get instant translation of your sign language gestures into spoken text.',
          feature2Title: 'Multi-Language Support',
          feature2Desc: 'Communicate in multiple languages and break language barriers.',
          feature3Title: 'High Precision',
          feature3Desc: 'High-precision gesture recognition for accurate communication.',
          exclusiveFeatures: 'Exclusive Features',
          voiceSynthesis: 'Voice synthesis for audible communication',
          customGestures: 'Custom gesture learning and personalization',
          realtimeChat: 'Real-time chat integration',
          socialFeatures: 'Social features and community',
          getStarted: 'Get Started',
          continueLater: 'Continue later',
        },
      },

      // Groups
      groups: {
        title: 'My Groups',
        subtitle: 'Manage your communication groups',
        loading: 'Loading groups...',
        loadingMessages: 'Loading messages...',
        empty: "You don't have any groups yet",
        emptySubtext: 'Create your first group to get started',
        error: 'Error loading groups',
        noUserLogged: 'No user logged in',
        tabLabel: 'Groups',
        createdBy: 'Created by',
        noMessages: 'No messages yet',
        startConversation: 'Start a conversation with your group',
        recordSigns: 'Record Signs',
        typeMessage: 'Type a message...',
        groupInfo: 'Group Info',
        edit: 'Edit',
        members: 'Members',
        addMember: 'Add Member',
        loadingMembers: 'Loading members...',
        noMembers: 'No members yet',
        errorLoadingMembers: 'Error loading members',
        removeMember: 'Remove Member',
        confirmRemoveMember: 'Are you sure you want to remove this member?',
        confirmRemoveMemberDesc: 'This action cannot be undone.',
        cancel: 'Cancel',
        confirm: 'Remove',
        memberRemoved: 'Member removed successfully',
        errorRemovingMember: 'Error removing member',
        searchPlaceholder: 'Search by username or email',
        search: 'Search',
        userNotFound: 'User not found',
        searchUser: 'Search User',
        searchUserDescription: 'Enter the username or email of the user you want to add to this group.',
        addToGroup: 'Add to Group',
        memberAdded: 'Member added successfully',
        errorAddingMember: 'Error adding member',
        alreadyMember: 'User is already a member',
        enterIdentifier: 'Enter username or email',
        createGroup: 'Create Group',
        newGroup: 'New Group',
        groupName: 'Group Name',
        groupNamePlaceholder: 'Enter group name',
        create: 'Create',
        groupCreated: 'Group created successfully',
        errorCreatingGroup: 'Error creating group',
        enterGroupName: 'Please enter a group name',
        editGroupName: 'Edit Group Name',
        updateGroupName: 'Update Name',
        groupUpdated: 'Group updated successfully',
        errorUpdatingGroup: 'Error updating group',
        // Time formats
        now: 'Now',
        minutesAgo: '{{minutes}}m ago',
        hoursAgo: '{{hours}}h ago',
        daysAgo: '{{days}}d ago',
        // Audio
        audioConnected: 'Audio connected',
        audioDisconnected: 'Audio disconnected',
        audioBadge: 'Audio',
        transcribedText: 'Transcribed text:',
        stop: 'Stop',
        processing: 'Processing...',
        // TTS
        ttsError: 'Error playing audio',
      },

      // Home
      home: {
        title: 'Home',
        gloveStatusTitle: 'Glove Status',
        connected: 'Connected',
        disconnected: 'Disconnected',
        voiceMode: 'Voice Mode',
        active: 'Active',
        signsLibraryTitle: 'Signs Library',
        signsLibraryDesc: 'Learn gestures',
        groupsTitle: 'Groups',
        groupsDesc: 'Chat on groups',
        buddyTitle: 'Buddy',
        buddyDesc: 'Find near people',
        calibrationTitle: 'Custom Calibration',
        calibrationDesc: 'Calibrate your glove',
      },

      // Profile
      profile: {
        title: 'Profile',
        subtitle: 'Manage your account and preferences',
        gloveSettingsTitle: 'Glove Settings',
        gloveSettingsDesc: 'Configure your Signalink glove preferences',
        languageSettingsTitle: 'Language Settings',
        languageSettingsDesc: 'Choose your preferred translation language',
        statisticsTitle: 'Statistics',
        statisticsDesc: 'View your translation statistics and progress',
        helpTitle: 'Help & Support',
        helpDesc: 'Get help and contact support',
        defaultUser: 'User',
        defaultEmail: 'user@example.com',
        settings: 'Settings',
        signOut: 'Sign Out',
      },

      // Chat
      chat: {
        title: 'Sign Language Chat',
        connected: 'Connected',
        connecting: 'Connecting...',
        translation: 'Translation:',
        confidence: 'Confidence: {{percent}}%',
        gesture: 'Gesture: {{gesture}}',
        typePlaceholder: 'Type a message...',
        sendEmoji: '📤',
        gloveInfo: '🖐️ Glove gestures will appear in chat automatically',
      },

      // Explore
      explore: {
        title: 'Explore Signalink',
        subtitle: 'Discover features and resources to enhance your experience',
        communityTitle: 'Sign Language Community',
        communityDesc: 'Connect with others learning sign language',
        learningTitle: 'Learning Resources',
        learningDesc: 'Practice and improve your signing skills',
        challengesTitle: 'Challenges & Games',
        challengesDesc: 'Engage with interactive sign language games',
        dictionaryTitle: 'Sign Dictionary',
        dictionaryDesc: 'Browse our comprehensive sign library',
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
        networkError: 'Network error. Please try again.',
        genericError: 'Something went wrong',
        validationError: 'Please check your input',
      },
    },
  },
  es: {
    translation: {
      // Auth - Login
      login: {
        title: 'Bienvenido de Nuevo',
        subtitle: 'Inicia sesión para continuar con Signalink',
        usernameLabel: 'Usuario',
        passwordLabel: 'Contraseña',
        usernamePlaceholder: 'Ingresa tu usuario',
        passwordPlaceholder: 'Ingresa tu contraseña',
        signingIn: 'Iniciando sesión...',
        signIn: 'Iniciar Sesión',
        noAccount: '¿No tienes cuenta? ',
        signUp: 'Regístrate',
        continueAsGuest: 'Continuar como invitado',
        demoCredentials: 'Credenciales de prueba:\nUsuario: testuser\nContraseña: 123456',
        usernameRequired: 'El usuario es requerido',
        passwordRequired: 'La contraseña es requerida',
      },

      // Auth - Register
      register: {
        title: 'Crear Cuenta',
        subtitle: 'Únete a Signalink para comunicarte sin barreras',
        nameLabel: 'Nombre',
        surnameLabel: 'Apellido',
        userTypeLabel: 'Tipo de Usuario',
        usernameLabel: 'Usuario',
        emailLabel: 'Email',
        languageLabel: 'Idioma',
        passwordLabel: 'Contraseña',
        confirmPasswordLabel: 'Confirmar Contraseña',
        namePlaceholder: 'Ingresa tu nombre',
        surnamePlaceholder: 'Ingresa tu apellido',
        usernamePlaceholder: 'Elige un usuario',
        emailPlaceholder: 'Ingresa tu email',
        passwordPlaceholder: 'Ingresa tu contraseña',
        confirmPasswordPlaceholder: 'Confirma tu contraseña',
        regularUser: 'Usuario Regular',
        regularUserDesc: 'Cuenta de usuario estándar',
        gloveUser: 'Usuario con Guante',
        gloveUserDesc: 'Usuario con guante de lenguaje de señas',
        english: 'English',
        spanish: 'Español',
        creatingAccount: 'Creando cuenta...',
        createAccount: 'Crear Cuenta',
        haveAccount: '¿Ya tienes cuenta? ',
        signIn: 'Inicia sesión',
        // Validation errors
        nameRequired: 'El nombre es requerido',
        surnameRequired: 'El apellido es requerido',
        usernameRequired: 'El usuario es requerido',
        usernameTooShort: 'El usuario debe tener al menos 3 caracteres',
        emailRequired: 'El email es requerido',
        emailInvalid: 'Formato de email inválido',
        passwordRequired: 'La contraseña es requerida',
        passwordTooShort: 'La contraseña debe tener al menos 6 caracteres',
        confirmPasswordRequired: 'Confirmar contraseña es requerido',
        passwordsMismatch: 'Las contraseñas no coinciden',
        languageRequired: 'El idioma es requerido',
      },

      // Onboarding - Connect Glove
      onboarding: {
        connectGlove: {
          title: 'Conectá tu Guante',
          subtitle: 'Enciende tu guante Signalink y toca el botón de abajo para conectar vía Bluetooth',
          successMessage: '¡Guante Conectado Exitosamente!',
          connecting: 'Conectando...',
          connected: 'Conectado',
          connectButton: 'Conectar Guante',
          skipButton: 'Omitir por ahora',
        },

        // Onboarding - How It Works
        howItWorks: {
          title: 'Cómo Funciona',
          subtitle: 'Aprende cómo usar tu guante Signalink en 3 simples pasos',
          step1Title: 'Ponete el Guante',
          step1Desc: 'Ponte el guante Signalink y asegurate de que esté encendido',
          step2Title: 'Conectar vía Bluetooth',
          step2Desc: 'Conecta el guante a tu teléfono vía Bluetooth',
          step3Title: 'Comenzá a Señar',
          step3Desc: 'Comienza a señar y mira cómo tus gestos se convierten en habla',
          continueButton: 'Continuar',
          nextButton: 'Siguiente',
          previousButton: 'Anterior',
          skipTutorial: 'Omitir tutorial',
        },

        // Onboarding - Benefits
        benefits: {
          title: '¿Por qué Signalink?',
          subtitle: 'Descubre las características que hacen la comunicación sin esfuerzo',
          feature1Title: 'Traducción en Tiempo Real',
          feature1Desc: 'Obtén traducción instantánea de tus gestos de lenguaje de señas a texto hablado.',
          feature2Title: 'Soporte Multi-Idioma',
          feature2Desc: 'Comunicate en múltiples idiomas y rompe las barreras del lenguaje.',
          feature3Title: 'Alta Precisión',
          feature3Desc: 'Reconocimiento de gestos de alta precisión para comunicación precisa.',
          exclusiveFeatures: 'Características Exclusivas',
          voiceSynthesis: 'Síntesis de voz para comunicación audible',
          customGestures: 'Aprendizaje y personalización de gestos personalizados',
          realtimeChat: 'Integración de chat en tiempo real',
          socialFeatures: 'Características sociales y comunidad',
          getStarted: 'Comenzar',
          continueLater: 'Continuar luego',
        },
      },

      // Groups
      groups: {
        title: 'Mis Grupos',
        subtitle: 'Gestiona tus grupos de comunicación',
        loading: 'Cargando grupos...',
        loadingMessages: 'Cargando mensajes...',
        empty: 'No tienes grupos aún',
        emptySubtext: 'Crea tu primer grupo para comenzar',
        error: 'Error al cargar los grupos',
        noUserLogged: 'No hay usuario logueado',
        tabLabel: 'Grupos',
        createdBy: 'Creado por',
        noMessages: 'No hay mensajes aún',
        startConversation: 'Inicia una conversación con tu grupo',
        recordSigns: 'Grabar Señas',
        typeMessage: 'Escribe un mensaje...',
        groupInfo: 'Info. del grupo',
        edit: 'Editar',
        members: 'Miembros',
        addMember: 'Añadir miembro',
        loadingMembers: 'Cargando miembros...',
        noMembers: 'No hay miembros aún',
        errorLoadingMembers: 'Error al cargar miembros',
        removeMember: 'Eliminar miembro',
        confirmRemoveMember: '¿Estás seguro de que quieres eliminar este miembro?',
        confirmRemoveMemberDesc: 'Esta acción no se puede deshacer.',
        cancel: 'Cancelar',
        confirm: 'Eliminar',
        memberRemoved: 'Miembro eliminado exitosamente',
        errorRemovingMember: 'Error al eliminar miembro',
        searchPlaceholder: 'Buscar por usuario o email',
        search: 'Buscar',
        userNotFound: 'Usuario no encontrado',
        searchUser: 'Buscar Usuario',
        searchUserDescription: 'Ingresa el usuario o email del usuario que deseas agregar a este grupo.',
        addToGroup: 'Agregar al Grupo',
        memberAdded: 'Miembro agregado exitosamente',
        errorAddingMember: 'Error al agregar miembro',
        alreadyMember: 'El usuario ya es miembro',
        enterIdentifier: 'Ingresa usuario o email',
        createGroup: 'Crear Grupo',
        newGroup: 'Nuevo Grupo',
        groupName: 'Nombre del Grupo',
        groupNamePlaceholder: 'Ingresa el nombre del grupo',
        create: 'Crear',
        groupCreated: 'Grupo creado exitosamente',
        errorCreatingGroup: 'Error al crear el grupo',
        enterGroupName: 'Por favor ingresa un nombre para el grupo',
        editGroupName: 'Editar Nombre del Grupo',
        updateGroupName: 'Actualizar Nombre',
        groupUpdated: 'Grupo actualizado exitosamente',
        errorUpdatingGroup: 'Error al actualizar el grupo',
        // Time formats
        now: 'Ahora',
        minutesAgo: 'Hace {{minutes}}m',
        hoursAgo: 'Hace {{hours}}h',
        daysAgo: 'Hace {{days}}d',
        // Audio
        audioConnected: 'Audio conectado',
        audioDisconnected: 'Audio desconectado',
        audioBadge: 'Audio',
        transcribedText: 'Texto transcrito:',
        stop: 'Detener',
        processing: 'Procesando...',
        // TTS
        ttsError: 'Error al reproducir el audio',
      },

      // Home
      home: {
        title: 'Inicio',
        gloveStatusTitle: 'Estado del Guante',
        connected: 'Conectado',
        disconnected: 'Desconectado',
        voiceMode: 'Modo de Voz',
        active: 'Activo',
        signsLibraryTitle: 'Biblioteca de Señas',
        signsLibraryDesc: 'Aprende gestos',
        groupsTitle: 'Grupos',
        groupsDesc: 'Chatea en grupos',
        buddyTitle: 'Compañero',
        buddyDesc: 'Encuentra personas cerca',
        calibrationTitle: 'Calibración Personalizada',
        calibrationDesc: 'Calibra tu guante',
      },

      // Profile
      profile: {
        title: 'Perfil',
        subtitle: 'Gestiona tu cuenta y preferencias',
        gloveSettingsTitle: 'Configuración del Guante',
        gloveSettingsDesc: 'Configura las preferencias de tu guante Signalink',
        languageSettingsTitle: 'Configuración de Idioma',
        languageSettingsDesc: 'Elige tu idioma de traducción preferido',
        statisticsTitle: 'Estadísticas',
        statisticsDesc: 'Ve tus estadísticas de traducción y progreso',
        helpTitle: 'Ayuda y Soporte',
        helpDesc: 'Obtén ayuda y contacta con soporte',
        defaultUser: 'Usuario',
        defaultEmail: 'usuario@ejemplo.com',
        settings: 'Configuración',
        signOut: 'Cerrar Sesión',
      },

      // Chat
      chat: {
        title: 'Chat de Lenguaje de Señas',
        connected: 'Conectado',
        connecting: 'Conectando...',
        translation: 'Traducción:',
        confidence: 'Confianza: {{percent}}%',
        gesture: 'Gesto: {{gesture}}',
        typePlaceholder: 'Escribe un mensaje...',
        sendEmoji: '📤',
        gloveInfo: '🖐️ Los gestos del guante aparecerán automáticamente en el chat',
      },

      // Explore
      explore: {
        title: 'Explorar Signalink',
        subtitle: 'Descubre características y recursos para mejorar tu experiencia',
        communityTitle: 'Comunidad de Lenguaje de Señas',
        communityDesc: 'Conecta con otros aprendiendo lenguaje de señas',
        learningTitle: 'Recursos de Aprendizaje',
        learningDesc: 'Practica y mejora tus habilidades de señas',
        challengesTitle: 'Desafíos y Juegos',
        challengesDesc: 'Participa en juegos interactivos de lenguaje de señas',
        dictionaryTitle: 'Diccionario de Señas',
        dictionaryDesc: 'Explora nuestra biblioteca completa de señas',
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

// Function to get saved language from AsyncStorage
const getSavedLanguage = async (): Promise<string> => {
  try {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.language) {
        console.log('🌐 i18n init - Idioma del usuario guardado:', user.language);
        return user.language;
      }
    }
  } catch (error) {
    console.error('Error loading saved language:', error);
  }
  console.log('🌐 i18n init - Usando idioma por defecto: en');
  return 'en';
};

// Initialize i18n with saved language
const initI18n = async () => {
  const savedLanguage = await getSavedLanguage();

  await i18n
    .use(initReactI18next)
    .init({
      compatibilityJSON: 'v4',
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
    });

  console.log('🌐 i18n inicializado con idioma:', i18n.language);
};

// Start initialization immediately
initI18n();

export default i18n;
