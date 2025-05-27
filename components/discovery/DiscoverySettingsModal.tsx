import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

interface DiscoverySettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: DiscoverySettings) => void;
  currentSettings: DiscoverySettings;
}

export interface DiscoverySettings {
  maxDistance: number;
  ageRange: { min: number; max: number };
  showMeToMen: boolean;
  showMeToWomen: boolean;
}

const DiscoverySettingsModal: React.FC<DiscoverySettingsModalProps> = ({
  visible,
  onClose,
  onSave,
  currentSettings,
}) => {
  const [settings, setSettings] = useState<DiscoverySettings>(currentSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const distanceOptions = [5, 10, 25, 50, 100];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name="times" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Discovery Settings</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveButton}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Distance Setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Maximum Distance</Text>
            <Text style={styles.sectionSubtitle}>
              {settings.maxDistance}km away
            </Text>
            <View style={styles.optionsContainer}>
              {distanceOptions.map((distance) => (
                <TouchableOpacity
                  key={distance}
                  style={[
                    styles.optionButton,
                    settings.maxDistance === distance && styles.optionButtonActive,
                  ]}
                  onPress={() =>
                    setSettings({ ...settings, maxDistance: distance })
                  }
                >
                  <Text
                    style={[
                      styles.optionText,
                      settings.maxDistance === distance && styles.optionTextActive,
                    ]}
                  >
                    {distance}km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Age Range Setting */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Age Range</Text>
            <Text style={styles.sectionSubtitle}>
              {settings.ageRange.min} - {settings.ageRange.max} years old
            </Text>
            
            <View style={styles.ageRangeContainer}>
              <View style={styles.ageInput}>
                <Text style={styles.ageLabel}>Min Age</Text>
                <View style={styles.ageSelector}>
                  {[18, 21, 25, 30, 35, 40, 45, 50].map((age) => (
                    <TouchableOpacity
                      key={age}
                      style={[
                        styles.ageButton,
                        settings.ageRange.min === age && styles.ageButtonActive,
                      ]}
                      onPress={() =>
                        setSettings({
                          ...settings,
                          ageRange: { ...settings.ageRange, min: age },
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.ageButtonText,
                          settings.ageRange.min === age && styles.ageButtonTextActive,
                        ]}
                      >
                        {age}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.ageInput}>
                <Text style={styles.ageLabel}>Max Age</Text>
                <View style={styles.ageSelector}>
                  {[25, 30, 35, 40, 45, 50, 55, 60, 65].map((age) => (
                    <TouchableOpacity
                      key={age}
                      style={[
                        styles.ageButton,
                        settings.ageRange.max === age && styles.ageButtonActive,
                      ]}
                      onPress={() =>
                        setSettings({
                          ...settings,
                          ageRange: { ...settings.ageRange, max: age },
                        })
                      }
                    >
                      <Text
                        style={[
                          styles.ageButtonText,
                          settings.ageRange.max === age && styles.ageButtonTextActive,
                        ]}
                      >
                        {age}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Gender Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Show me to</Text>
            
            <View style={styles.switchContainer}>
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Men</Text>
                <Switch
                  value={settings.showMeToMen}
                  onValueChange={(value) =>
                    setSettings({ ...settings, showMeToMen: value })
                  }
                  trackColor={{ false: Colors.disabled, true: Colors.primary }}
                  thumbColor={settings.showMeToMen ? 'white' : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.switchRow}>
                <Text style={styles.switchLabel}>Women</Text>
                <Switch
                  value={settings.showMeToWomen}
                  onValueChange={(value) =>
                    setSettings({ ...settings, showMeToWomen: value })
                  }
                  trackColor={{ false: Colors.disabled, true: Colors.primary }}
                  thumbColor={settings.showMeToWomen ? 'white' : '#f4f3f4'}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.disabled,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.placeholder,
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.disabled,
    backgroundColor: 'white',
  },
  optionButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  optionTextActive: {
    color: 'white',
  },
  ageRangeContainer: {
    gap: 20,
  },
  ageInput: {
    marginBottom: 16,
  },
  ageLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  ageSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  ageButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 1,
    borderColor: Colors.disabled,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ageButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  ageButtonTextActive: {
    color: 'white',
  },
  switchContainer: {
    gap: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: Colors.text,
  },
});

export default DiscoverySettingsModal;
