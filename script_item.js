// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

let tableData;

const getItems = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/`, options)
    .then((response) => response.json())
    .then((data) => {
      tableData = data;
      console.log(tableData);
    })
    .catch((error) => console.error(error));
};

const sortItemsInTable = (itemsData) => {
  //const table_body = document.getElementById("main-table-body");
  //table_body.innerHTML = "";
  itemsData.sort((a,b) => (a.created_date > b.created_date) ? 1 : ((b.created_date > a.created_date) ? -1 : 0))
  itemsData.map((item) => {
    table_body.innerHTML += `
        <tr id="${item.item_id}">
            <td>${item.item}</td>
            <td>${item.name}</td>
            <td>${item.price}</td>
            <td><button class="delete-row" onclick="deleteItem('${item.item_id}')">ลบ</button></td>
        </tr>
        `;
  });
};


// need to add save button to every assignment's row

const updateChecked = async (assignment_id) => {
  console.log("updateChecked got called");
  const submitted = (document.getElementById(`checkbox_${assignment_id}`).checked == true) ? "SUBMITTED" : "NOT_DONE";

  const itemToAdd = {
    assignment_id: String(assignment_id),
    submitted: submitted,
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
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};

const addNote = async (assignment_id) => {
  console.log("addNote got called");
  const note = document.getElementById(`note_${assignment_id}`).value;

  const itemToAdd = {
    assignment_id: String(assignment_id),
    note: note,
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
    .then((response) => response.json())
    .then((response) => console.log(response))
    .catch((error) => console.error(error));
};

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
};

const redrawDOM = () => {
  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
  /*document.getElementById("item-to-add").value = "";
  document.getElementById("name-to-add").value = "0";
  document.getElementById("price-to-add").value = "";*/
};

document.addEventListener("DOMContentLoaded", async function (event) {
  await getItemsFromDB();
});