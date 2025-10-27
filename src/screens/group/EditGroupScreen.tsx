import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ArrowLeft, Search, Trash2, UserPlus, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import GroupService from '../../services/group/GroupService';
import UserService from '../../services/user/UserService';
import { GroupsStackParamList, Member, User } from '../../types';
import '../../utils/i18n';

type EditGroupScreenRouteProp = RouteProp<GroupsStackParamList, 'EditGroup'>;
type EditGroupScreenNavigationProp = StackNavigationProp<GroupsStackParamList, 'EditGroup'>;     

export default function EditGroupScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<EditGroupScreenNavigationProp>();
  const route = useRoute<EditGroupScreenRouteProp>();
  const { groupId, groupName, ownerUsername } = route.params;

  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Add member states
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedUser, setSearchedUser] = useState<User | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Edit group name states
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState(groupName);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedMembers = await GroupService.getGroupMembers(groupId);
      setMembers(fetchedMembers);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('groups.errorLoadingMembers'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleEdit = () => {
    setShowEditNameModal(true);
  };

  const handleCloseEditNameModal = () => {
    setShowEditNameModal(false);
    setNewGroupName(groupName);
  };

  const handleUpdateGroupName = async () => {
    if (!newGroupName.trim()) {
      Alert.alert(t('common.error'), t('groups.enterGroupName'));
      return;
    }

    if (newGroupName.trim() === groupName) {
      handleCloseEditNameModal();
      return;
    }

    try {
      setIsUpdating(true);
      await GroupService.updateGroup(groupId, newGroupName.trim());

      // Actualizar el nombre en la navegación
      navigation.setParams({
        groupName: newGroupName.trim(),
      });

      handleCloseEditNameModal();

      Alert.alert(
        t('common.success'),
        t('groups.groupUpdated')
      );
    } catch (err) {
      Alert.alert(
        t('common.error'),
        err instanceof Error ? err.message : t('groups.errorUpdatingGroup')
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAddMember = () => {
    setShowAddMemberModal(true);
  };

  const handleCloseAddMemberModal = () => {
    setShowAddMemberModal(false);
    setSearchQuery('');
    setSearchedUser(null);
    setSearchError(null);
  };

  const handleSearchUser = async () => {
    if (!searchQuery.trim()) {
      setSearchError(t('groups.enterIdentifier'));
      return;
    }

    try {
      setIsSearching(true);
      setSearchError(null);
      setSearchedUser(null);

      const user = await UserService.searchUser(searchQuery.trim());
      setSearchedUser(user);
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : t('groups.userNotFound'));
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUserToGroup = async () => {
    if (!searchedUser) return;

    try {
      setIsAdding(true);
      await GroupService.addMember(groupId, searchedUser.id);

      // Recargar la lista de miembros
      await loadMembers();

      handleCloseAddMemberModal();

      Alert.alert(
        t('common.success'),
        t('groups.memberAdded')
      );
    } catch (err) {
      Alert.alert(
        t('common.error'),
        err instanceof Error ? err.message : t('groups.errorAddingMember')
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveMemberPress = (member: Member) => {
    setMemberToDelete(member);
    setShowConfirmDialog(true);
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setMemberToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      setIsDeleting(true);
      await GroupService.deleteMember(groupId, memberToDelete.id);

      // Actualizar la lista de miembros eliminando el miembro
      setMembers(members.filter(m => m.id !== memberToDelete.id));

      setShowConfirmDialog(false);
      setMemberToDelete(null);

      // Mostrar mensaje de éxito
      Alert.alert(
        t('common.success'),
        t('groups.memberRemoved')
      );
    } catch (err) {
      Alert.alert(
        t('common.error'),
        err instanceof Error ? err.message : t('groups.errorRemovingMember')
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('groups.groupInfo')}</Text>

        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <Text style={styles.editButtonText}>{t('groups.edit')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Sección 1: Icono y nombre del grupo */}
        <View style={styles.groupInfoSection}>
          <View style={styles.groupImageContainer}>
            <Image
              source={require('../../../assets/images/glove.png')}
              style={styles.groupImage}
            />
          </View>
          <Text style={styles.groupName}>{groupName}</Text>
          <Text style={styles.ownerUsername}>
            {t('groups.createdBy')}: {ownerUsername}
          </Text>
        </View>

        {/* Sección 2: Miembros */}
        <View style={styles.membersSection}>
          <Text style={styles.sectionTitle}>{t('groups.members')}</Text>

          {/* Loading State */}
          {isLoading && (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#f99f12" />
              <Text style={styles.loadingText}>{t('groups.loadingMembers')}</Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Members Grid */}
          {!isLoading && !error && (
            <View style={styles.membersGrid}>
              {/* Add Member Button */}
              <TouchableOpacity
                style={styles.addMemberCard}
                onPress={handleAddMember}
              >
                <UserPlus size={32} color="#f99f12" />
                <Text style={styles.addMemberText}>{t('groups.addMember')}</Text>
              </TouchableOpacity>

              {/* Members List */}
              {members.map((member) => (
                <View key={member.id} style={styles.memberCard}>
                  <View style={styles.memberAvatar}>
                    <Text style={styles.memberInitials}>
                      {member.name.charAt(0)}{member.surname.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.memberInfo}>
                    <Text style={styles.memberName}>
                      {member.name} {member.surname}
                    </Text>
                    <Text style={styles.memberUsername}>@{member.username}</Text>
                    <Text style={styles.memberEmail}>{member.email}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemoveMemberPress(member)}
                  >
                    <Trash2 size={20} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}

              {/* Empty State */}
              {members.length === 0 && (
                <View style={styles.emptyMembersContainer}>
                  <Text style={styles.emptyMembersText}>
                    {t('groups.noMembers')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Edit Group Name Modal */}
      <Modal
        visible={showEditNameModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseEditNameModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.createModalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('groups.editGroupName')}</Text>
              <TouchableOpacity onPress={handleCloseEditNameModal}>
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>{t('groups.groupName')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('groups.groupNamePlaceholder')}
                placeholderTextColor="#9CA3AF"
                value={newGroupName}
                onChangeText={setNewGroupName}
                autoFocus
                maxLength={50}
              />
            </View>

            {/* Update Button */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateGroupName}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#000000" />
              ) : (
                <Text style={styles.updateButtonText}>
                  {t('groups.updateGroupName')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        visible={showAddMemberModal}
        transparent
        animationType="slide"
        onRequestClose={handleCloseAddMemberModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.addMemberModalContent}>
            {/* Header */}
            <View style={styles.addMemberHeader}>
              <Text style={styles.addMemberTitle}>{t('groups.searchUser')}</Text>
              <TouchableOpacity onPress={handleCloseAddMemberModal}>
                <X size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Description */}
            <Text style={styles.searchDescription}>
              {t('groups.searchUserDescription')}
            </Text>

            {/* Search Input */}
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder={t('groups.searchPlaceholder')}
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleSearchUser}
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={handleSearchUser}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Search size={20} color="#000000" />
                )}
              </TouchableOpacity>
            </View>

            {/* Search Error */}
            {searchError && (
              <View style={styles.searchErrorContainer}>
                <Text style={styles.searchErrorText}>{searchError}</Text>
              </View>
            )}

            {/* User Result */}
            {searchedUser && (
              <View style={styles.userResultContainer}>
                <View style={styles.userResultCard}>
                  <View style={styles.userResultAvatar}>
                    <Text style={styles.userResultInitials}>
                      {searchedUser.name?.charAt(0)}{searchedUser.surname?.charAt(0)}
                    </Text>
                  </View>
                  <View style={styles.userResultInfo}>
                    <Text style={styles.userResultName}>
                      {searchedUser.name} {searchedUser.surname}
                    </Text>
                    <Text style={styles.userResultUsername}>
                      @{searchedUser.username}
                    </Text>
                    <Text style={styles.userResultEmail}>{searchedUser.email}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.addUserButton}
                  onPress={handleAddUserToGroup}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <ActivityIndicator size="small" color="#000000" />
                  ) : (
                    <Text style={styles.addUserButtonText}>
                      {t('groups.addToGroup')}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Confirmation Dialog */}
      <Modal
        visible={showConfirmDialog}
        transparent
        animationType="fade"
        onRequestClose={handleCancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('groups.confirmRemoveMember')}
            </Text>
            <Text style={styles.modalDescription}>
              {memberToDelete && `${memberToDelete.name} ${memberToDelete.surname}`}
            </Text>
            <Text style={styles.modalSubtext}>
              {t('groups.confirmRemoveMemberDesc')}
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}
                disabled={isDeleting}
              >
                <Text style={styles.cancelButtonText}>
                  {t('groups.cancel')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {t('groups.confirm')}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  editButton: {
    padding: 4,
  },
  editButtonText: {
    color: '#f99f12',
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  groupInfoSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#1F2937',
  },
  groupImageContainer: {
    marginBottom: 16,
  },
  groupImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFC452',
    backgroundColor: '#FFF',
  },
  groupName: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.8,
  },
  ownerUsername: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  membersSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
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
  membersGrid: {
    gap: 16,
  },
  addMemberCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 24,
    borderWidth: 2,
    borderColor: '#f99f12',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  addMemberText: {
    color: '#f99f12',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  memberCard: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f99f12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberInitials: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  memberUsername: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 2,
  },
  memberEmail: {
    color: '#64748b',
    fontSize: 12,
  },
  emptyMembersContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyMembersText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  deleteButton: {
    padding: 8,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: '#374151',
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalDescription: {
    color: '#f99f12',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtext: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: '#374151',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Add Member Modal styles
  addMemberModalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    maxHeight: '80%',
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: '#374151',
  },
  addMemberHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  addMemberTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  searchDescription: {
    color: '#9CA3AF',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#f99f12',
    borderRadius: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 56,
  },
  searchErrorContainer: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    marginBottom: 16,
  },
  searchErrorText: {
    color: '#FCA5A5',
    fontSize: 14,
    textAlign: 'center',
  },
  userResultContainer: {
    marginTop: 8,
  },
  userResultCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  userResultAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f99f12',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userResultInitials: {
    color: '#000000',
    fontSize: 20,
    fontWeight: '700',
  },
  userResultInfo: {
    flex: 1,
  },
  userResultName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userResultUsername: {
    color: '#9CA3AF',
    fontSize: 14,
    marginBottom: 2,
  },
  userResultEmail: {
    color: '#64748b',
    fontSize: 12,
  },
  addUserButton: {
    backgroundColor: '#f99f12',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addUserButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  // Edit Group Name Modal styles (reusing createModalContent)
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  createModalContent: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    width: '100%',
    marginTop: 'auto',
    borderWidth: 1,
    borderColor: '#374151',
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
  },
  updateButton: {
    backgroundColor: '#f99f12',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
});