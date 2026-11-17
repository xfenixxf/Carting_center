import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function UserBookScreen() {
  const { token, user } = useContext(AuthContext);
  const [myRides, setMyRides] = useState([]);
  const [rides, setRides] = useState([]);
  const [teams, setTeams] = useState([]);
  const [karts, setKarts] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [form, setForm] = useState({ ride_id: '', team_id: '', kart_id: '' });

  const fetchData = async () => {
    try {
      const [myRes, ridesRes, teamsRes, kartsRes, partRes] = await Promise.all([
        axios.get(`${API_URL}/me/rides`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/rides?status=open`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/teams`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/karts`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${API_URL}/participants`, { headers: { Authorization: `Bearer ${token}` } }).catch(() => ({data: []}))
      ]);
      setMyRides(myRes.data);
      setRides(ridesRes.data);
      setTeams(teamsRes.data.filter(t => t.is_active));
      setKarts(kartsRes.data.filter(k => k.is_active));
      setParticipants(partRes.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchData(); }, []);

  const openCreate = () => {
    setForm({ ride_id: rides[0]?.id || '', team_id: teams[0]?.id || '', kart_id: '' });
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.kart_id) return Alert.alert('Ошибка', 'Выберите карт');
    try {
      await axios.post(`${API_URL}/me/participants`, {
        ride_id: parseInt(form.ride_id),
        team_id: parseInt(form.team_id),
        kart_id: parseInt(form.kart_id)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setModalVisible(false);
      Alert.alert('Успех', 'Вы записаны на заезд!');
      fetchData();
    } catch (e) {
      Alert.alert('Ошибка', e.response?.data?.detail || 'Не удалось записаться');
    }
  };

  const getAvailableKarts = () => {
    if (!form.ride_id) return [];
    const busyKartIds = participants
      .filter(p => p.ride_id === parseInt(form.ride_id))
      .map(p => p.kart_id);
    return karts.filter(k => !busyKartIds.includes(k.id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Привет, {user?.full_name}!</Text>

      <FlatList
        data={myRides}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Заезд #{item.ride_id}</Text>
            <Text>Карт K-{String(item.kart_id).padStart(3, '0')}</Text>
            <Text>Дата: {item.participant_date}</Text>
            <Text style={{color: 'green', fontWeight: 'bold'}}>Статус: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Вы пока никуда не записаны</Text>}
      />

      <View style={styles.bottomControls}>
        <TouchableOpacity style={styles.addBtn} onPress={openCreate}><Text style={styles.btnText}>+ Записаться на заезд</Text></TouchableOpacity>
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <ScrollView contentContainerStyle={styles.modalContainer}>
          <Text style={styles.title}>Запись на заезд</Text>

          <Text style={styles.label}>Выберите заезд:</Text>
          <Picker selectedValue={form.ride_id} onValueChange={(v) => setForm({ ...form, ride_id: v, kart_id: '' })} style={styles.picker}>
            {rides.map(r => <Picker.Item key={r.id} label={`Заезд #${r.id} (${r.ride_date})`} value={r.id} />)}
          </Picker>

          <Text style={styles.label}>Команда:</Text>
          <Picker selectedValue={form.team_id} onValueChange={(v) => setForm({ ...form, team_id: v })} style={styles.picker}>
            {teams.map(t => <Picker.Item key={t.id} label={t.name} value={t.id} />)}
          </Picker>

          <Text style={styles.label}>Карт:</Text>
          <Picker selectedValue={form.kart_id} onValueChange={(v) => setForm({ ...form, kart_id: v })} style={styles.picker}>
            {getAvailableKarts().length === 0
              ? <Picker.Item label="Нет свободных картов" value="" />
              : getAvailableKarts().map(k => <Picker.Item key={k.id} label={`Карт ${k.serial_number}`} value={k.id} />)
            }
          </Picker>

          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}><Text style={styles.btnText}>Записаться</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.btnText}>Отмена</Text></TouchableOpacity>
        </ScrollView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f4f6f9' },
  welcome: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, color: '#1f2933' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#2563eb' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  bottomControls: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: '#fff', padding: 10, borderTopWidth: 1, borderTopColor: '#ddd', justifyContent: 'space-between' },
  addBtn: { flex: 1, backgroundColor: '#2563eb', padding: 15, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  modalContainer: { padding: 20 },
  title: { fontSize: 22, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  label: { fontSize: 14, color: '#666', marginBottom: 5 },
  picker: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, marginBottom: 15, backgroundColor: '#fff' },
  saveBtn: { backgroundColor: '#16a34a', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  cancelBtn: { backgroundColor: '#dc2626', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 }
});