import React, { useEffect, useState } from 'react';
import './App.css';
import Home from './components/home/Home';
import Coffeeprice from './components/coffee-price/Coffeeprice';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
} from "react-router-dom";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button, Checkbox, FormControlLabel, makeStyles, withStyles } from '@material-ui/core';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { userData, environment } from './config'
import ErrorIcon from '@material-ui/icons/Error';
import { EncryptStorage } from 'encrypt-storage';

const App: React.FC = () => {
  const encryptStorage = EncryptStorage(environment.KeySecure)


  const [open, setOpen] = useState(false);



  const [{ error, errorTxt }, Seterror] = useState({
    error: false,
    errorTxt: ""
  })

  const [UserKeep, setUserKeep] = useState({
    username: "",
    adminMode: false
  });
  const history = useHistory();
  const location = useLocation()
  useEffect(() => {
    try {

      const encryptStorageIn = EncryptStorage(environment.KeySecure)
      let data: any = encryptStorageIn.getItem('user_data')
      if (!data) {
        return
      }

      const exists = userData.find((p: any) => p.username === data.username);
      if (exists) {
        if (exists.password !== data.password) {
          return
        }
        if (data.adminMode === true && exists.adminMode === false) {
          return
        }
      } else {
        return
      }
      setOpen(false);
      setUserKeep({
        username: data.username,
        adminMode: data.adminMode
      })
    } catch (error) {
    }

  }, []);




  const [{ username, password, adminMode }, setcredential] = useState({
    username: "",
    password: "",
    adminMode: false
  })

  const useStyles = makeStyles(() => ({
    dialogPaper: {
      width: '425px',
      height: !error ? '275px' : '312px',
      borderRadius: 7
    },
    input: {
      height: '30px',
      borderRadius: 50
    }
  }));

  const DialogTitleS = withStyles(() => ({
    root: {
      paddingBottom: 10
    },
  }))(DialogTitle);



  const classes = useStyles();



  function setRoute(route: string) {
    history.push(route);
  }

  const logout = () => {
    setUserKeep({
      username: "",
      adminMode: false
    })
    localStorage.clear()
  }

  const handleClickOpen = () => {
    setcredential({
      username: "",
      password: "",
      adminMode: false
    })
    Seterror({
      error: false,
      errorTxt: ""
    })
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function Login() {
    let data = {
      username: username,
      password: password,
      adminMode: adminMode
    }
    const exists = userData.find((p: any) => p.username === data.username);
    if (exists) {
      if (exists.password !== data.password) {
        Seterror({
          error: true,
          errorTxt: "Please enter username/password correctly"
        })
        return
      }
      if (data.adminMode === true && exists.adminMode === false) {
        Seterror({
          error: true,
          errorTxt: "You do not have administrator privileges."
        })
        return
      }
    } else {
      Seterror({
        error: true,
        errorTxt: "Please enter username/password correctly"
      })
      return
    }
    Seterror({
      error: false,
      errorTxt: ""
    })
    setOpen(false);
    setUserKeep({
      username: data.username,
      adminMode: data.adminMode



    })

    encryptStorage.setItem('user_data', data)

    return
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="topnav">
        
          <span className="nav" hidden={UserKeep.username !== ""} onClick={handleClickOpen}> Login </span>
          <span className="nav" hidden={UserKeep.username === ""} onClick={logout}> Logout </span>
          <span className={location.pathname === '/Coffeeprice' ? 'nav enabled' : 'nav'} onClick={() => setRoute("/Coffeeprice")}> Coffee Price </span>
          <span className={location.pathname === '/' ? 'nav enabled' : 'nav'} onClick={() => setRoute("/")}> Home </span>
        </div>
      </header>
      <div className="App-content">
        <Switch>
          <Route path="/Coffeeprice">
            <Coffeeprice user={UserKeep} />
          </Route>
          <Route path="/">
            <Home user={UserKeep} />
          </Route>
        </Switch>
      </div>

      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogPaper }}>
        <DialogTitleS id="form-dialog-title"> <span className="logintitle">Login</span> </DialogTitleS>
        <DialogContent style={{ paddingBottom: 0 }}>
          <div hidden={!error}> <ErrorIcon className="alerticon" style={{ fontSize: 16 }} /> <span className="alert">{errorTxt}</span> </div>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Username/Email"
            type="text"
            fullWidth
            variant="outlined"
            name="username"
            InputLabelProps={{ style: { top: -2, fontSize: 14 } }}
            InputProps={{ className: classes.input }}
            value={username} onChange={(event) => setcredential({
              username: event.target.value,
              password,
              adminMode
            })}
          />
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            name="password"
            InputLabelProps={{ style: { top: -2, fontSize: 14 } }}
            InputProps={{ className: classes.input }}
            value={password} onChange={(event) => setcredential({
              username,
              password: event.target.value,
              adminMode
            })}
          />
          <FormControlLabel control={<Checkbox style={{ top: -1, fontSize: 16, color: !adminMode ? '#BFBFBF' : '#29A8F5' }} icon={<RadioButtonUncheckedIcon />} checkedIcon={<CheckCircleIcon />} name="checkedH" />} label="Login as Administrator"
            checked={adminMode} onChange={() =>
              setcredential({
                username,
                password,
                adminMode: !adminMode
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button style={{ textTransform: 'none' }} onClick={handleClose} color="primary" name="Cancelbtn">
            <span className="submitBtn">Cancel</span>
          </Button>
          <Button style={{ textTransform: 'none' }} onClick={Login} color="primary" name="Loginbtn">
            <span className="submitBtn">Login</span>
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}

export default App;
