import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function RidesScreen() {
  const { token } = useContext(AuthContext);
  const [rides, setRides] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [filterDate, setFilterDate] = useState('');

  const [form, setForm] = useState({
    location_id: '',
    ride_date: '2026-10-25',
    start_time: '12:00',
    end_time: '12:10'
  });

  const fetchData = async () => {
    try {
      const [ridesRes, locsRes] = await Promise.all([
        axios.get(`${API_URL}/rides`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/locations`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({ data: [] }))
      ]);
      setRides(ridesRes.data);
      setLocations(locsRes.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ location_id: locations[0]?.id || 1, ride_date: '2026-10-25', start_time: '12:00', end_time: '12:10' });
    setIsEditing(false);
    setModalVisible(true);
  };

  const openEdit = () => {
    const ride = rides.find(r => r.id === selectedId);
    if (!ride) return Alert.alert('Ошибка', 'Выберите заезд');

    setForm({
      location_id: ride.location_id,
      ride_date: ride.ride_date,
      start_time: ride.start_time.slice(0, 5),
      end_time: ride.end_time.slice(0, 5)
    });
    setIsEditing(true);
    setModalVisible(true);
  };

  const handleSave = async () => {
    try {
      const payload = {
        location_id: parseInt(form.location_id),
        ride_date: form.ride_date,
        start_time: form.start_time + ":00",
        end_time: form.end_time + ":00",
        amount_paid: 0
      };

      if (isEditing) {
        await axios.put(`${API_URL}/rides/${selectedId}`, payload, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(`${API_URL}/rides`, payload, { headers: { Authorization: `Bearer ${token}` } });
      }

      setModalVisible(false);
      setSelectedId(null);
      fetchData();
    } catch (e) {
      if (e.response) {
        Alert.alert('Ошибка сервера', JSON.stringify(e.response.data.detail));
      } else {
        Alert.alert('Ошибка', e.message);
      }
    }
  };

  const handleDelete = () => {
    if (!selectedId) return Alert.alert('Ошибка', 'Выберите заезд');

    Alert.alert('Удаление', 'Вы уверены, что хотите удалить заезд?', [
      { text: 'Отмена', style: 'cancel' },
      { text: 'Удалить', style: 'destructive', onPress: async () => {
          try {
            await axios.delete(`${API_URL}/rides/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } });
            setSelectedId(null);
            fetchData();
          } catch (e) {
            Alert.alert('Ошибка удаления', e.response?.data?.detail || 'Не удалось удалить');
          }
      }}
    ]);
  };

  const filteredRides = filterDate
    ? rides.filter(r => r.ride_date === filterDate)
    : rides;

  return (
    <View style={styles.container}>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Фильтр по дате (ГГГГ-ММ-ДД):</Text>
        <TextInput
          style={styles.filterInput}
          placeholder="Например, 2026-10-25"
          value={filterDate}
          onChangeText={setFilterDate}
        />
        {filterDate !== '' && (
          <TouchableOpacity onPress={() => setFilterDate('')} style={styles.clearBtn}>
            <Text style={styles.clearText}>Сбросить фильтр</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredRides}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }} // Отступ снизу, чтобы кнопки не перекрывали список
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, selectedId === item.id && styles.selectedCard]}
            onPress={() => setSelectedId(item.id)}
          >
            <Text style={styles.cardTitle}>Заезд #{item.id} — {item.ride_date}</Text>
            <Text>Время: {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}</Text>
            <Text>Локация (ID): {item.location_id}</Text>
            <Text>Сумма: {item.amount_paid} ₽</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Нет заездов на эту дату</Text>}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.btnText}>+ Добавить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn} onPress={openEdit}>
          <Text style={styles.btnText}>Изменить</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.delBtn} onPress={handleDelete}>
          <Text style={styles.btnText}>Удалить</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>{isEditing ? 'Изменить заезд' : 'Новый заезд'}</Text>

          <Text style={styles.label}>Локация:</Text>
          <Picker
            selectedValue={form.location_id}
            onValueChange={(v) => setForm({ ...form, location_id: v })}
            style={styles.picker}
          >
            {locations.map(l => (
              <Picker.Item key={l.id} label={l.name} value={l.id} />
            ))}
          </Picker>

          <Text style={styles.label}>Дата (ГГГГ-ММ-ДД):</Text>
          <TextInput style={styles.input} value={form.ride_date} onChangeText={t => setForm({...form, ride_date: t})} />

          <Text style={styles.label}>Время начала (ЧЧ:ММ):</Text>
          <TextInput style={styles.input} value={form.start_time} onChangeText={t => setForm({...form, start_time: t})} />

          <Text style={styles.label}>Время конца (ЧЧ:ММ):</Text>
          <TextInput style={styles.input} value={form.end_time} onChangeText={t => setForm({...form, end_time: t})} />

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.btnText}>Сохранить</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
            <Text style={styles.btnText}>Отмена</Text>
          </TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f4f6f9' },

  filterContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  filterLabel: { fontSize: 14, color: '#666', marginBottom: 5 },
  filterInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, backgroundColor: '#fff' },
  clearBtn: { marginTop: 10, alignItems: 'center' },
  clearText: { color: '#dc2626', fontWeight: 'bold' },

  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  selectedCard: { borderColor: '#2563eb', borderWidth: 2, backgroundColor: '#eff6ff' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#2563eb' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },

  bottomControls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    justifyContent: 'space-between'
  },
  addBtn: { flex: 1, backgroundColor: '#2563eb', padding: 12, borderRadius: 8, alignItems: 'center', marginRight: 5 },
  editBtn: { flex: 1, backgroundColor: '#fbbf24', padding: 12, borderRadius: 8, alignItems: 'center', marginHorizontal: 5 },
  delBtn: { flex: 1, backgroundColor: '#dc2626', padding: 12, borderRadius: 8, alignItems: 'center', marginLeft: 5 },
  btnText: { color: '#fff', fontWeight: 'bold' },

  // Модалка
  modalContainer: { padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 5, marginBottom: 15 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelBtn: { backgroundColor: '#dc2626', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 }
});