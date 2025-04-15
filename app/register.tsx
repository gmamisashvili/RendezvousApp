import React, {useEffect, useState} from 'react';
import {ActivityIndicator, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useRouter} from 'expo-router';
import {Checkbox} from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Colors from '../constants/Colors';
import {useAuth} from '../store';
import {interestService} from '../services';
import {Interest, UserRegistration} from '../types';

// Mock interests data
const MOCK_INTERESTS = [
    {interestId: 1, name: 'Movies', category: 'Entertainment'},
    {interestId: 2, name: 'Music', category: 'Entertainment'},
    {interestId: 3, name: 'Books', category: 'Entertainment'},
    {interestId: 4, name: 'Sports', category: 'Activities'},
    {interestId: 5, name: 'Cooking', category: 'Food'},
    {interestId: 6, name: 'Travel', category: 'Activities'},
    {interestId: 7, name: 'Photography', category: 'Arts'},
    {interestId: 8, name: 'Art', category: 'Arts'},
    {interestId: 9, name: 'Technology', category: 'Science'},
    {interestId: 10, name: 'Gaming', category: 'Entertainment'}
];

// Available gender options for selection
const genderOptions = ['Male', 'Female', 'Non-binary', 'Other'];

export default function RegisterScreen() {
    const router = useRouter();
    const {register} = useAuth();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [gender, setGender] = useState('');
    const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
    const [interests, setInterests] = useState<Interest[]>([]);
    const [selectedInterestIds, setSelectedInterestIds] = useState<number[]>([]);
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingInterests, setLoadingInterests] = useState(false);
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        birthDate: '',
        interestedInGenders: '',
        interests: '',
        terms: '',
        general: ''
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [usingMockData, setUsingMockData] = useState(false);

    // Fetch interests from the API
    useEffect(() => {
        const fetchInterests = async () => {
            console.log('Fetching interests...');
            setLoadingInterests(true);
            try {
                const response = await interestService.getAllInterests();
                console.log('API response:', response);
                if (response.success && response.data && response.data.length > 0) {
                    console.log('Setting interests from API:', response.data);
                    setInterests(response.data);
                    setUsingMockData(false);
                } else {
                    // If API call fails or returns empty data, use mock data
                    console.log('Using mock interests data');
                    setInterests(MOCK_INTERESTS);
                    setUsingMockData(true);
                }
            } catch (error) {
                console.error('Error fetching interests:', error);
                // Use mock data as fallback
                console.log('Using mock interests data after error');
                setInterests(MOCK_INTERESTS);
                setUsingMockData(true);
            } finally {
                setLoadingInterests(false);
            }
        };

        fetchInterests();
    }, []);

    // Log when interests change
    useEffect(() => {
        console.log('Current interests:', interests);
    }, [interests]);

    const validateForm = () => {
        let valid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            gender: '',
            birthDate: '',
            interestedInGenders: '',
            interests: '',
            terms: '',
            general: ''
        };

        if (!name) {
            newErrors.name = 'Name is required';
            valid = false;
        }

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
            valid = false;
        }

        if (!gender) {
            newErrors.gender = 'Gender is required';
            valid = false;
        }

        if (selectedGenders.length === 0) {
            newErrors.interestedInGenders = 'Please select at least one gender you are interested in';
            valid = false;
        }

        if (!birthDate) {
            newErrors.birthDate = 'Birth date is required';
            valid = false;
        } else {
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            if (age < 18) {
                newErrors.birthDate = 'You must be at least 18 years old';
                valid = false;
            }
        }

        if (selectedInterestIds.length === 0) {
            newErrors.interests = 'Please select at least one interest';
            valid = false;
        }

        if (!agreeToTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleRegister = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const userData: UserRegistration = {
                name,
                email,
                password,
                gender,
                interestedInGenders: selectedGenders.join(','),
                dateOfBirth: birthDate!,
                interestIds: selectedInterestIds,
                agreeToTerms
            };

            const result = await register(userData);

            if (!result.success) {
                setErrors({...errors, general: result.error || 'Registration failed'});
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            } else {
                // Navigation is handled by the auth context

            }
        } catch (error: any) {
            setErrors({...errors, general: error.message || 'An unexpected error occurred'});
        } finally {
            setLoading(false);
        }
    };

    const toggleInterest = (interestId: number) => {
        setSelectedInterestIds(prev =>
            prev.includes(interestId)
                ? prev.filter(id => id !== interestId)
                : [...prev, interestId]
        );
    };

    const toggleGenderSelection = (genderOption: string) => {
        setSelectedGenders(prev =>
            prev.includes(genderOption)
                ? prev.filter(g => g !== genderOption)
                : [...prev, genderOption]
        );
    };

    const onDateChange = (_: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios');
        const currentDate = selectedDate || birthDate;
        if (currentDate) {
            setBirthDate(currentDate);
        }
    };

    const formatDate = (date: Date | null) => {
        if (!date) return '';
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>Create Account</Text>

                {errors.general ? (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{errors.general}</Text>
                    </View>
                ) : null}

                <Input
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    error={errors.name}
                />

                <Input
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    error={errors.email}
                />

                <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    error={errors.password}
                />

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={[
                                styles.option,
                                gender === 'Male' && styles.selectedOption
                            ]}
                            onPress={() => setGender('Male')}
                        >
                            <Text style={gender === 'Male' ? styles.selectedOptionText : styles.optionText}>
                                Male
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.option,
                                gender === 'Female' && styles.selectedOption
                            ]}
                            onPress={() => setGender('Female')}
                        >
                            <Text style={gender === 'Female' ? styles.selectedOptionText : styles.optionText}>
                                Female
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.option,
                                gender === 'Other' && styles.selectedOption
                            ]}
                            onPress={() => setGender('Other')}
                        >
                            <Text style={gender === 'Other' ? styles.selectedOptionText : styles.optionText}>
                                Other
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Interested In</Text>
                    <View style={styles.checkboxContainer}>
                        {genderOptions.map((genderOption) => (
                            <View key={genderOption} style={styles.checkboxRow}>
                                <Checkbox
                                    status={selectedGenders.includes(genderOption) ? 'checked' : 'unchecked'}
                                    onPress={() => toggleGenderSelection(genderOption)}
                                    color={Colors.primary}
                                />
                                <Text style={styles.checkboxLabel}>{genderOption}</Text>
                            </View>
                        ))}
                    </View>
                    {errors.interestedInGenders ?
                        <Text style={styles.errorText}>{errors.interestedInGenders}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Birth Date</Text>
                    <TouchableOpacity
                        style={styles.datePickerButton}
                        onPress={() => setShowDatePicker(true)}
                    >
                        <Text style={styles.datePickerButtonText}>
                            {birthDate ? formatDate(birthDate) : 'Select Birth Date'}
                        </Text>
                    </TouchableOpacity>

                    {Platform.OS === 'ios' && (
                        <DateTimePicker
                            value={birthDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {Platform.OS === 'android' && showDatePicker && (
                        <DateTimePicker
                            value={birthDate || new Date()}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                            maximumDate={new Date()}
                        />
                    )}

                    {Platform.OS === 'web' && showDatePicker && (
                        <View style={styles.webDatePickerContainer}>
                            <input
                                type="date"
                                style={styles.webDatePicker}
                                onChange={(e) => {
                                    if (e.target.value) {
                                        setBirthDate(new Date(e.target.value));
                                        setShowDatePicker(false);
                                    }
                                }}
                                max={new Date().toISOString().split('T')[0]}
                            />
                            <TouchableOpacity
                                style={styles.closeDatePickerButton}
                                onPress={() => setShowDatePicker(false)}
                            >
                                <Text>Close</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    {errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Interests</Text>
                    {loadingInterests ? (
                        <ActivityIndicator size="small" color={Colors.primary}/>
                    ) : (
                        <>
                            {usingMockData && (
                                <Text style={styles.mockDataNotice}>Using sample interests (API unavailable)</Text>
                            )}
                            {interests.length > 0 ? (
                                <View style={styles.interestsContainer}>
                                    {interests.map((interest) => (
                                        <TouchableOpacity
                                            key={interest.interestId}
                                            style={[
                                                styles.interestChip,
                                                selectedInterestIds.includes(interest.interestId) && styles.selectedInterestChip
                                            ]}
                                            onPress={() => toggleInterest(interest.interestId)}
                                        >
                                            <Text
                                                style={[
                                                    styles.interestChipText,
                                                    selectedInterestIds.includes(interest.interestId) && styles.selectedInterestChipText
                                                ]}
                                            >
                                                {interest.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            ) : (
                                <View style={styles.emptyInterestsContainer}>
                                    <Text style={styles.emptyInterestsText}>No interests available. Please try again
                                        later.</Text>
                                </View>
                            )}
                        </>
                    )}
                    {errors.interests ? <Text style={styles.errorText}>{errors.interests}</Text> : null}
                </View>

                <View style={styles.termsContainer}>
                    <Checkbox
                        status={agreeToTerms ? 'checked' : 'unchecked'}
                        onPress={() => setAgreeToTerms(!agreeToTerms)}
                        color={Colors.primary}
                    />
                    <Text style={styles.termsText}>
                        I agree to the{' '}
                        <Text style={styles.termsLink} onPress={() => console.log('Terms pressed')}>
                            Terms and Conditions
                        </Text>
                    </Text>
                </View>
                {errors.terms ? <Text style={styles.errorText}>{errors.terms}</Text> : null}

                <Button
                    title={loading ? 'Creating Account...' : 'Create Account'}
                    onPress={handleRegister}
                    mode="contained"
                    style={styles.button}
                    disabled={loading}
                />

                {loading && (
                    <ActivityIndicator size="large" color={Colors.primary} style={styles.loader}/>
                )}

                <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => router.push('/login')}>
                        <Text style={styles.footerLink}>Login</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    scrollContent: {
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.text,
        marginVertical: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: Colors.text,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    option: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    selectedOption: {
        backgroundColor: Colors.primary,
    },
    optionText: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    selectedOptionText: {
        color: 'white',
        fontWeight: 'bold',
    },
    datePickerButton: {
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.primary,
        alignItems: 'center',
    },
    datePickerButtonText: {
        color: Colors.text,
    },
    interestsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 8,
    },
    interestChip: {
        padding: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
        margin: 6,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedInterestChip: {
        backgroundColor: Colors.primary,
    },
    interestChipText: {
        color: Colors.primary,
        fontWeight: '500',
    },
    selectedInterestChipText: {
        color: 'white',
        fontWeight: '500',
    },
    termsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    termsText: {
        marginLeft: 8,
        flex: 1,
    },
    termsLink: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    button: {
        marginVertical: 20,
    },
    loader: {
        marginTop: 20,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    footerText: {
        color: Colors.text,
    },
    footerLink: {
        color: Colors.primary,
        fontWeight: 'bold',
    },
    errorText: {
        color: Colors.error,
        marginTop: 4,
    },
    errorContainer: {
        backgroundColor: '#ffebee',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    checkboxContainer: {
        marginTop: 8,
    },
    checkboxRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    checkboxLabel: {
        fontSize: 16,
        marginLeft: 8,
    },
    webDatePickerContainer: {
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    webDatePicker: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 8,
        marginRight: 10,
        fontSize: 16,
        minWidth: 200,
    },
    closeDatePickerButton: {
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    mockDataNotice: {
        color: Colors.warning || '#f57c00',
        fontSize: 12,
        marginBottom: 8,
        fontStyle: 'italic',
    },
    emptyInterestsContainer: {
        padding: 20,
        borderWidth: 1,
        borderColor: Colors.primary,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    emptyInterestsText: {
        color: Colors.text,
        fontStyle: 'italic',
    },
}); 
