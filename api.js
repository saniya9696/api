// Grabbing DOM elements
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currencies
for (let select of dropdowns) {
  for (let currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.appendChild(newOption);
  }

  // Attach event to update flag when selection changes
  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Function to fetch and convert currency
const convert = async () => {
  const amount = document.querySelector(".amount input");
  let amtVal = amount.value.trim();

  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  }

  const apiKey = "2874dfb39c9c3b64c9698f1d"; // 🔐 Replace with your actual API key
  const URL = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurr.value}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (data.result === "success") {
      const rate = data.conversion_rates[toCurr.value];
      const convertedAmount = (amtVal * rate).toFixed(2);
      msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
    } else {
      msg.innerText = "Failed to fetch exchange rate.";
    }
  } catch (err) {
    msg.innerText = "Error fetching data. Please try again later.";
    console.error(err);
  }
};

// Function to update flag image
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Handle button click
btn.addEventListener("click", (e) => {
  e.preventDefault(); // prevent form reload
  convert();
});

// Initial conversion and flag load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  convert();
});
 
// Swap currencies and flags
document.querySelector(".swap-btn").addEventListener("click", () => {
    // Swap values
    let temp = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = temp;
  
    // Update flags
    updateFlag(fromCurr);
    updateFlag(toCurr);
  
    // Reconvert
    convert();
  });
  