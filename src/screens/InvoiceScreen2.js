import React from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import WorkingHoursCalculator from '../components/InsertHours';

const InvoiceScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Invoice Info */}
      <View style={styles.section}>
        <Text style={styles.header}>Invoice Info</Text>
        <Text>Date: [Insert Date]</Text>
        <Text>Number: [Invoice Number]</Text>
      </View>

      {/* Worker Info */}
      <View style={styles.section}>
        <Text style={styles.header}>Worker Info</Text>
        <Text>Name: [Worker Name]</Text>
        <Text>Email: [Worker Email]</Text>
        <Text>Address: [Worker Address]</Text>
        <Text>ABN: [Worker ABN]</Text>
      </View>

      {/* Worker Financial Info */}
      <View style={styles.section}>
        <Text style={styles.header}>Worker Financial Info</Text>
        <Text>Bank Name: [Bank Name]</Text>
        <Text>BSB: [BSB]</Text>
        <Text>Account: [Account Number]</Text>
      </View>

      {/* Billing To */}
      <View style={styles.section}>
        <Text style={styles.header}>Billing To</Text>
        <Text>Company Name: [Company Name]</Text>
        <Text>Address: [Company Address]</Text>
        <Text>ABN: [Company ABN]</Text>
      </View>

      {/* Summary Table */}
      <View style={styles.section}>
        <Text style={styles.header}>Summary</Text>
        <View style={styles.tableRow}>
          <Text style={styles.tableHeader}>Date</Text>
          <Text style={styles.tableHeader}>Address</Text>
          <Text style={styles.tableHeader}>Hours</Text>
          <Text style={styles.tableHeader}>Rate</Text>
          <Text style={styles.tableHeader}>Total</Text>
        </View>
        <View style={styles.tableRow}>
          <Text>[Date]</Text>
          <Text>[Address]</Text>
          <Text>[Working Hours]</Text>
          <Text>[Rate/hr]</Text>
          <Text>[Total]</Text>
        </View>
      </View>

      {/* Thank You Message */}
      <View style={styles.section}>
        <Text style={styles.thankYou}>Thank you for your business!</Text>
      </View>

      {/* CTA Buttons */}
      <View style={styles.buttonContainer}>
        <Button title="Download PDF" onPress={() => {}} />
        <Button title="Send Invoice" onPress={() => {}} />
        <Button title="Insert Hours" onPress={() => {<WorkingHoursCalculator/>}} />
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
