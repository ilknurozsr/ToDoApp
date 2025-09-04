import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Alert, Text, FlatList, TouchableOpacity, Keyboard,} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as TaskService from '../services/taskService';

const AddTaskScreen = () => {
  const [taskList, setTaskList] = useState([]);
  const [title, setTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);
  const loadTasks = async () => {
        try {
      const tasks = await TaskService.getTasks();
      setTaskList(tasks.sort((a, b) => a.id - b.id));
    } catch (error) {
      Alert.alert('Hata', 'Görevler yüklenemedi.');
    }
  };

  const handleAddOrUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Uyarı', 'Lütfen bir görev girin.');
      return;
    }
    try {
      if (isEditing) {
      await TaskService.updateTask(editingTaskId, title);
      } else {
      await TaskService.addTask(title);
      }
      resetForm();
      await loadTasks();
    } catch (error) {
      Alert.alert('Hata', 'İşlem gerçekleştirilemedi.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await TaskService.deleteTask(id);
      await loadTasks(); 
    } catch (error) {
      Alert.alert('Hata', 'Silme işlemi başarısız.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await TaskService.toggleCompleteTask(task);
      await loadTasks();
    } catch (error) {
      Alert.alert('Hata', 'Durum güncellenemedi.');
    }
  };

  const startEditing = (task) => {
    setIsEditing(true);
    setTitle(task.title);
    setEditingTaskId(task.id);
  };

  const resetForm = () => {
    setTitle('');
    setIsEditing(false);
    setEditingTaskId(null);
    Keyboard.dismiss();
  };

  return (
  <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Yeni bir görev ekle..."
          style={styles.input}
          value={title}
          onChangeText={setTitle}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddOrUpdate}>
          <MaterialIcons name={isEditing ? 'check' : 'add'} size={24} color="black" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={taskList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskCard}>
            <TouchableOpacity
              style={styles.taskTextContainer}
              onPress={() => handleToggleComplete(item)}
            >
              <MaterialIcons
                name={item.completed ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
                color={item.completed ? '#93b544ff' : '#aaa'}
              />
              <Text style={[styles.taskText, item.completed && styles.completedTaskText]}>
                {item.title}
              </Text>
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <TouchableOpacity onPress={() => startEditing(item)}>
                <MaterialIcons name="edit" size={22} color="#7a8086ff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <MaterialIcons name="delete-outline" size={24} color="#d62d3eff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>Harika! Hiç görevin kalmadı.</Text>}
      />
    </View>
);
};

export default AddTaskScreen;

const styles = StyleSheet.create({
 container: {
    flex: 1,
    backgroundColor: '#f9f5b0ff',
    padding: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    borderColor: '#ced4da',
    borderWidth: 1,
    fontSize: 16,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#93b544ff',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  taskCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    elevation: 1,
  },
  taskTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskText: {
    fontSize: 16,
    color: '#212529',
  },
  completedTaskText: {
    textDecorationLine: 'line-through',
    color: '#5f6970ff',
  },
  iconContainer: {
    flexDirection: 'row',
    gap: 15,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#717d86ff',
  },
});