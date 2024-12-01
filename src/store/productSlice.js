import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async Thunk for fetching products
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await axios.get('/task/products/search', {
      headers: {
        "x-api-key": '72njgfa948d9aS7gs5', 
      },
    });
    return response.data; // Return the response data
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    updateProduct: (state, action) => {
      const { index, product } = action.payload;
      state.items[index] = product; 
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'; 
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'; 
        state.items = action.payload; 
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'; 
        state.error = action.error.message; 
      });
  },
});

export const { updateProduct } = productSlice.actions;

export default productSlice.reducer;
