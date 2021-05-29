const { default: axios } = require("axios");
const dayjs = require("dayjs");
const express = require("express");
var beep = require("beepbeep");

const app = express();
const port = 5000;

const district_1 = 305; // Kozhikode
const district_2 = 302; // Malappuram

let getSlots = async (req, res) => {
  try {
    let today = dayjs().format("DD-MM-YYYY");

    let config = {
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_1}&date=${today}`,
      headers: {},
    };

    let data1 = await axios(config);
    // console.log(data1.data.sessions);

    let parsedData = data1.data.sessions.filter(
      (session) =>
        session.min_age_limit == 45 && session.available_capacity != 0
    );

    return res.status(200).send({
      statusText: "Ok",
      parsedData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was a problem fetching data.");
  }
};

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

app.get("/api/v1/getSlots", getSlots);

setInterval(async () => {
  try {
    let today = dayjs().format("DD-MM-YYYY");
    let tomorrow = dayjs().add(1, "day").format("DD-MM-YYYY");

    let config = {
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_1}&date=${today}`,
      headers: {},
    };

    let data1Promise = axios({
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_1}&date=${today}`,
      headers: {},
    });

    let data2Promise = axios({
      method: "get",
      url: `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${district_1}&date=${tomorrow}`,
      headers: {},
    });
    // console.log(data1.data.sessions);

    let data1 = await data1Promise;
    let data2 = await data2Promise;

    let consolidatedData = data1.data.sessions.concat(data2.data.sessions);

    let parsedData = consolidatedData.filter(
      (session) =>
        session.min_age_limit == 18 && session.available_capacity_dose1 != 0
    );

    if (parsedData.length == 0) {
      console.log(`No slots available - ${dayjs().format("HH:mm:ss")}`);
    } else {
      console.log(`Slots available - ${dayjs().format("HH:mm:ss")}`);
      beep(3, 1000);
      console.log(parsedData);
    }
  } catch (err) {
    console.log("Error fetching data");
    // console.log(err);
  }
}, 15000);

let districts = [
  {
    district_id: 301,
    district_name: "Alappuzha",
  },
  {
    district_id: 307,
    district_name: "Ernakulam",
  },
  {
    district_id: 306,
    district_name: "Idukki",
  },
  {
    district_id: 297,
    district_name: "Kannur",
  },
  {
    district_id: 295,
    district_name: "Kasaragod",
  },
  {
    district_id: 298,
    district_name: "Kollam",
  },
  {
    district_id: 304,
    district_name: "Kottayam",
  },
  {
    district_id: 305,
    district_name: "Kozhikode",
  },
  {
    district_id: 302,
    district_name: "Malappuram",
  },
  {
    district_id: 308,
    district_name: "Palakkad",
  },
  {
    district_id: 300,
    district_name: "Pathanamthitta",
  },
  {
    district_id: 296,
    district_name: "Thiruvananthapuram",
  },
  {
    district_id: 303,
    district_name: "Thrissur",
  },
  {
    district_id: 299,
    district_name: "Wayanad",
  },
];
