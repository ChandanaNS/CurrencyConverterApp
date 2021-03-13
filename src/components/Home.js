import React, { useEffect, useState } from "react";
import CurrencyRow from "./CurrencyRow";
import ExchangeRate from "./ExchangeRate";
import "../../src/App.css";
import { BrowserRouter, Link, Route, Switch, Redirect } from "react-router-dom";
const BASE_URL = "https://api.exchangeratesapi.io/latest";

function Home() {
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [exchangeRate, setExchangeRate] = useState();
  const [amount, setAmount] = useState(0);
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true);
  const [currencyDetailsData, setCurrencyDetailsData] = useState([]);
  const [usdExchangeRates, setUSDExchangeRates] = useState([]);
  const [fromCurrencyDetails, setFromCurrencyDetails] = useState([]);
  const [toCurrencyDetails, setToCurrencyDetails] = useState([]);
  const [activeLink, setActiveLink] = useState(1);
  let toAmount, fromAmount;
  if (amountInFromCurrency) {
    fromAmount = amount;
    toAmount = amount * exchangeRate;
  } else {
    toAmount = amount;
    fromAmount = amount / exchangeRate;
  }
  // Json file fetch that shows the details of each currency like name symbol etc.
  const getData = () => {
    fetch("CurrencyDetails.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (myJson) {
        setCurrencyDetailsData(myJson);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // Latest exchange rates api call
  useEffect(() => {
    fetch(BASE_URL)
      .then((res) => res.json())
      .then((data) => {
        setCurrencyOptions([data.base, ...Object.keys(data.rates)]);
        setFromCurrency("USD");
        setToCurrency("EUR");
        setExchangeRate(data.rates["USD"]);
      });
  }, []);

  // api call to convert from one currency to another
  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      fetch(`${BASE_URL}?base=${fromCurrency}&symbols=${toCurrency}`)
        .then((res) => res.json())
        .then((data) => setExchangeRate(data.rates[toCurrency]))
        .then(() => {
          const fromCurrencyDetails = Object.values(currencyDetailsData).filter(
            (details) => details.code === fromCurrency
          );

          const toCurrencyDetails = Object.values(currencyDetailsData).filter(
            (details) => details.code === toCurrency
          );
          setFromCurrencyDetails(fromCurrencyDetails);
          setToCurrencyDetails(toCurrencyDetails);
        });
    }
  }, [currencyDetailsData, fromCurrency, toCurrency]);

  // Exchange rate based on USD to display in a exchange rates table
  useEffect(() => {
    fetch(`${BASE_URL}?base=USD`)
      .then((res) => res.json())
      .then((data) => setUSDExchangeRates(data.rates));
  }, []);

  // Onchange functions
  function handleFromAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(true);
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value);
    setAmountInFromCurrency(false);
  }

  // Onclick function
  function handleClick(selectedIndex) {
    selectedIndex === 1 ? setActiveLink(1) : setActiveLink(2);
  }
  return (
    <BrowserRouter>
      <ul className="app-header">
        <li className={activeLink === 1 ? "active" : ""}>
          <Link to="/converter" onClick={() => handleClick(1)}>
            Currency Converter
          </Link>
        </li>
        <li className={activeLink === 2 ? "active" : ""}>
          <Link to="/exchangeRate" onClick={() => handleClick(2)}>
            Current Exchange Rates
          </Link>
        </li>
      </ul>

      <div className="main">
        <Switch>
          <Route exact path="/">
            <Redirect to="/converter" />
          </Route>
          <Route path="/converter">
            <p className="header">Currency converter</p>
            <p>Please enter the amount you want to convert in any field.</p>

            <CurrencyRow
              currencyOptions={currencyOptions}
              selectedCurrency={fromCurrency}
              onChangeCurrency={(e) => setFromCurrency(e.target.value)}
              onChangeAmount={handleFromAmountChange}
              amount={fromAmount}
              currencyDetails={fromCurrencyDetails}
            />

            <CurrencyRow
              currencyOptions={currencyOptions}
              selectedCurrency={toCurrency}
              onChangeCurrency={(e) => setToCurrency(e.target.value)}
              onChangeAmount={handleToAmountChange}
              amount={toAmount}
              currencyDetails={toCurrencyDetails}
            />
            {amount > 0 ? (
              <p className="currency-p">
                {" "}
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
            ) : (
              ""
            )}
            {amount > 0 ? (
              <p className="currency-p">
                {1} {toCurrency} = {1 / exchangeRate} {fromCurrency}
              </p>
            ) : (
              ""
            )}
          </Route>
          <Route path="/exchangeRate">
            <ExchangeRate
              currencyDetails={currencyDetailsData}
              exchangeRate={usdExchangeRates}
            />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default Home;
