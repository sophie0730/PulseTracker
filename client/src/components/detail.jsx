import * as React from 'react';
import { useParams } from 'react-router-dom';
import GridLayout from "react-grid-layout";
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

// import {
//   DataGrid,
//   GridActionsCellItem,
// } from '@mui/x-data-grid';
import {
  Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
// import TextField from '@mui/material/TextField';

function DetailTop() {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState('');
  const [selectedType, setSelectedType] = React.useState('');
  const { id } = useParams();

  const fetchItemsAPI = `${import.meta.env.VITE_HOST}/api/1.0/fetchItems`;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {
    const fetchItems = async() => {
      try {
        const response = await axios.get(fetchItemsAPI);
        const itemArr = [];
        if (response.data) {
          response.data.forEach((element) => {
            itemArr.push(element.item);
          });
        }
        setItems(itemArr);
      } catch (error) {
        console.error('Error fetching graph items', error);
      }
    };

    fetchItems();
  }, []);

  const backToPrevPage = () => {
    const targetUrl = '/dashboard';
    window.location.href = targetUrl;
  };

  const handleItemChange = (event) => {
    setSelectedItem(event.target.value);
  };

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const saveGraphFile = async() => {
    try {
      const saveAPI = `${import.meta.env.VITE_HOST}/api/1.0/dashboard/${id}`;
      const response = await axios.post(saveAPI, {
        body: JSON.stringify({ item: selectedItem, type: selectedType }),
      });

      if (response.status === 200) {
        toast.success('Graph saved successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        setSelectedItem('');
        setSelectedType('');
      }
    } catch (error) {
      console.error(error);
      toast.error(`Save failed, error: ${error}`, {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } finally {
      handleClose();
    }

  };

  return (
    <div>
      <div className='detail-btn'>
        <div className='detail-back-btn'>
          <Button onClick={backToPrevPage} startIcon={<ArrowBackIosIcon />}>BACK TO DASHBAORD LIST</Button>
        </div>
        <div className='detail-add-btn'>
          <Button onClick={handleOpen} startIcon={<AddIcon />}>ADD GRAPH</Button>
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h5" component="h2">
            Add Graph
          </Typography>
          <FormControl fullWidth>
            <h3>Metrices</h3>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedItem}
              label="Item"
              onChange={handleItemChange}
            >
            {items.map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <h3>Graph Type</h3>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={selectedType}
              label="Item"
              onChange={handleTypeChange}
            >
              <MenuItem key='1' value='line'>
              Line Chart
              </MenuItem>
              <MenuItem key='2' value='bar-group'>
              Bar Chart, x-axis=group
              </MenuItem>
              <MenuItem key='3' value='bar-time'>
              Bar Chart, x-axis=time
              </MenuItem>
            </Select>
          </FormControl>
          <Typography>
              <Button
              variant='contained'
              onClick={saveGraphFile}
              sx={{
                marginTop: 2,
                borderRadius: 0,
                boxShadow: 'none',
                width: 50,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              ADD
            </Button>
            <Button
              variant='contained'
              onClick={handleClose}
              sx={{
                marginTop: 2,
                marginLeft: 2,
                borderRadius: 0,
                boxShadow: 'none',
                width: 50,
                fontSize: 12,
                fontWeight: 600,
                backgroundcolor: 'red',
              }}
            >
              CANCEL
            </Button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

function DetailTitle() {
  const { id } = useParams();
  const [title, setTitle] = React.useState('');
  const [selectedTime, setSeletedTime] = React.useState('30m');

  const fetchDashboardTitle = async() => {
    try {
      const fetchAPI = `${import.meta.env.VITE_HOST}/api/1.0/dashboard/${id}`;
      const response = await axios.get(fetchAPI);
      const { data } = response;
      if (data) {
        setTitle(data[0].name);
      }
    } catch (error) {
      console.error(`Error from fetch detail: ${error}`);
    }
  };

  const handleSelectTime = (event) => {
    setSeletedTime(event.target.value);
  };

  React.useEffect(() => {
    fetchDashboardTitle();
  }, [id]);

  return (
    <div className='detail-top'>
      <div className='detail-title'>
        <h2>{title}</h2>
      </div>
      <div>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-standard-label">Time Range</InputLabel>
          <Select
            labelId="demo-simple-select-standard-label"
            id="demo-simple-select-standard"
            value={selectedTime}
            label="Time Range"
            onChange={handleSelectTime}
          >
            <MenuItem value='30m'>30 minutes</MenuItem>
            <MenuItem value='1h'>1 hour</MenuItem>
            <MenuItem value='2h'>2 hours</MenuItem>
            <MenuItem value='3h'>3 hours</MenuItem>
            <MenuItem value='6h'>6 hours</MenuItem>
            <MenuItem value='8h'>8 hours</MenuItem>
            <MenuItem value='12h'>12 hours</MenuItem>
            <MenuItem value='24h'>24 hours</MenuItem>
          </Select>
        </FormControl>
      </div>
  </div>
  );
}

function DetailGraph() {

}

export default function DashboardDetail() {
  return (
    <div>
      <DetailTop />
      <DetailTitle />
      <DetailGraph />
    </div>
  );
}