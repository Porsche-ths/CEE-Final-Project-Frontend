// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
//const backendIPAddress = "127.0.0.1:3000";

let itemsData;

// TODO #2.3: Send Get items ("GET") request to backend server and store the response in itemsData variable
const getItemsFromDB = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/`, options)
    .then((response) => response.json())
    .then((data) => {
      itemsData = data;
    })
    .catch((error) => console.error(error));
  /*console.log(
    "This function should fetch 'get items' route from backend server."
  );*/
};

// TODO #2.4: Show items in table (Sort itemsData variable based on created_date in ascending order)
const showItemsInTable = (itemsData) => {
  const table_body = document.getElementById("main-table-body");
  table_body.innerHTML = "";
  // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
  itemsData.sort((a,b) => (a.created_date > b.created_date) ? 1 : ((b.created_date > a.created_date) ? -1 : 0))
  // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  itemsData.map((item) => {
    // ----------------- FILL IN YOUR CODE UNDER THIS AREA ONLY ----------------- //
    table_body.innerHTML += `
        <tr id="${item.item_id}">
            <td>${item.item}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button class="delete-row" onclick="deleteItem('${item.item_id}')">ลบ</button></td>
        </tr>
        `;
    // ----------------- FILL IN YOUR CODE ABOVE THIS AREA ONLY ----------------- //
  });
};

// TODO #2.5: Send Add an item ("POST") request to backend server and update items in the table
const addItem = async () => {
  const item = document.getElementById("item-to-add").value;
  const name = document.getElementById("name-to-add").value;
  const price = document.getElementById("price-to-add").value;

  const itemToAdd = {
    item: item,
    name: name,
    price: price
  }

  const options = {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(itemToAdd)
  }

  await fetch(`http://${backendIPAddress}/items/`, options)
    .then((response) => {
      document.getElementById("item-to-add").value = "";
      document.getElementById("name-to-add").value = 0;
      document.getElementById("price-to-add").value = "";
    })
    .catch((error) => console.error(error));
    
    await getItemsFromDB();
    showItemsInTable(itemsData);
  /*console.log(
    "This function should fetch 'add item' route from backend server and update items in the table."
  );*/
};

// TODO 2.6: Send Delete an item ("DELETE") request to backend server and update items in the table
const deleteItem = async (item_id) => {
  const options = {
    method: "DELETE",
    credentials: "include",
  }

  await fetch(`http://${backendIPAddress}/items/${item_id}`, options)
    .then((response) => {
    })
    .catch((error) => console.error(error));

    await getItemsFromDB();
    showItemsInTable(itemsData);
  /*console.log(
    "This function should fetch 'delete item' route in backend server and update items in the table."
  );*/
};

const redrawDOM = () => {
  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
  document.getElementById("item-to-add").value = "";
  document.getElementById("name-to-add").value = "0";
  document.getElementById("price-to-add").value = "";
};

document.getElementById("group-no").innerHTML = getGroupNumber();

document.addEventListener("DOMContentLoaded", async function (event) {
  console.log("Showing group members.");
  await showGroupMembers();
  console.log("Showing items from database.");
  await getItemsFromDB();
  showItemsInTable(itemsData);
});