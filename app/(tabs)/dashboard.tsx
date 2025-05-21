import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import Button from '../../components/common/Button';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store';
import { dateService } from '../../services';
import { Match } from '../../types';

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [hasActiveRequest, setHasActiveRequest] = useState(false);
  const [activeMatch, setActiveMatch] = useState<Match | null>(null);
  const [stats, setStats] = useState({
    totalDates: 0,
    successfulMeets: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Check for active match
        const matchResponse = await dateService.getActiveMatch();
        if (matchResponse.success && matchResponse.data) {
          setActiveMatch(matchResponse.data);
          setHasActiveRequest(true);
        } else {
          setHasActiveRequest(false);
        }

        // In a real app, you would fetch stats from the API
        setStats({
          totalDates: 5,
          successfulMeets: 3,
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {user?.name || 'User'}</Text>
        <Text style={styles.subGreeting}>Welcome to Rendezvous</Text>
      </View>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Your Dating Status</Title>
          {hasActiveRequest ? (
            <View>
              <Paragraph style={styles.statusText}>
                You have an active date match!
              </Paragraph>
              <Button
                title="View Match Details"
                onPress={() => router.push('/dashboard/date-status')}
                mode="contained"
                style={styles.button}
              />
            </View>
          ) : (
            <View>
              <Paragraph style={styles.statusText}>
                You don't have any active date requests.
              </Paragraph>
              <Button
                title="Request a Date"
                onPress={() => router.push('/dashboard/date-request')}
                mode="contained"
                style={styles.button}
              />
            </View>
          )}
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Your Dating Stats</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.totalDates}</Text>
              <Text style={styles.statLabel}>Total Dates</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.successfulMeets}</Text>
              <Text style={styles.statLabel}>Successful Meets</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Layout.padding,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.background,
  },
  subGreeting: {
    fontSize: 18,
    color: Colors.background,
  },
  card: {
    marginBottom: 24,
    elevation: 2,
  },
  statusText: {
    fontSize: 18,
    marginBottom: 12,
  },
  button: {
    marginTop: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 18,
    color: Colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.primary,
    marginTop: 12,
  },
});
