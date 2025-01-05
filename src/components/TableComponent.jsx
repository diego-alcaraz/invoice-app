import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const UserTable = ({ users }) => {
    return (
        <View style={styles.container}>
            {/* Table Header */}
            <View style={styles.row}>
                <Text style={[styles.cell, styles.header]}>Date</Text>
                <Text style={[styles.cell, styles.header]}>Place</Text>
                <Text style={[styles.cell, styles.header]}>Kick Off</Text>
                <Text style={[styles.cell, styles.header]}>Clock Out</Text>
                <Text style={[styles.cell, styles.header]}>Break (h)</Text>
                <Text style={[styles.cell, styles.header]}>Total Hours</Text>
            </View>
            {/* Table Rows */}
            {users.map((user) => (
                <View style={styles.row} key={user.Date}>
                    <Text style={styles.cell}>{user.Date}</Text>
                    <Text style={styles.cell}>{user.Place}</Text>
                    <Text style={styles.cell}>{user.KickOff}</Text>
                    <Text style={styles.cell}>{user.ClockOut}</Text>
                    <Text style={styles.cell}>{user.BreakHours}</Text>
                    <Text style={styles.cell}>{user.TotaHours}</Text>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 16,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    cell: {
        flex: 1,
        padding: 8,
        textAlign: 'center',
    },
    header: {
        fontWeight: 'bold',
        backgroundColor: '#f4f4f4',
    },
});

export default UserTable;