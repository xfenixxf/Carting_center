import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function MaintenanceTypesScreen() {
  const { token } = useContext(AuthContext);
  const [types, setTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ name_type: '', description: '', recommended_interval: '' });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/maintenance-types`, { headers: { Authorization: `Bearer ${token}` } });
      setTypes(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ name_type: '', description: '', recommended_interval: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const item = types.find(t => t.id === selectedId);
    if (!item) return Alert.alert('Ошибка', 'Выберите тип ТО');

    setForm({
      name_type: item.name_type,
      description: item.description || '',
      recommended_interval: item.recommended_interval ? item.recommended_interval.toString() : ''
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name_type: form.name_type,
        description: form.description || null,
        recommended_interval: form.recommended_interval ? parseFloat(form.recommended_interval) : null
      };

      if (isEditing) {
        await axios.put(`${API_URL}/maintenance-types/${selectedId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/maintenance-types`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setModalVisible(false);
      setSelectedId(null);
      fetchData();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите тип ТО');
    Alert.alert('Удаление', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/maintenance-types/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchData();
          } catch (e) {
            Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось удалить');
          }
      }}
    ]);
  };

  const filteredTypes = types.filter(t =>
    t.name_type.toLowerCase().includes(search.toLowerCase()) ||
    (t.description || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по названию..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredTypes}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.cardTitle}>{item.name_type}</Text>
            <Text>Описание: {item.description || '—'}</Text>
            <Text>Интервал: {item.recommended_interval ? `${item.recommended_interval} дн.` : '—'}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Типы ТО не найдены</Text>}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}><Text style={styles.btnText}>+ Добавить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}><Text style={styles.btnText}>Изменить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}><Text style={styles.btnText}>Удалить</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>{isEditing ? 'Изменить тип ТО' : 'Новый тип ТО'}</Text>

          <Text style={styles.label}>Название:</Text>
          <TextInput style={styles.input} value={form.name_type} onChangeText={t => setForm({...form, name_type: t})} />

          <Text style={styles.label}>Описание:</Text>
          <TextInput style={styles.input} multiline value={form.description} onChangeText={t => setForm({...form, description: t})} />

          <Text style={styles.label}>Интервал (дней):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={form.recommended_interval} onChangeText={t => setForm({...form, recommended_interval: t})} />

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
  saveBtn: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelBtn: { backgroundColor: '#dc2626', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 }
});