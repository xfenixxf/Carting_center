import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function TeamsScreen() {
  const { token } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ name: '', is_active: 'true' });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } });
      setTeams(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ name: '', is_active: 'true' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const t = teams.find(x => x.id === selectedId);
    if (!t) return Alert.alert('Ошибка', 'Выберите команду');
    setForm({ name: t.name, is_active: t.is_active ? 'true' : 'false' });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const payload = { name: form.name, is_active: form.is_active === 'true' };
      if (isEditing) {
        await axios.put(`${API_URL}/teams/${selectedId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/teams`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }
      setModalVisible(false);
      setSelectedId(null);
      fetchData();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите команду');
    Alert.alert('Удаление', 'Удалить команду?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/teams/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchData();
          } catch (e) {
            Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось удалить');
          }
      }}
    ]);
  };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Поиск по названию..." value={search} onChangeText={setSearch} />
      
      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={{color: item.is_active ? 'green' : 'red'}}>
              {item.is_active ? 'Активна' : 'Неактивна'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Команды не найдены</Text>}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}><Text style={styles.btnText}>+ Добавить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}><Text style={styles.btnText}>Изменить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}><Text style={styles.btnText}>Удалить</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>{isEditing ? 'Изменить команду' : 'Новая команда'}</Text>
          
          <Text style={styles.label}>Название:</Text>
          <TextInput style={styles.input} value={form.name} onChangeText={t => setForm({...form, name: t})} />

          <Text style={styles.label}>Статус:</Text>
          <Picker selectedValue={form.is_active} onValueChange={(v) => setForm({ ...form, is_active: v })} style={styles.picker}>
            <Picker.Item label="Активна" value="true" />
            <Picker.Item label="Неактивна" value="false" />
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
  searchInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, backgroundColor: '#fff', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  selectedCard: { borderColor: '#2563eb', borderWidth: 2, backgroundColor: '#eff6ff' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#2563eb' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
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