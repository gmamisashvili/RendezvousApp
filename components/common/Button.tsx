import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import Colors from '../../constants/Colors';

interface ButtonProps {
  mode?: 'text' | 'outlined' | 'contained';
  onPress: () => void;
  title: string;
  loading?: boolean;
  disabled?: boolean;
  style?: object;
}

const Button = ({
  mode = 'contained',
  onPress,
  title,
  loading = false,
  disabled = false,
  style,
}: ButtonProps) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      loading={loading}
      disabled={disabled}
      style={[styles.button, style]}
      labelStyle={styles.label}
      contentStyle={styles.content}
    >
      {title}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    marginVertical: 8,
    paddingVertical: 6,
    borderRadius: 8,
  },
  content: {
    paddingVertical: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.text,
  },
});

export default Button; 