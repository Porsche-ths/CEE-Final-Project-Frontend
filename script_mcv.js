
function openModal(idName) {
  document.getElementById(`${idName}`).style.display = 'block';
  if (idName === 'log-in-popup') document.getElementById(`student-id`).focus();
}

function closeModal(idName) { document.getElementById(`${idName}`).style.display = 'none'; }


function selectSubjectFromSemester(year, semester) {
  //if (getCourses(year, semester).isEmpty()) /*toggle error modal*/
  closeModal(`semester-modal`);
  getSubjectsFromSemester(year, semester);
  openModal(`subject-modal`);
}

function confirmSubjects() {
  closeModal(`subject-modal`)
  loopCreateTable();
}

function sortBy(criteria) {
  closeModal(`sort-by-modal`);
}

function toggleSort() {
  openModal(`error-modal`);
}
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

let subjects = new Array;
let ids = new Array;

// get number of semesters & subjects in each semester + show the button according to provided semesters in "semester-modal" (loaded upon login)
const getSubjectsFromSemester = async (year, semester) => {
    subjects = [];
    ids = [];
    document.getElementById("subject-modal-info").innerHTML = "";
    const options = {
        method: "GET",
        credentials: "include",
    }
    await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
        .then((response) => response.json())
        .then((data) => data.data.student)
        .then((courses) => {
            for (let i = 0; i < courses.length; i++) {
                if (courses[i].year == year && courses[i].semester == semester) {
                    console.log(courses[i].title);
                    subjects.push(courses[i].title);
                    ids.push(courses[i].cv_cid);
                    document.getElementById("subject-modal-info").innerHTML += `
                        <label><input type="checkbox" id="${courses[i].cv_cid}"><span class="subject-check"><i></i></span></label><span class="option subject" id=${courses[i].cv_cid}>${courses[i].title}</span><br>
                    `
                }
            }
        })
        .catch((error) => console.error(error));
}

const loopCreateTable = async () => {
  console.log("I'm in");
  document.getElementById("assignments-table").innerHTML = `
      <tr class="table-head">
          <th class="check-col">Done</th>
          <th class="assignment-col">Assignment</th>
          <th class="subject-col">Subject</th>
          <th class="date-col">Due Date</th>
          <th class="time-col">Due Time</th>
          <th>Note</th>
      </tr>`;
    for (let i = 0; i < subjects.length; i++) {
        let isChecked = document.getElementById(`${ids[i]}`).checked;
        if (isChecked) {
          console.log("round " + i);
          createAssignmentsTable(subjects[i], ids[i]);
        }
    }
}

// show all assignments in semester 2022/2 (default) on load
const createAssignmentsTable = async (subject, cv_cid) => {
  const options = {
    method: "GET",
    credentials: "include",
  };

    await fetch(`http://${backendIPAddress}/courseville/get_course_assignments/${cv_cid}`, options)
      .then((response) => response.json())
      .then((data) => data.data)
      .then((assignments) => {
          assignments.map((items) => {
              let epoch = items.duetime;
              let currentDate = new Date(epoch*1000); 
              document.getElementById("assignments-table").innerHTML += `
                    <tr>
                        <td class="check-col"><label><input type="checkbox"><span><i></i></span></label></td>
                        <td class="assignment-col">${items.title}</td>
                        <td class="subject-col">${subject}</td>
                        <td class="date-col">${currentDate.toLocaleDateString()}</td>
                        <td class="time-col">${currentDate.toLocaleTimeString()}</td>
                        <td><textarea></textarea></td>
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
