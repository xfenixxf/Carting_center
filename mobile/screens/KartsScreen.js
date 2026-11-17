import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function KartsScreen() {
  const { token } = useContext(AuthContext);
  const [karts, setKarts] = useState([]);
  const [kartTypes, setKartTypes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [form, setForm] = useState({ serial_number: '', kart_type_id: '', price: '', is_active: 'true' });

  const fetchData = async () => {
    try {
      const [kartsRes, typesRes] = await Promise.all([
        axios.get(`${API_URL}/karts`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/cart-types`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);
      setKarts(kartsRes.data);
      setKartTypes(typesRes.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ serial_number: '', kart_type_id: kartTypes[0]?.id || 1, price: '', is_active: 'true' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const kart = karts.find(k => k.id === selectedId);
    if (!kart) return Alert.alert('Ошибка', 'Выберите карт');
    setForm({
      serial_number: kart.serial_number,
      kart_type_id: kart.kart_type_id,
      price: kart.price.toString(),
      is_active: kart.is_active ? 'true' : 'false'
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        serial_number: form.serial_number,
        kart_type_id: parseInt(form.kart_type_id),
        price: parseFloat(form.price),
        is_active: form.is_active === 'true'
      };

      if (isEditing) {
        await axios.put(`${API_URL}/karts/${selectedId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/karts`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setModalVisible(false);
      setSelectedId(null);
      fetchData();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || e.message);
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите карт');
    Alert.alert('Удаление', 'Вы уверены?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/karts/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchData();
          } catch (e) {
            Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось удалить');
          }
      }}
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={karts}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.cardTitle}>Карт: {item.serial_number}</Text>
            <Text>Тип (ID): {item.kart_type_id}</Text>
            <Text>Цена: {item.price} ₽</Text>
            <Text style={{color: item.is_active ? 'green' : 'red'}}>
              {item.is_active ? 'Активен' : 'В ремонте'}
            </Text>
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
          <Text style={styles.title}>{isEditing ? 'Изменить карт' : 'Новый карт'}</Text>

          <Text style={styles.label}>Серийный номер:</Text>
          <TextInput style={styles.input} value={form.serial_number} onChangeText={t => setForm({...form, serial_number: t})} />

          <Text style={styles.label}>Тип карта:</Text>
          <Picker selectedValue={form.kart_type_id} onValueChange={(v) => setForm({ ...form, kart_type_id: v })} style={styles.picker}>
            {kartTypes.map(t => <Picker.Item key={t.id} label={t.name} value={t.id} />)}
          </Picker>

          <Text style={styles.label}>Цена (руб.):</Text>
          <TextInput style={styles.input} keyboardType="numeric" value={form.price} onChangeText={t => setForm({...form, price: t})} />

          <Text style={styles.label}>Статус:</Text>
          <Picker selectedValue={form.is_active} onValueChange={(v) => setForm({ ...form, is_active: v })} style={styles.picker}>
            <Picker.Item label="Активен" value="true" />
            <Picker.Item label="В ремонте" value="false" />
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