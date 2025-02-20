import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/attendance';

export const getAttendance = createAsyncThunk('attendance/getAttendance', async (query, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
    params: query,
  };
  const response = await axios.get(API_URL, config);
  return response.data;
});

export const markAttendance = createAsyncThunk('attendance/markAttendance', async (attendanceData, { getState }) => {
  const { auth: { userInfo } } = getState();
  const config = {
    headers: {
      Authorization: `Bearer ${userInfo.token}`,
    },
  };
  const response = await axios.post(API_URL, attendanceData, config);
  return response.data;
});

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    attendanceList: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceList = action.payload;
      })
      .addCase(getAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(markAttendance.fulfilled, (state, action) => {
        state.attendanceList.push(action.payload);
      });
  },
});

export default attendanceSlice.reducer; 