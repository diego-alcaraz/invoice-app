import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import Checkbox from 'expo-checkbox';;

const WorkingHoursCalculator = () => {
    const [kickOff, setKickOff] = useState(''); // Kick-off time in HH:mm format
    const [clockOut, setClockOut] = useState(''); // Clock-out time in HH:mm format
    const [Break, setBreak] = useState(''); // Break in hours
    const [totalHours, setTotalHours] = useState(null); // Total working hours
    const [isSelected, setSelection] = useState(false);

    const calculateHours = () => {
        if (!kickOff || !clockOut) {
            Alert.alert('Error', 'Please enter both kick-off and clock-out times.');
            return;
        }

        try {
            // Parse the times
            const [kickOffHour, kickOffMinute] = kickOff.split(':','.').map(Number);
            const [clockOutHour, clockOutMinute] = clockOut.split(':','.').map(Number);

            // Convert times to minutes
            const kickOffInMinutes = kickOffHour * 60 + kickOffMinute;
            const clockOutInMinutes = clockOutHour * 60 + clockOutMinute;

            // Calculate the difference in minutes
            let minutesWorked = clockOutInMinutes - kickOffInMinutes - Break * 60;

            // Handle overnight shifts
            if (minutesWorked < 0) {
                minutesWorked += 24 * 60; // Add 24 hours worth of minutes
            }

            // Convert total minutes to hours and minutes
            const hours = Math.floor(minutesWorked / 60);
            const minutes = minutesWorked % 60;

            setTotalHours(`${hours} hours and ${minutes} minutes`);
        } catch (error) {
            Alert.alert('Error', 'Invalid time format. Please use HH:mm.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Working Hours Calculator</Text>

            <Text style={styles.label}>Kick Off (HH:mm):</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., 08:30"
                value={kickOff}
                onChangeText={setKickOff}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Clock Out (HH:mm):</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g., 17:45"
                value={clockOut}
                onChangeText={setClockOut}
                keyboardType="numeric"
            />

            <Text style={styles.label}>Discount break time?
            <Checkbox
                value={isSelected}
                onValueChange={setSelection}
                style={styles.checkbox}
            />
            </Text>
            
            <Text> {isSelected ? (
                <>
                <Text style={styles.label}>Break (HH):</Text>
                <TextInput
                style={styles.input}
                placeholder="e.g., 0.5"
                value={Break}
                onChangeText={setBreak}
                keyboardType="numeric"
                />
                </>
                )
                : null}
            </Text>

            <Button title="Calculate Working Hours" onPress={calculateHours} />

            {totalHours && (
                <Text style={styles.result}>Total Working Hours: {totalHours}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        fontSize: 16,
        borderRadius: 4,
        marginBottom: 20,
    },
    result: {
        marginTop: 20,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default WorkingHoursCalculator;