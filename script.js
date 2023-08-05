const ip = document.getElementById("ip");
const detpagebody = document.getElementById("detpagebody");
const info = document.getElementById("info");
const cards = document.getElementById("cards");

async function fetchip() {
  try {
    const resp = await fetch("https://api.ipify.org?format=json");
    const data = await resp.json();
    console.log("----------->" + data.postal);
    ip.innerHTML = `${data.ip}`;
    sessionStorage.setItem("ip", data.ip);
    sessionStorage.setItem("pin", data.postal);
    console.log(sessionStorage.getItem("pin"));
    fetchemore();
  } catch (e) {
    console.log(e);
  }
}

async function fetchemore() {
  const iploc = sessionStorage.getItem("ip");

  try {
    const response = await fetch(
      `https://ipinfo.io/${iploc}/json?token=d597e38b0d3dce`
    );
    const responseData = await response.json();
    console.log("--------->" + responseData.postal);
    sessionStorage.setItem("pin", JSON.stringify(responseData.postal));
    sessionStorage.setItem("data", JSON.stringify(responseData));
    detpagebody.innerHTML = `
      <div class="details">
        <h1>IP Address: ${responseData.ip}</h1>
        <div class="more">
            <h1>Lat: ${responseData.loc.split(",")[0]}</h1>
            <h1>Long: ${responseData.loc.split(",")[1]}</h1>
            <h1>City: ${responseData.city}</h1>
            <h1>Region: ${responseData.region}</h1>
            <h1>Organisation: ${responseData.org}</h1>
            <h1>Hostname: ${responseData.hostname}</h1>
        </div>
      </div>`;
  } catch (error) {
    console.log(error);
  }
}

// function showMap() {
//   var latlng = new google.maps.LatLng(-34.397, 150.644);
//   var myOptions = {
//     zoom: 8,
//     center: latlng,
//     mapTypeId: google.maps.MapTypeId.ROADMAP,
//     disableDefaultUI: true,
//   };
//   map = new google.maps.Map(document.getElementById("map"), myOptions);
// }

async function showcard() {
  const pin = JSON.parse(sessionStorage.getItem("pin"));
  const data = JSON.parse(sessionStorage.getItem("data"));
  const timezone = data.timezone;
  let time = new Date().toLocaleString("en-US", {
    timeZone: data.timezone,
  });
  console.log("------------>" + pin, time);
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
    const data = await response.json(); // Change this line to parse JSON data
    console.log(data);
    const postoffice = data[0].PostOffice;
    info.innerHTML = `
    <h1>More info about you</h1>
        <div class="etc">
        <h2>Time Zone:${timezone}</h2>
        <h2>Date and Time:${time}</h2>
        <h2> Pincode:${pin}</h2>
        <h2>Message :${data[0].Message}</h2>
        </div>`;
    cards.innerHTML = postoffice.map((val) => {
      return `
    <div class="card">
      <h1>Name: ${val.Name}</h1>
      <h1>Branch Type: ${val.BranchType}</h1>
      <h1>Delivery Status: ${val.DeliveryStatus}</h1>
      <h1>District: ${val.District}</h1>
      <h1>Division: ${val.Division}</h1>
    </div>
  `;
    });
  } catch (e) {
    console.log(e);
  }
}

fetchip();
fetchemore();
showcard();
