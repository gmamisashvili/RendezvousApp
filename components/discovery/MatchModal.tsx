import React from 'react';
import { 
  View, 
  Text, 
  Modal, 
  StyleSheet, 
  TouchableOpacity,
  Dimensions 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface MatchModalProps {
  visible: boolean;
  userName: string;
  onClose: () => void;
  onSendMessage?: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

const MatchModal: React.FC<MatchModalProps> = ({ 
  visible, 
  userName, 
  onClose, 
  onSendMessage 
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <FontAwesome name="times" size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <FontAwesome 
              name="heart" 
              size={80} 
              color={Colors.primary} 
              style={styles.heartIcon} 
            />
            
            <Text style={styles.title}>It's a Match!</Text>
            <Text style={styles.subtitle}>
              You and {userName} liked each other
            </Text>
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.continueButton} onPress={onClose}>
                <Text style={styles.continueButtonText}>Keep Browsing</Text>
              </TouchableOpacity>
              
              {onSendMessage && (
                <TouchableOpacity style={styles.messageButton} onPress={onSendMessage}>
                  <Text style={styles.messageButtonText}>Send Message</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    width: screenWidth - 40,
    maxWidth: 350,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    padding: 5,
  },
  content: {
    alignItems: 'center',
    marginTop: 20,
  },
  heartIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  continueButton: {
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  messageButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  messageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default MatchModal;
