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
      
      // Groups
      groups: {
        title: 'My Groups',
        subtitle: 'Manage your communication groups',
        loading: 'Loading groups...',
        empty: "You don't have any groups yet",
        emptySubtext: 'Create your first group to get started',
        error: 'Error loading groups',
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
      
      // Groups
      groups: {
        title: 'Mis Grupos',
        subtitle: 'Gestiona tus grupos de comunicación',
        loading: 'Cargando grupos...',
        empty: 'No tienes grupos aún',
        emptySubtext: 'Crea tu primer grupo para comenzar',
        error: 'Error al cargar los grupos',
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
        searchPlaceholder: 'Buscar por username o email',
        search: 'Buscar',
        userNotFound: 'Usuario no encontrado',
        searchUser: 'Buscar Usuario',
        searchUserDescription: 'Ingresa el username o email del usuario que deseas agregar a este grupo.',
        addToGroup: 'Agregar al Grupo',
        memberAdded: 'Miembro agregado exitosamente',
        errorAddingMember: 'Error al agregar miembro',
        alreadyMember: 'El usuario ya es miembro',
        enterIdentifier: 'Ingresa username o email',
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
