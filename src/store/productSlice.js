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
      state.items[index] = product; // Update the product at the specific index
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'; // Update status to loading while fetching data
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'; // Update status to succeeded once data is fetched
        state.items = action.payload; // Store the fetched data in the items array
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'; // Set status to failed in case of an error
        state.error = action.error.message; // Store error message
      });
  },
});

export const { updateProduct } = productSlice.actions;

export default productSlice.reducer;
