import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "react-bootstrap/Spinner";
import "./App.css";

function App() {
  const [temperature, setTemperature] = useState();
  const [bloodPressure, setBloodPressure] = useState();
  const [heartRate, setHeartRate] = useState();
  const [respiratoryRate, setRespRate] = useState();
  const apiUrl = "api/run-custom";

  const Submit = (e) => {
    e.preventDefault();
    axios
      .post(apiUrl, {
        temperature: parseFloat(temperature),
        bloodPressure: parseInt(bloodPressure),
        heartRate: parseFloat(heartRate),
        respiratoryRate: parseFloat(respiratoryRate),
      })
      .then((result) => {
        console.log(result.data.row1);
        const resArray = result.data.row1;
        const max = findMax(resArray);
        const index = resArray.indexOf(max);
        checkStatus(index);
      })
      .catch((err) => console.log(err));
  };

  function findMax(arr) {
    if (arr.length !== 3) {
      return "Array must contain exactly three elements.";
    }

    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
      if (arr[i] > max) {
        max = arr[i];
      }
    }

    return max;
  }

  function checkStatus(value) {
    switch (value) {
      case 0:
        alert("Critical! Go refer to a specialist.");
        break;
      case 1:
        alert("Followup. Come in for another appointment this week.");
        break;
      default:
        alert("Healthy. But do come by for a checkup!");
    }
  }

  return (
    <div className="d-flex vh-300 bg-primary justify-content-center align-items-center">
      <div className="w-50 bg-white rounded p-4">
        <form onSubmit={Submit}>
          <h2>Input test case</h2>
          <div className="mb-2">
            <label htmlFor="">Temperature</label>
            <input
              type="text"
              placeholder="Enter Temperature"
              className="form-control"
              onChange={(e) => setTemperature(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">Blood Pressure</label>
            <input
              type="text"
              placeholder="Enter Blood Pressure"
              className="form-control"
              onChange={(e) => setBloodPressure(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">Heart Rate</label>
            <input
              type="text"
              placeholder="Enter Heart Rate"
              className="form-control"
              onChange={(e) => setHeartRate(e.target.value)}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="">Respiratory Rate</label>
            <input
              type="text"
              placeholder="Enter Respiratory Rate"
              className="form-control"
              onChange={(e) => setRespRate(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success">Run</button>
        </form>
      </div>
    </div>
  );
}

export default App;
