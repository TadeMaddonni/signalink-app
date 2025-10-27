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
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image
            source={require('../../../assets/images/glove.png')}
            style={styles.avatarImage}
          />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.groupName}>{owner}</Text>
          <Text style={styles.lastMessage}>
            Created by {owner_username}
          </Text>
        </View>
      </View>

      {/* Right Arrow */}
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingRight: 16,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(249, 159, 18, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(249, 159, 18, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  groupName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    letterSpacing: -0.3,
  },
  lastMessage: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
    letterSpacing: -0.2,
  },
  arrowContainer: {
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrow: {
    color: '#6B7280',
    fontSize: 18,
    fontWeight: '300',
  },
});

export default GroupCard;