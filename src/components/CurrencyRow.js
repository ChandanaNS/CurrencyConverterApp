import React from "react";

export default function CurrencyRow(props) {
  const {
    currencyOptions,
    selectedCurrency,
    onChangeCurrency,
    onChangeAmount,
    amount,
    currencyDetails,
  } = props;
  function onKeyPressEvent(event) {
    return event.charCode >= 48 && event.charCode <= 57;
  }
  return (
    <div className="currency-sec">
      <label>Currency</label>
      <select
        className="input-fields"
        value={selectedCurrency}
        onChange={onChangeCurrency}
      >
        {currencyOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <label>Enter amount</label>
      <div className="text-container">
        <input
          type="number"
          className="input input-fields"
          value={amount}
          onChange={onChangeAmount}
          onKeyPress={onKeyPressEvent}
          min="1"
        />
        {currencyDetails[0] !== undefined ? (
          <span id="clearBtn1" className="clearBtn">
            {currencyDetails[0].symbol_native}
          </span>
        ) : (
          " "
        )}
      </div>
    </div>
  );
}
