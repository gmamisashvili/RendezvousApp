import {Redirect} from 'expo-router';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {useAuth} from '../store/auth/authContext';
import Colors from "../constants/Colors";

export default function Index() {
    const {isAuthenticated, isLoading} = useAuth();

    // Show loading indicator while checking authentication
    if (isLoading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color={Colors.primary}/>
            </View>
        );
    }

    // Only redirect after authentication check is complete
    return isAuthenticated ? <Redirect href="/(tabs)/dashboard"/> : <Redirect href="/auth"/>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
    },
});
