import React from "react";

export default function ExchangeRate(props) {
  const { currencyDetails, exchangeRate } = props;

  function findCurrencyName(i) {
    var currencyName = Object.values(currencyDetails).filter(
      (details) => details.code === i
    );
    return currencyName[0].name;
  }
  function renderTableData() {
    return Object.keys(exchangeRate).map((key, i) => (
      <tr key={i}>
        <th>{key}</th>
        <th>{findCurrencyName(key)}</th>
        <th>{exchangeRate[key]}</th>
      </tr>
    ));
  }

  return (
    <>
      <p className="header exchangehead">US Dollar (USD) Exchange Rates</p>
      <div className="exchange-rate">
        <table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Currency Name</th>
              <th>Exchange Rate = 1 USD</th>
            </tr>
          </thead>
          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    </>
  );
}
