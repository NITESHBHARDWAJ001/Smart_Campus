import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

const MaterialContext = createContext();

// Initial state
const initialState = {
  materials: [],
  material: null,
  loading: false,
  error: null
};

// Reducer function
const materialReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
        error: null
      };
    case 'GET_MATERIALS':
      return {
        ...state,
        materials: action.payload,
        loading: false,
        error: null
      };
    case 'GET_MATERIAL':
      return {
        ...state,
        material: action.payload,
        loading: false,
        error: null
      };
    case 'CREATE_MATERIAL':
      return {
        ...state,
        materials: [action.payload, ...state.materials],
        loading: false,
        error: null
      };
    case 'UPDATE_MATERIAL':
      return {
        ...state,
        materials: state.materials.map(material =>
          material._id === action.payload._id ? action.payload : material
        ),
        material: action.payload,
        loading: false,
        error: null
      };
    case 'DELETE_MATERIAL':
      return {
        ...state,
        materials: state.materials.filter(material => material._id !== action.payload),
        loading: false,
        error: null
      };
    case 'MATERIAL_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provider component
export const MaterialProvider = ({ children }) => {
  const [state, dispatch] = useReducer(materialReducer, initialState);
  const { token } = useContext(AuthContext);
  
  // Set axios default headers
  const setMaterialToken = () => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Get materials by course
  const getMaterialsByCourse = async (courseId) => {
    setMaterialToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`http://localhost:5000/api/materials/course/${courseId}`);
      dispatch({
        type: 'GET_MATERIALS',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching materials:', error.response?.data?.message || error.message);
      dispatch({
        type: 'MATERIAL_ERROR',
        payload: error.response?.data?.message || 'Error fetching materials'
      });
      return [];
    }
  };

  // Get single material
  const getMaterial = async (materialId) => {
    setMaterialToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`http://localhost:5000/api/materials/${materialId}`);
      dispatch({
        type: 'GET_MATERIAL',
        payload: res.data.data
      });
      return res.data.data;
    } catch (error) {
      console.error('Error fetching material:', error.response?.data?.message || error.message);
      dispatch({
        type: 'MATERIAL_ERROR',
        payload: error.response?.data?.message || 'Error fetching material'
      });
      return null;
    }
  };

  // Create material
  const createMaterial = async (materialData) => {
    setMaterialToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('http://localhost:5000/api/materials', materialData);
      dispatch({
        type: 'CREATE_MATERIAL',
        payload: res.data.data
      });
      return { success: true, material: res.data.data };
    } catch (error) {
      console.error('Error creating material:', error.response?.data?.message || error.message);
      dispatch({
        type: 'MATERIAL_ERROR',
        payload: error.response?.data?.message || 'Error creating material'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error creating material' 
      };
    }
  };

  // Update material
  const updateMaterial = async (materialId, materialData) => {
    setMaterialToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`http://localhost:5000/api/materials/${materialId}`, materialData);
      dispatch({
        type: 'UPDATE_MATERIAL',
        payload: res.data.data
      });
      return { success: true, material: res.data.data };
    } catch (error) {
      console.error('Error updating material:', error.response?.data?.message || error.message);
      dispatch({
        type: 'MATERIAL_ERROR',
        payload: error.response?.data?.message || 'Error updating material'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error updating material' 
      };
    }
  };

  // Delete material
  const deleteMaterial = async (materialId) => {
    setMaterialToken();
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`http://localhost:5000/api/materials/${materialId}`);
      dispatch({
        type: 'DELETE_MATERIAL',
        payload: materialId
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting material:', error.response?.data?.message || error.message);
      dispatch({
        type: 'MATERIAL_ERROR',
        payload: error.response?.data?.message || 'Error deleting material'
      });
      return { 
        success: false, 
        message: error.response?.data?.message || 'Error deleting material' 
      };
    }
  };

  // Clear errors
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return (
    <MaterialContext.Provider
      value={{
        materials: state.materials,
        material: state.material,
        loading: state.loading,
        error: state.error,
        getMaterialsByCourse,
        getMaterial,
        createMaterial,
        updateMaterial,
        deleteMaterial,
        clearError
      }}
    >
      {children}
    </MaterialContext.Provider>
  );
};

export default MaterialContext;