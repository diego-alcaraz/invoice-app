import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import WorkingHoursCalculator from '../components/InsertHours';

const InvoiceScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.headerSection}>
        <View style={styles.companyDetails}>
          <Text>Company Name</Text>
          <Text>123 Business St.</Text>
          <Text>City, State, ZIP</Text>
          <Text>Email: company@email.com</Text>
          <Text>Phone: (123) 456-7890</Text>
        </View>
        <Text style={styles.invoiceNumber}>Invoice #0001</Text>
      </View>
      
      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoBlock}>
          <Text style={styles.sectionHeader}>Bill To</Text>
          <Text>Client Name</Text>
          <Text>Client Address</Text>
          <Text>ABN: 123456789</Text>
        </View>
        <View style={styles.infoBlock}>
          <Text style={styles.sectionHeader}>Worker Info</Text>
          <Text>Worker Name</Text>
          <Text>Email: worker@email.com</Text>
          <Text>ABN: 987654321</Text>
        </View>
      </View>
      
      {/* Summary Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Date</Text>
          <Text style={styles.tableHeader}>Address</Text>
          <Text style={styles.tableHeader}>Hours</Text>
          <Text style={styles.tableHeader}>Rate</Text>
          <Text style={styles.tableHeader}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>01/01/2025</Text>
          <Text style={styles.tableCell}>123 Location</Text>
          <Text style={styles.tableCell}>8</Text>
          <Text style={styles.tableCell}>$50</Text>
          <Text style={styles.tableCell}>$400</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>01/01/2025</Text>
          <Text style={styles.tableCell}>123 Location</Text>
          <Text style={styles.tableCell}>8</Text>
          <Text style={styles.tableCell}>$50</Text>
          <Text style={styles.tableCell}>$400</Text>
        </View>

        <View style={styles.tableRow}>
          <Text style={styles.tableCell}>01/01/2025</Text>
          <Text style={styles.tableCell}>123 Location</Text>
          <Text style={styles.tableCell}>8</Text>
          <Text style={styles.tableCell}>$50</Text>
          <Text style={styles.tableCell}>$400</Text>
        </View>
      </View>
      
      {/* Summary Section */}
      <View style={styles.summarySection}>
        <Text style={styles.summaryText}>Subtotal: $400</Text>
        <Text style={styles.summaryText}>Tax: $40</Text>
        <Text style={styles.summaryText}>Total: $440</Text>
      </View>
      
      {/* Thank You Message */}
      <Text style={styles.thankYou}>Thank you for your business!</Text>
      
      {/* CTA Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Download PDF" onPress={() => {}} />
        <Button title="Send Invoice" onPress={() => {}} />
        <Button title="Insert Hours" onPress={WorkingHoursCalculator} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: '#fff',
    margin: 20,
    borderWidth: 2,
    borderColor: '#000',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  companyDetails: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  invoiceNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  infoBlock: {
    flex: 1,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableHeader: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  tableCell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: '#000',
  },
  summaryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  thankYou: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 30,
    color: '#000',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
});

export default InvoiceScreen;
