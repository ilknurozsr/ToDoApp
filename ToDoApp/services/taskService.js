import api from '../api';

const API_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const addTask = async (title) => {
  try {
    const newTask = {
      title: title,
      completed: false,
    };
    const response = await api.post('/tasks', newTask);
    return response.data;
  } catch (error) {
    console.error('Görev eklenirken hata:', error);
    throw error;
  }
};

export const getTasks = async () => {
  try {
    const response = await api.get('/tasks');
    return response.data;
  } catch (error) {
    console.error('Görevleri alma hatası:', error);
    return [];
  }
};

export const deleteTask = async (id) => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    console.error('Görev silinirken hata:', error);
    throw error;
  }
};

export const updateTask = async (id, title) => {
  try {
    const response = await api.patch(`/tasks/${id}`, { title });
    return response.data;
  } catch (error) {
    console.error("Update error:", error);
    throw error;
  }
};

export const toggleCompleteTask = async (task) => {
  try {
    const response = await api.put(`/tasks/${task.id}`, {
      ...task,
      completed: !task.completed,
    });
    return response.data;
  } catch (error) {
    console.error('Görev durumu güncellenirken hata:', error);
    throw error;
  }
};
