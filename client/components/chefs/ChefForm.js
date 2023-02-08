import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addSingleChefBooking,
  fetchSingleChefBooking,
  selectSingleChefBookings,
} from "../slices/singleChefBookingsSlice";
import { fetchSingleChef, selectSingleChef } from "../slices/singleChefSlice";
import { Home } from "../index";
import MapBoxAccessToken from "../../env";
import axios from "axios";
import "./chefForm.css";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
  OutlinedInput,
  InputAdornment,
  Typography,
  Alert,
  Snackbar,
} from "@mui/material";
import { Box } from "@mui/system";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

const states = [
  "AL - Alabama", "AK - Alaska", "AZ - Arizona", "AR - Arkansas", "AS - American Samoa", "CA - California", "CO - Colorado", "CT - Connecticut", "DE - Delaware", "DC - District of Columbia",
  "FL - Florida", "GA - Georgia", "GU - Guam", "HI - Hawaii", "ID - Idaho", "IL - Illinois", "IN - Indiana", "IA - Iowa",
  "KS - Kansas", "KY - Kentucky", "LA - Louisiana", "ME - Maine", "MD - Maryland", "MA - Massachusetts", "MI - Michigan", "MN - Minnesota",
  "MS - Mississippi", "MO - Missouri", "MT - Montana", "NE - Nebraska", "NV - Nevada", "NH - New Hampshire", "NJ - New Jersey",
  "NM - New Mexico", "NY - New York", "NC - North Carolina", "ND - North Dakota", "CM - Northern Mariana Islands", "OH - Ohio",
  "OK - Oklahoma", "OR - Oregon", "PA - Pennsylvania", "PR - Puerto Rico", "RI - Rhode Island", "SC - South Carolina", "SD - South Dakota",
  "TN - Tennessee", "TX - Texas", "TT - Trust Territories of the Pacific Islands", "UT - Utah", "VT - Vermont", "VA - Virginia", "VI - Virgin Islands",
  "WA - Washington", "WV - West Virginia", "WI - Wisconsin", "WY - Wyoming",
];

