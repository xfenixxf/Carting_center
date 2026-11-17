import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { API_URL } from '../config';

export default function ClientsScreen() {
  const { token } = useContext(AuthContext);
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState('');

  const fetchClients = async () => {
    try {
      const res = await axios.get(`${API_URL}/clients`, { headers: { Authorization: `Bearer ${token}` } });
      setClients(res.data);
    } catch (e) { console.log(e); }
  };

  useEffect(() => { fetchClients(); }, []);

  const filteredClients = clients.filter(c =>
    c.full_name.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Поиск по ФИО или Email..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.full_name}</Text>
            <Text>Email: {item.email || 'Не указан'}</Text>
            <Text style={{color: '#666'}}>Account ID: {item.account_id ?? '—'}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Клиенты не найдены</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f4f6f9' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, backgroundColor: '#fff', marginBottom: 15 },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontWeight: 'bold', fontSize: 16, marginBottom: 5, color: '#2563eb' },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 }
});