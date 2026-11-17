import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function PartsScreen() {
  const { token } = useContext(AuthContext);
  const [parts, setParts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [search, setSearch] = useState('');

  const [form, setForm] = useState({ name_parts: '', description: '', quantity: '', price: '' });

  const fetchData = async () => {
    try {
      const res = await axios.get(`${API_URL}/parts`, { headers: { Authorization: `Bearer ${token}` } });
      setParts(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ name_parts: '', description: '', quantity: '', price: '' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const item = parts.find(p => p.id_parts === selectedId);
    if (!item) return Alert.alert('Ошибка', 'Выберите запчасть');

    setForm({
      name_parts: item.name_parts,
      description: item.description || '',
      quantity: item.quantity.toString(),
      price: item.price.toString()
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        name_parts: form.name_parts,
        description: form.description || null,
        quantity: parseInt(form.quantity),
        price: parseFloat(form.price)
      };

      if (isEditing) {
        await axios.put(`${API_URL}/parts/${selectedId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/parts`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setModalVisible(false);
      setSelectedId(null);
      fetchData();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите запчасть');
    Alert.alert('Удаление', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/parts/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchData();
          } catch (e) {
            Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось удалить. Возможно, запчасть используется в ТО.');
          }
      }}
    ]);
  };

  const filteredParts = parts.filter(p =>
    p.name_parts.toLowerCase().includes(search.toLowerCase()) ||
    (p.description || '').toLowerCase().includes(search.toLowerCase())
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
        data={filteredParts}
        keyExtractor={(item) => item.id_parts.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id_parts && styles.selectedCard]}
            onPress={() => setSelectedId(item.id_parts)}
          >
            <Text style={styles.cardTitle}>{item.name_parts}</Text>
            <Text>Описание: {item.description || '—'}</Text>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
              <Text style={{fontWeight: 'bold'}}>Остаток: {item.quantity} шт.</Text>
              <Text style={{fontWeight: 'bold', color: '#16a34a'}}>{item.price} ₽</Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Запчасти не найдены</Text>}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}><Text style={styles.btnText}>+ Добавить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}><Text style={styles.btnText}>Изменить</Text></TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}><Text style={styles.btnText}>Удалить</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>{isEditing ? 'Изменить запчасть' : 'Новая запчасть'}</Text>

          <Text style={styles.label}>Название:</Text>
          <TextInput style={styles.input} value={form.name_parts} onChangeText={t => setForm({...form, name_parts: t})} />

          <Text style={styles.label}>Описание:</Text>
          <TextInput style={styles.input} multiline value={form.description} onChangeText={t => setForm({...form, description: t})} />

          <Text style={styles.label}>Количество:</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={form.quantity} onChangeText={t => setForm({...form, quantity: t})} />

          <Text style={styles.label}>Цена (руб.):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={form.price} onChangeText={t => setForm({...form, price: t})} />

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