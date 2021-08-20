import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import logo from '../../asset/icons/coffee_mug.svg';
import './Coffeeprice.css';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { environment } from '../../config';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';


const ColorButton = withStyles(() => ({
  root: {
    color: '#FFFFFF',
    backgroundColor: '#A5A6F6',
    fontSize: 20,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: '#7879F1',
    },
    '&:active': {
      backgroundColor: '#5D5FEF',
    },
  },
}))(Button);

const DialogTitleS = withStyles(() => ({
  root: {
    paddingBottom: 10
  },
}))(DialogTitle);
const DialogContents = withStyles(() => ({
  root: {
    paddingBottom: 10
  },
}))(DialogContent);




const Coffeeprice = (user : any) => {


  const [{ error, errorTxt }, Seterror] = useState({
    error: false,
    errorTxt: ""
  })


  const useStyles = makeStyles(() => ({
    dialogPaper: {
      width: '425px',
      height:  !error ? '243px' :'280px',
      borderRadius: 7
    },
    input: {
      height: '30px',
      borderRadius: 50
    }
  }));
  const classes = useStyles();


  const [{ name, price }, setPriceData] = useState({
    name: "",
    price: ""
  })

  const [open, setOpen] = React.useState(false);
  const [Price, setPrice] = useState<any>([])

  const getPrice = () => {
    axios.get(environment.API_SERVER + '/')
      .then((response) => {
        const CoffePriceraw = response.data
        setPrice(CoffePriceraw)
      })
  }

  function addPrice() {
    if (name === '' || price === '') {
      Seterror({
        error: true,
        errorTxt: "Please enter coffee name/price correctly"
      })
      return
    }

    const exists = Price.find((p: any) => p.name === name);
    if (exists) {
      Seterror({
        error: true,
        errorTxt: "Please enter coffee name that's not duplicate."
      })
      return
    }

    let data = {
      "name": name,
      "price": parseInt(price)
    }
    axios.post(environment.API_SERVER + '/add/', data)
      .then((response) => {
        getPrice()
        setOpen(false);
      }, (error) => {
        setOpen(false);
      })
  }

  const handleClickOpen = () => {

    setPriceData({ name: "", price: "" })
    Seterror({
      error: false,
      errorTxt: ""
    })
    setOpen(true);
  };

  const handleClose = () => {
    Seterror({
      error: false,
      errorTxt: ""
    })
    setOpen(false);
  };

  useEffect(() => getPrice(), []);

  function addPriceNum(e: any) {
    const re = /^[0-9\b]+$/;
    if (e.target.value === '' || re.test(e.target.value)) {
      setPriceData({ name, price: e.target.value })
    }
  }

  function Lister() {
    const ListPrice = Price.map((Prices: any, index: number) =>
      <div className="coffeebox" key={index}>
        <Grid container spacing={3}>
          <Grid className="coffeeName" item xs={8}>
            <div>
              {index + 1}. {Prices.name}
            </div>
          </Grid>
          <Grid className="coffeePrice" item xs={4} >
            <div>${Prices.price}</div>
          </Grid>
        </Grid>
      </div>
    )
    return (
      <div>
        {ListPrice}
      </div>
    )
  }

  return (
    <div className="home-text">
      <p className="coffeeHeader"> <img src={logo} className="coffeeImg" alt="cup" width="58px" height="41px" />Coffee Price</p>
      <Lister />
      <br />
      <ColorButton className="Add-Coffee-btn" color="primary" variant="contained" onClick={handleClickOpen} disabled={user.user.username === ""}>
        Add New Coffee
      </ColorButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" classes={{ paper: classes.dialogPaper }}>
        <DialogTitleS id="form-dialog-title" ><span className="Coffeetitle">Add New Coffee</span> </DialogTitleS>
        <DialogContents>
          <div hidden={!error}> <ErrorIcon className="alerticon" style={{ fontSize: 16 }} /> <span className="alert">{errorTxt}</span> </div>
          <TextField
            autoFocus
            margin="dense"
            id="CoffeeName"
            label="Coffee Name"
            type="text"
            name="CoffeeName"
            fullWidth
            InputLabelProps={{ style: { top: -2, fontSize: 14 } }}
            InputProps={{ className: classes.input }}
            variant="outlined"
            value={name} onChange={(event) => setPriceData({
              name: event.target.value,
              price
            })} />
          <TextField
            autoFocus
            margin="dense"
            id="Price"
            label="Price($)"
            type="text"
            name="Price"
            InputLabelProps={{ style: { top: -2, fontSize: 14 } }}
            variant="outlined"
            fullWidth
            InputProps={{ className: classes.input }}
            value={price} onChange={addPriceNum} />
        </DialogContents>
        <DialogActions>
          <Button style={{ textTransform: 'none' }}  onClick={handleClose} color="primary" name="CancelBtn">
            <span className="submitBtn">Cancel</span>
          </Button>
          <Button  style={{ textTransform: 'none' }}  onClick={addPrice} color="primary" name="submitBtn">
            <span className="submitBtn">Submit</span>
          </Button>
        </DialogActions>
      </Dialog>

    </div>
  );
}
export default Coffeeprice;

