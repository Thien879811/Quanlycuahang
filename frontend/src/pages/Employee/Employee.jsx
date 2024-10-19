import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const Employee = () => {
    return (
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.headerText}>Thông tin nhân viên</Text>
        </View>
        <View style={styles.infoSection}>
            <Text style={styles.label}>Họ và tên:</Text>
            <Text style={styles.info}>Nguyễn Văn A</Text>
            
            <Text style={styles.label}>Mã nhân viên:</Text>
            <Text style={styles.info}>NV001</Text>
            
            <Text style={styles.label}>Chức vụ:</Text>
            <Text style={styles.info}>Nhân viên kinh doanh</Text>
            
            <Text style={styles.label}>Phòng ban:</Text>
            <Text style={styles.info}>Phòng Kinh doanh</Text>
        </View>
        
        <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Xem chi tiết</Text>
        </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2ecc71',
    margin: 10,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Employee;
