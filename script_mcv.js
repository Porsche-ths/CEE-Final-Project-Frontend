// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

const authorizeApplication = () => {
  window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

// get user's info and added it to "user-data" (loaded upon login)
const getUserInfo = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIPAddress}/courseville/get_user_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      console.log(data.user);
      document.getElementById("user-data").innerHTML = `
        ${data.data.student.id} ${data.data.student.firstname_th} ${data.data.student.lastname_th} <br> ${data.data.student.firstname_en} ${data.data.student.lastname_en}
      `;
    })
    .catch((error) => console.error(error));
};

// get number of semesters & subjects in each semester + show the button according to provided semesters in "semester-modal" (loaded upon login)
const getSubjects_n_Semesters = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    }
    await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
        .then((response) => response.json())
        .then((data) => data.data.student)
        .then((courses) => {
            let years_provided = new Set();
            for (let i = 0; i < courses.length; i++) {
                let year = courses[i].year, semester = courses[i].semester;
                years_provided.add((year, semester));
                let cid = courses[i].cv_cid, course_no = courses[i].course_no, title = courses[i].title, course_icon = courses[i].course_icon;
                // some functions to insert them to desired position -> status on hold
            }
            for (let y = 2022; y >= 2019; y--) {
                for (let s = 1; s <= 2; s++) {
                    //if (!years_provided.has((y, s))) {document.getElementById(`semester${y}-${s}`).remove();}
                }
            }
        })
        .catch((error) => console.error(error));
}

// show all assignments in semester 2022/2 (default) on load
const createDefaultTable = async () => {
  const assignmentsTable = document.getElementById("assignments-table");
  assignmentsTable.innerHTML = "";
  cons
  const cv_cid = document.getElementById("ces-cid-value").innerHTML;
  
  const options = {
    method: "GET",
    credentials: "include",
  };

  await fetch(`http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`, options)
    .then((response) => response.json())
    .then((data) => data.data)
    .then((assignments) => {
      assignments.map((item) => {
        table_body.innerHTML += `
          <tr id=${item.itemid}>
            <td>${item.itemid}</td>
            <td>${item.title}</td>
          </tr>
          `;
      })
    })
    .catch((error) => console.error(error));
  /*console.log(
    "This function should fetch 'get course assignments' route from backend server and show assignments in the table."
  );*/
};

const logout = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

document.getElementById("group-id").innerHTML = getGroupNumber();