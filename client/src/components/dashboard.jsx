import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'name', headerName: 'Dashboard Name', width: 300 },
  { field: 'createDate', headerName: 'Create Date', width: 400 },
];

// const rows = [
//   {
//     id: 1, name: 'CPU', createDate: '2023/12/14',
//   },
//   {
//     id: 2, name: 'Stylish Nginx', createDate: '2023/12/15',
//   },
// ];

function CreateTable() {
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
  const [inputValue, setInputValue] = React.useState('');

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleInputChange = async (event) => {
    try {
      setInputValue(event.target.value);
    } catch (error) {
      console.error('Error from dashboard:', error.message);
    }
  };

  const saveJsonFile = async() => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_HOST}/api/1.0/save-json`, {
        body: JSON.stringify({ inputValue }),
      });

      if (response.status === 200) {
        toast.success('Dashboard saved successfully!', {
          position: 'top-center',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    } catch (error) {
      toast.error('Save failed. Please try again.', {
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
      <Button onClick={handleOpen}>Create a New Table</Button>
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
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Please Enter Your Dashboard Name
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <TextField
            id='dashboardName'
            onChange={handleInputChange}
            sx={{
              width: 300,
              height: 50,
              input: { textAlign: 'center', padding: 1, fontSize: 20 },
            }}
            />
          </Typography>
          <Typography>
              <Button
              variant='contained'
              onClick={saveJsonFile}
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

function DashboardTable() {
  const fetchDashboardAPI = `${import.meta.env.VITE_HOST}/api/1.0/read-json`;
  const [rows, setRows] = React.useState([]);

  const fetchRows = async() => {
    await axios.get(fetchDashboardAPI)
      .then((response) => {
        const { data } = response;
        setRows(data);
      })
      .catch((error) => console.error('Error from fetch dashboard', error.message));
  };

  React.useEffect(() => {
    fetchRows();
  }, [rows]);

  return (
    <div>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
        <button id='deleteBtn'>Delete Dashboard</button>
      </Box>
    </div>

  );
}

export default function Dashboard() {
  return (
    <div>
      <CreateTable />
      <DashboardTable />
    </div>
  );
}
