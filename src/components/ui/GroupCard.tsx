import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface GroupCardProps {
  groupId: number;
  owner: string;
  owner_username: string;
  onPress?: () => void;
}

const GroupCard: React.FC<GroupCardProps> = ({ groupId, owner, owner_username, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      {/* Contenido izquierdo */}
      <View style={styles.leftContent}>
        <Text style={styles.ownerText}>{owner}</Text>
        <Text style={styles.createdByText}>
          Creado por: {owner_username}
        </Text>
      </View>

      {/* Imagen derecha */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/images/group.png')}
          style={styles.image}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1F2937',
  },
  leftContent: {
    flexDirection: 'column',
    gap: 8,
  },
  ownerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.8,
  },
  createdByText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: -0.5,
  },
  imageContainer: {
    borderRadius: 32,
    borderWidth: 4,
    borderColor: '#FFC452',
    backgroundColor: '#FFF',
    overflow: 'hidden',
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});

export default GroupCard;