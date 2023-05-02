// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = /*"127.0.0.1:3000"*/"52.4.37.139:3000";

/*let tableData;

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
};*/

// need to add save button to every assignment's row

const updateChecked = async (stu_id, assignment_id) => {
  console.log("updateChecked got called");
  const submitted = (document.getElementById(`checkbox_${assignment_id}`).checked == true) ? "SUBMITTED" : "NOT_DONE";

  const itemToAdd = {
    student_id: String(stu_id),
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

const addNote = async (stu_id, assignment_id) => {
  console.log("addNote got called");
  const submitted = (document.getElementById(`checkbox_${assignment_id}`).checked == true) ? "SUBMITTED" : "NOT_DONE";
  const note = document.getElementById(`note_${assignment_id}`).value;

  const itemToAdd = {
    student_id: String(stu_id),
    submitted: submitted,
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
};

const redrawDOM = () => {
  window.document.dispatchEvent(
    new Event("DOMContentLoaded", {
      bubbles: true,
      cancelable: true,
    })
  );
};
