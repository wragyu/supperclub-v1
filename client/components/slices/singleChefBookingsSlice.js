import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSingleChefBooking = createAsyncThunk(
  "fetch/singleChefBookings",
  async (id) => {
    try {
      const { data } = await axios.get(`/api/users/chefs/${id}/bookings`);
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

// add booking from form
export const addSingleChefBooking = createAsyncThunk(
  "add/singleChefBooking",
  async ({
    id,
    title,
    menu,
    imageUrl,
    cuisineId,
    suggestedDonation,
    startValue,
    endValue,
    max,
    openSeats,
    address1,
    address2,
    city,
    state,
    zip,
    latitude,
    longitude
  }) => {
    try {

      const { data } = await axios.post(`/api/users/chefs/${id}/bookings`, {
        title,
        menu,
        imageUrl,
        cuisineId,
        suggestedDonation,
        startDateTime: startValue,
        endDateTime: endValue,
        maxSeats: max,
        openSeats,
        address1,
        address2,
        city,
        state,
        zipCode: zip,
        latitude,
        longitude,
        chefId: id
      });
      return data;
    } catch (err) {
      console.log(err);
    }
  }
);

const singleChefBookingsSlice = createSlice({
  name: "singleChefBookings",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {

    builder.addCase(fetchSingleChefBooking.fulfilled, (state, action) => {
      return action.payload;
    });

    builder.addCase(addSingleChefBooking.fulfilled, (state, action) => {
      state.push(action.payload);
    });

  },
});

export const selectSingleChefBookings = (state) => {
  return state.singleChefBookings;
};

export default singleChefBookingsSlice.reducer;
