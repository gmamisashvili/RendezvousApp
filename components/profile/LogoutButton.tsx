import React from 'react';
import { StyleSheet } from 'react-native';
import { useAuth } from '../../store';
import Button from "../common/Button";

const LogoutButton: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <Button
      title="Logout"
      onPress={handleLogout}
      style={styles.button}
    />
  );
};

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: '#f44336',
  },
});

export default LogoutButton;
