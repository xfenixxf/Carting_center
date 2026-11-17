import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function MaintenanceScreen() {
  const { token, user } = useContext(AuthContext);
  const [records, setRecords] = useState([]);
  const [karts, setKarts] = useState([]);
  const [types, setTypes] = useState([]);

  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({
    kart_id: '',
    type_to_id: '',
    master_id: '',
    date: '2026-10-31',
    description: ''
  });

  const fetchData = async () => {
    try {
      const [recRes, kartsRes, typesRes] = await Promise.all([
        axios.get(`${API_URL}/maintenance`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/karts`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/maintenance-types`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setRecords(recRes.data);
      setKarts(kartsRes.data);
      setTypes(typesRes.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({
      kart_id: karts[0]?.id || '',
      type_to_id: types[0]?.id || '',
      master_id: user?.id || 1,
      date: '2026-10-31',
      description: ''
    });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const m = records.find(r => r.id === selectedId);
    if (!m) return Alert.alert('Ошибка', 'Выберите запись ТО');

    setForm({
      kart_id: m.kart_id,
      type_to_id: m.type_to_id,
      master_id: m.master_id,
      date: m.date,
      description: m.description || ''
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        kart_id: parseInt(form.kart_id),
        type_to_id: parseInt(form.type_to_id),
        master_id: parseInt(form.master_id),
        date: form.date,
        description: form.description
      };

      if (isEditing) {
        await axios.put(`${API_URL}/maintenance/${selectedId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/maintenance`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setModalVisible(false);
      setSelectedId(null);
      fetchData();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите запись ТО');
    Alert.alert('Удаление', 'Удалить запись ТО?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/maintenance/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchData();
          } catch (e) {
            Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось удалить');
          }
      }}
    ]);
  };

  const filteredRecords = records.filter(r =>
    r.type_to_name.toLowerCase().includes(search.toLowerCase()) ||
    r.master_name.toLowerCase().includes(search.toLowerCase()) ||
    String(r.kart_id).includes(search)
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по карту, типу ТО или мастеру..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredRecords}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.cardTitle}>Карт K-{String(item.kart_id).padStart(3, '0')}</Text>
            <Text>Тип ТО: {item.type_to_name}</Text>
            <Text>Мастер: {item.master_name}</Text>
            <Text>Дата: {item.date}</Text>
            <Text style={{color: item.is_completed ? 'green' : '#f59e0b', fontWeight: 'bold'}}>
              {item.is_completed ? 'Завершено' : 'В работе'}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Записи ТО не найдены</Text>}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}><Text style={styles.btnText}>+ Добавить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}><Text style={styles.btnText}>Изменить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}><Text style={styles.btnText}>Удалить</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>{isEditing ? 'Изменить запись ТО' : 'Новая запись ТО'}</Text>

          <Text style={styles.label}>Карт:</Text>
          <Picker
            selectedValue={form.kart_id}
            onValueChange={(v) => setForm({ ...form, kart_id: v })}
            style={styles.picker}
          >
            {karts.map(k => (
              <Picker.Item key={k.id} label={`Карт ${k.serial_number}`} value={k.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Тип ТО:</Text>
          <Picker
            selectedValue={form.type_to_id}
            onValueChange={(v) => setForm({ ...form, type_to_id: v })}
            style={styles.picker}
          >
            {types.map(t => (
              <Picker.Item key={t.id} label={t.name_type} value={t.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Дата (ГГГГ-ММ-ДД):</Text>
          <TextInput style={styles.input} value={form.date} onChangeText={t => setForm({...form, date: t})} />

          <Text style={styles.label}>Описание:</Text>
          <TextInput style={styles.input} multiline value={form.description} onChangeText={t => setForm({...form, description: t})} />

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