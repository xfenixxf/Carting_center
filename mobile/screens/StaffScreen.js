import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function StaffScreen() {
  const { token } = useContext(AuthContext);
  const [staff, setStaff] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'mechanic' });

  const fetchStaff = async () => {
    try {
      const res = await axios.get(`${API_URL}/staff`, { headers: { Authorization: `Bearer ${token}` } });
      setStaff(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchStaff(); }, []);

  const openCreate = () => {
    setForm({ full_name: '', email: '', password: '', role: 'mechanic' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const s = staff.find(x => x.id === selectedId);
    if (!s) return Alert.alert('Ошибка', 'Выберите сотрудника');
    setForm({ full_name: s.full_name, email: s.email, role: s.role, password: '' });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/staff/${selectedId}`, {
          full_name: form.full_name, email: form.email, role: form.role,
          password: form.password || null // если пусто, пароль не меняется
        }, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        if (!form.password) return Alert.alert('Ошибка', 'Введите пароль для нового сотрудника');
        await axios.post(`${API_URL}/staff`, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setModalVisible(false);
      setSelectedId(null);
      fetchStaff();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите сотрудника');
    Alert.alert('Удаление', 'Удалить сотрудника?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/staff/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchStaff();
          } catch (e) {
            Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось удалить');
          }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={staff}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.cardTitle}>{item.full_name}</Text>
            <Text>Email: {item.email}</Text>
            <Text style={{color: '#2563eb', fontWeight: 'bold'}}>Роль: {item.role}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}><Text style={styles.btnText}>+ Добавить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}><Text style={styles.btnText}>Изменить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}><Text style={styles.btnText}>Удалить</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>{isEditing ? 'Изменить сотрудника' : 'Новый сотрудник'}</Text>

          <Text style={styles.label}>ФИО:</Text>
          <TextInput style={styles.input} value={form.full_name} onChangeText={t => setForm({...form, full_name: t})} />

          <Text style={styles.label}>Email:</Text>
          <TextInput style={styles.input} keyboardType="email-address" autoCapitalize="none" value={form.email} onChangeText={t => setForm({...form, email: t})} />

          <Text style={styles.label}>Пароль {isEditing && '(оставьте пустым, чтобы не менять)'}:</Text>
          <TextInput style={styles.input} secureTextEntry value={form.password} onChangeText={t => setForm({...form, password: t})} />

          <Text style={styles.label}>Роль:</Text>
          <Picker selectedValue={form.role} onValueChange={(v) => setForm({ ...form, role: v })} style={styles.picker}>
            <Picker.Item label="Владелец (admin)" value="admin" />
            <Picker.Item label="Администратор (manager)" value="manager" />
            <Picker.Item label="Механик (mechanic)" value="mechanic" />
          </Picker>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.btnText}>Сохранить</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Отмена</Text></TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f4f6f9' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  selectedCard: { borderColor: '#2563eb', borderWidth: 2, backgroundColor: '#eff6ff' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#2563eb' },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', justifyContent: 'space-between' },
  addBtn: { flex: 1, backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 5 },
  editBtn: { flex: 1, backgroundColor: '#fbbf24', padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  delBtn: { flex: 1, backgroundColor: '#dc2626', padding: 12, borderRadius: 8, alignItems: 'center', marginLeft: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5, marginBottom: 15 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelBtn: { backgroundColor: '#dc2626', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 }
});