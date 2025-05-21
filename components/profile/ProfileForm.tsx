// filepath: /Users/giorgimamisashvili/Desktop/Projects/Rendezvous/rendezvous-app/components/profile/ProfileForm.tsx
import React, {useState} from 'react';
import {ActivityIndicator, Alert, StyleSheet, Text, View} from 'react-native';
import {Gender, User} from '../../types';
import {authService} from '../../services';
import {useAuth} from '../../store';
import Input from '../common/Input';
import Button from "../common/Button";
import {SegmentedButtons, TextInput} from "react-native-paper";

interface ProfileFormProps {
    user: User;
}

const ProfileForm: React.FC<ProfileFormProps> = ({user}) => {
    const {user: currentUser} = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user.name,
        email: user.email,
        gender: user.gender,
        interestedInGenders: user.interestedInGenders,
    });

    const handleChange = (name: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Helper function to convert selection to Gender array
    const handleGenderSelection = (value: string) => {
        let selectedGenders: Gender[];

        if (value === 'both') {
            selectedGenders = [Gender.Male, Gender.Female];
        } else if (value === 'male') {
            selectedGenders = [Gender.Male];
        } else {
            selectedGenders = [Gender.Female];
        }

        handleChange('interestedInGenders', selectedGenders);
    };

    // Helper function to determine the current selection value
    const getCurrentGenderSelection = (): string => {
        const { interestedInGenders } = formData;

        if (interestedInGenders.length > 1) {
            return 'both';
        } else if (interestedInGenders.includes(Gender.Male)) {
            return 'male';
        } else {
            return 'female';
        }
    };

    const handleSubmit = async () => {
        if (!currentUser) return;

        setIsLoading(true);
        try {
            const response = await authService.updateProfile({
                userId: currentUser.userId,
                ...formData
            });

            if (response.success) {
                Alert.alert('Success', 'Profile updated successfully');
            } else {
                Alert.alert('Error', response.error || 'Failed to update profile');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                label="Name"
                style={styles.name}
                value={formData.name}
                editable={false}
            />
            <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
            />
            <Text>Gender</Text>
            <TextInput
                value={formData.gender === Gender.Male ? 'Male' : 'Female'}
                style={styles.name}
                editable={false}
            />
            <Text>Interested In</Text>
            <SegmentedButtons
                value={getCurrentGenderSelection()}
                onValueChange={handleGenderSelection}
                buttons={[
                    {value: 'male', label: 'Male'},
                    {value: 'female', label: 'Female'},
                    {value: 'both', label: 'Both'}
                ]}
            />
            <Button
                title={isLoading ? 'Updating...' : 'Update Profile'}
                onPress={handleSubmit}
                disabled={isLoading}
            />
            {isLoading && <ActivityIndicator size="small" color="#0000ff" />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },
    name: {
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
    },
});

export default ProfileForm;
