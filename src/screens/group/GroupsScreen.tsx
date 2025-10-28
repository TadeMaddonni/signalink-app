import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Plus } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GroupCard from '../../components/ui/GroupCard';
import { useAuth } from '../../contexts/auth/AuthContext';
import GroupService from '../../services/group/GroupService';
import { Group, GroupsStackParamList } from '../../types';
import '../../utils/i18n';

type GroupsScreenNavigationProp = StackNavigationProp<GroupsStackParamList, 'GroupsList'>;       

export default function GroupsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<GroupsScreenNavigationProp>();
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create group states
  const [groupName, setGroupName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // Modal handlers
  const handleOpenCreateModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseCreateModal = useCallback(() => {
    setModalVisible(false);
    setGroupName('');
  }, []);

  useEffect(() => {
    if (user?.id) {
      loadGroups();
    }
  }, [user?.id]); // Recargar cuando cambie el usuario

  const loadGroups = async () => {
    if (!user?.id) {
      console.warn('⚠️ No hay usuario logueado');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log('📦 Cargando grupos para usuario:', user.id, user.name);
      const fetchedGroups = await GroupService.getGroupsByUser(user.id);
      setGroups(fetchedGroups);
      console.log('✅ Grupos cargados:', fetchedGroups.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los grupos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      Alert.alert(t('common.error'), t('groups.enterGroupName'));
      return;
    }

    if (!user?.id) {
      Alert.alert(t('common.error'), 'No hay usuario logueado');
      return;
    }

    try {
      setIsCreating(true);
      console.log('➕ Creando grupo para usuario:', user.id, user.name);
      await GroupService.createGroup(groupName.trim(), user.id);

      // Recargar la lista de grupos
      await loadGroups();

      handleCloseCreateModal();

      Alert.alert(
        t('common.success'),
        t('groups.groupCreated')
      );
    } catch (err) {
      Alert.alert(
        t('common.error'),
        err instanceof Error ? err.message : t('groups.errorCreatingGroup')
      );
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContent}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>{t('groups.title')}</Text>
              <Text style={styles.subtitle}>
                {t('groups.subtitle')}
              </Text>
            </View>

            {/* Loading State */}
            {isLoading && (
              <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#f99f12" />
                <Text style={styles.loadingText}>{t('groups.loading')}</Text>
              </View>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Groups List */}
            {!isLoading && !error && groups.length > 0 && (
              <View style={styles.groupsList}>
                {groups.map((group) => (
                  <GroupCard
                    key={group.id}
                    groupId={group.id}
                    owner={group.name}
                    owner_username={group.owner_username}
                    onPress={() => navigation.navigate('GroupDetail', {
                      groupId: group.id,
                      groupName: group.name,
                      ownerUsername: group.owner_username,
                    })}
                  />
                ))}
              </View>
            )}

            {/* Empty State */}
            {!isLoading && !error && groups.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('groups.empty')}</Text>
                <Text style={styles.emptySubtext}>
                  {t('groups.emptySubtext')}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity
          style={styles.fab}
          onPress={handleOpenCreateModal}
          activeOpacity={0.8}
        >
          <Plus size={28} color="#000000" />
        </TouchableOpacity>

        {/* Modal para crear grupo */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="slide"
          onRequestClose={handleCloseCreateModal}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalOverlay}
          >
            <View style={styles.modalContent}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('groups.newGroup')}</Text>
              </View>

              {/* Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>{t('groups.groupName')}</Text>
                <TextInput
                  style={[
                    styles.input,
                    isInputFocused && styles.inputFocused
                  ]}
                  placeholder={t('groups.groupNamePlaceholder')}
                  placeholderTextColor="#9CA3AF"
                  value={groupName}
                  onChangeText={setGroupName}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  autoFocus
                  maxLength={50}
                />
              </View>

              {/* Actions */}
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCloseCreateModal}
                >
                  <Text style={styles.cancelButtonText}>{t('common.cancel')}</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.createButton,
                    (!groupName.trim() || isCreating) && styles.createButtonDisabled
                  ]}
                  onPress={handleCreateGroup}
                  disabled={isCreating || !groupName.trim()}
                >
                  {isCreating ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Text style={styles.createButtonText}>{t('groups.create')}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  innerContent: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Espacio para la barra de navegación inferior
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 16,
  },
  centerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  loadingText: {
    color: '#9CA3AF',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
  },
  groupsList: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 100, // Aumentado para evitar superposición con el menú inferior
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f99f12',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    minHeight: '50%',
  },
  modalHeader: {
    marginBottom: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  inputContainer: {
    marginBottom: 32,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#000000',
    borderWidth: 0,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  inputFocused: {
    shadowColor: '#f99f12',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#9CA3AF',
    fontSize: 16,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    backgroundColor: '#f99f12',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#374151',
  },
  createButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});