const ChefForm = () => {
  const userId = useSelector((state) => state.auth.me.id)
  const [title, setTitle] = useState("");
  const [menu, setMenu] = useState("");
  const [cuisineId, setCuisineId] = useState("");
  const [suggestedDonation, setSuggestedDonation] = useState(null);
  const [startValue, setStartValue] = useState(dayjs());
  const [endValue, setEndValue] = useState(dayjs());
  const [max, setMax] = useState(null);
  const [openSeats, setOpenSeats] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const { chefId } = useParams();
  const dispatch = useDispatch();

  const {currentChef, isLoading, error} = useSelector(selectSingleChef);
  // set state to open for snack bar
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.me);
  console.log("USER", user)
  console.log("USER.id", user.id) 
  

  useEffect(() => {
    dispatch(fetchSingleChef(userId));
    dispatch(fetchSingleChefBooking(userId));
  }, []);

  const handleSnackClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  // handle submit for chef form
  const handleSubmit = async () => {
    console.log("handleSubmit clicked! from ChefForm.js");

    setOpen(true)
    
      setTimeout(() => {
        setOpen(false);
        navigate(`/users/chefprofile/${user.id}`)
      }, 1500);

    try {
      // grabbing full address from the useState
      const address = `${address1}, ${city}, ${state}, ${zip}`;

      // axios call to the MapBox GeoCode API to get the lat/long values
      const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${address}.json?access_token=${MapBoxAccessToken}`
      );
      const location = data.features[0].center;

      // conditional to CHECK AND SEE if there is a location prior to dispatching the POST to the store and backend
      if (location) {
        dispatch(
          // will need to check on this CHEF ID and auth because as of right now anyone who<TextFields an id into the url that is a chef
          // is allowed to<TextField data for THAT chef that isn't them. Will need to make it so it is only the userId who is logged in at the moment!
          addSingleChefBooking({
            id: userId,
            title,
            cuisineId,
            menu,
            suggestedDonation,
            startValue: startValue.format("MM/DD/YYYY h:mmA"),
            endValue: endValue.format("MM/DD/YYYY h:mmA"),
            max,
            openSeats,
            address1,
            address2,
            city,
            state,
            zip,
            latitude: location[1], // the location variable sends back an array of [long, lat]
            longitude: location[0], // the location variable sends back an array of [long, lat]
          })
        );
      }
    } catch (err) {
      console.log(err);
    }
  };


  if (isLoading || !currentChef){
    return <div> LOADING ...</div>
  }

  return (
    <>
      {userId !== parseInt(chefId) ? (
        <Home />
      ) : (
        <>
          <div className="chefEvent-container">
            <Typography variant="h5">Create Your Supper Club Event!</Typography>
            <Box
              component="form"
              className="chefEvent-form"
            >
              <div className="chefForm-title-of-event">
                <TextField
                  label="Title of Event"
                  onChange={(e) => setTitle(e.target.value)}
                  type="text"
                  placeholder="Title of event"
                  fullWidth
                />
              </div>
              <div className="cuisineCategory-and-donation">
                <div className="chefEvent-cuisineCategory">
                  <FormControl>
                    <InputLabel id="demo-simple-select-label">Cuisine</InputLabel>
                    <Select
                      onChange={(e) => setCuisineId(Number(e.target.value))}
                      value={cuisineId}
                      label="cuisine"
                    >
                      <MenuItem value="1">Chinese</MenuItem>
                      <MenuItem value="2">Japanese</MenuItem>
                      <MenuItem value="3">Indian</MenuItem>
                      <MenuItem value="4">French</MenuItem>
                      <MenuItem value="5">Thai</MenuItem>
                      <MenuItem value="6">Nigerian</MenuItem>
                      <MenuItem value="7">Brazilian</MenuItem>
                      <MenuItem value="8">Mexican</MenuItem>
                      <MenuItem value="9">Italian</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div className="chefForm-suggested-donation">
                  <FormControl>
                    <InputLabel htmlFor="outlined-adornment-amount">
                      Donation
                    </InputLabel>
                    <OutlinedInput
                      id="outlined-adornment-amount"
                      startAdornment={
                        <InputAdornment position="start">$</InputAdornment>
                      }
                      label="Donation"
                      placeholder="Per member donation"
                      onChange={(e) => setSuggestedDonation(e.target.value)}
                    />
                  </FormControl>
                </div>
              </div>

              
              <Box
                className="chefForm-menu-and-description"
                component="div"
                sx={{
                  "& .MuiTextField-root": { width: "100%" },
                }}
                noValidate
                autoComplete="off"
              >
                <TextField
                  id="outlined-multiline-static"
                  label="Menu"
                  multiline
                  rows={20}
                  placeholder="Type your menu here"
                  onChange={(e) => setMenu(e.target.value)}
                />
              </Box>

              <div className="chefForm-event-date-and-time">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="Start"
                    value={startValue}
                    onChange={(newValue) => {
                      setStartValue(newValue);
                    }}
                    className="chefForm-event-start-date"
                    disablePast
                  />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DateTimePicker
                    renderInput={(props) => <TextField {...props} />}
                    label="End"
                    value={endValue}
                    onChange={(newValue) => {
                      setEndValue(newValue);
                    }}
                    className="chefForm-event-end-date"
                    disablePast
                  />
                </LocalizationProvider>
              </div>

              <div className="chefForm-max-open-seats-container">
                <div className="chefForm-open-seats">
                  <TextField
                    label="Open Seats"
                    onChange={(e) => setOpenSeats(e.target.value)}
                    type="number"
                    placeholder="Open seats"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </div>
                <div className="chefForm-max-seats">
                  <TextField
                    label="Max Seats"
                    onChange={(e) => setMax(e.target.value)}
                    type="number"
                    placeholder="Max seats"
                    InputProps={{
                      inputProps: { min: 0 },
                    }}
                  />
                </div>
              </div>
              <div className="chefForm-event-address-information">
                <div className="chefForm-address1">
                  <TextField
                    onChange={(e) => setAddress1(e.target.value)}
                    type="text"
                    placeholder="Address 1"
                    label="Address 1"
                    fullWidth
                  />
                </div>
                <div className="chefForm-address2">
                  <TextField
                    onChange={(e) => setAddress2(e.target.value)}
                    type="text"
                    placeholder="Address 2 (optional)"
                    label="Address 2"
                    fullWidth
                  />
                </div>
                <div className="chefForm-city">
                  <TextField
                    onChange={(e) => setCity(e.target.value)}
                    type="text"
                    placeholder="City"
                    label="City"
                    fullWidth
                  />
                </div>
                <div className="chefForm-state-and-zipcode">
                  <div className="chefForm-state">
                    <FormControl fullWidth>
                      <InputLabel>State</InputLabel>
                      <Select
                        onChange={(e) => setState(e.target.value)}
                        label="State"
                        value={state}
                      >
                        {states.map((state) => (
                          <MenuItem key={state} value={state}>
                            {state}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div className="chefForm-zipcode">
                    <TextField
                      onChange={(e) => setZip(e.target.value)}
                      type="text"
                      placeholder="Zip Code"
                      label="Zip Code"
                    />
                  </div>
                </div>
              </div>
            </Box>

            <Button
              className="chefForm-button"
              onClick={() => handleSubmit()}
              variant="contained"
              sx={{
                "&:hover": { backgroundColor: "#EB5757", color: "whitesmoke" },
                backgroundColor: "#EB5757",
                color: "whitesmoke",
              }}
            >
              Create Event
            </Button>

            <Snackbar open={open} autoHideDuration={10000} onClose={handleSnackClose}>
              <Alert onClose={handleSnackClose} severity="success" sx={{ width: '100%' }}>
                You successfully created an event! 
              </Alert>
            </Snackbar>
          </div>
        </>
      )}
    </>
  );
};

export default ChefForm;
