/* eslint-disable react/prop-types */
import * as React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import LaunchIcon from '@mui/icons-material/Launch';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';

function CreateTable({ setRows }) {
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
        setRows(response.data);
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
      console.error(error);
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
      <Button onClick={handleOpen} startIcon={<AddIcon />} id='create-dashboard-btn'>Create a New Table</Button>
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

function DashboardTable({ setRows, rows }) {
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
  const fetchDashboardAPI = `${import.meta.env.VITE_HOST}/api/1.0/read-json`;
  const [deleteWindowOpen, setDeleteWindowOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState(null);

  const handleDeleteOpen = (id) => {
    setDeleteWindowOpen(true);
    setDeleteId(id);
  };
  const handleDeleteClose = () => setDeleteWindowOpen(false);

  const fetchRows = async() => {
    await axios.get(fetchDashboardAPI)
      .then((response) => {
        const { objects } = response.data;
        if (objects) {
          setRows(objects);
        }

      })
      .catch((error) => console.error('Error from fetch dashboard', error.message));
  };

  React.useEffect(() => {
    fetchRows();
  }, [rows]);

  const handleLaunchClick = (id) => {
    const targetUrl = `/dashboard/detail/${id}`;
    window.location.href = targetUrl;
  };

  const handleDeleteClick = async(id) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_HOST}/api/1.0/dashboard/${id}`);
      const graphResponse = await axios.delete(`${import.meta.env.VITE_HOST}/api/1.0/dashboard/${id}/graph/all`);
      const { data } = response;

      if (response.status === 200 && graphResponse.status === 200) {
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

        setRows(data);
        handleDeleteClose();
      }
    } catch (error) {
      toast.error(`Delete error: ${error}`, {
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
  };

  const columns = [
    {
      field: 'id', headerName: 'ID', width: 100, align: 'center', headerAlign: 'center',
    },
    { field: 'name', headerName: 'Dashboard Name', width: 400 },
    { field: 'createDate', headerName: 'Create Date', width: 400 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<LaunchIcon />}
            label="launch"
            className="textPrimary"
            onClick={() => handleLaunchClick(params.id)}
            color="inherit"
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={() => handleDeleteOpen(params.id)}
            color="inherit"
          />
        </>
      ),
    },
  ];

  return (
    <div>
      <DataGrid
        className='dashboard-table'
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
        disableRowSelectionOnClick
    />
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
      open={deleteWindowOpen}
      onClose={handleDeleteClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h5" component="h2">
          Do you want to delete this dashboard?
        </Typography>
        <Typography>
            <Button
            variant='contained'
            onClick={() => handleDeleteClick(deleteId)}
            sx={{
              marginTop: 2,
              borderRadius: 0,
              boxShadow: 'none',
              width: 120,
              fontSize: 12,
              fontWeight: 600,
              backgroundColor: 'rgba(255, 99, 132, 1)',
            }}
          >
            YES, DELETE
          </Button>
          <Button
            variant='contained'
            onClick={handleDeleteClose}
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
            NO
          </Button>
        </Typography>
      </Box>
    </Modal>
    </div>

  );
}

export default function Dashboard() {
  const [rows, setRows] = React.useState([]);
  return (
    <div>
      <CreateTable setRows={setRows} />
      <DashboardTable setRows={setRows} rows={rows} />
    </div>
  );
}
