function openModal(idName) {
  document.getElementById(`${idName}`).style.display = 'block';
  if (idName === 'log-in-popup') document.getElementById(`student-id`).focus();
}

function closeModal(idName) { document.getElementById(`${idName}`).style.display = 'none'; }

function login() {
  closeModal('log-in-popup');
  openModal('loading-modal');
  login_mcv();
}

function logout() {
  closeModal(`log-out-modal`);
  openModal(`log-in-popup`);
  logout_mcv();
}

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------


// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIP = "52.4.37.139:3000";

// --------------------------------------------- Variables --------------------------------------------------

let jsonCache = new Array;
let stu_id = null;
let tableData;

// --------------------------------------------------------------------------------------------------------

const login_mcv = () => {
  window.location.href = `http://${backendIP}/courseville/login`;
};

const logout_mcv = async () => {
  window.location.href = `http://${backendIP}/courseville/logout`;
};

// --------------------------------------------------------------------------------------------------------

// get user's info and added it to "user-data" (loaded upon login)
const getUserInfo = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(
    `http://${backendIP}/courseville/get_user_info`,
    options
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      stu_id = data.data.student.id; 
      console.log(stu_id);
      document.getElementById("user-data").innerHTML = `
        ${data.data.student.id} ${data.data.student.firstname_th} ${data.data.student.lastname_th} <br> ${data.data.student.firstname_en} ${data.data.student.lastname_en}
      `;
      document.getElementById("loading-token-modal").innerHTML = `<div class="modal-container">
        <h1>You are good to go!</h1>
        <p>Press Enter to get in</p>
        <div class="confirm-section">
            <button class="btn" onclick="closeModal('loading-token-modal')">Enter</button>
        </div>
      </div>`;
    })
    .catch((error) => console.error(error));
};

/*setTimeout(function checkAccess() {
  if (stu_id != null) {
    document.getElementById('log-in-popup').style.display = 'none';
    console.log("access granted")
  } else {
    console.log("access denied");
    document.getElementById("loading-modal").style.display = 'none';
    document.getElementById("log-in-popup").style.display = 'block';
  }
}, 3000)*/

setTimeout(() => {
  document.getElementById("loading-token-modal").style.display = 'none';
  if (stu_id == null) {
    console.log("access denied");
    document.getElementById("log-in-popup").style.display = 'block';
  } else {
    console.log("access granted")
    document.getElementById("loading-assignment-modal").style.display = 'block';
    fetchCoursesFromMCV();
  }
}, 30000);

// --------------------------------- Fetching into Cache --------------------------------------

// called when user logged into a new session
const fetchCoursesFromMCV = async () => {
  console.log("Fetching from MCV")
  jsonCache = [];

  const options = {
      method: "GET",
      credentials: "include",
  }

  await fetch(`http://${backendIP}/courseville/get_courses`, options)
      .then((response) => response.json())
      .then((data) => data.data.student)
      .then((courses) => {
          courses.map(course => {
            const fetched_cv_cid = {
              cv_cid: course.cv_cid,
              title: course.title,
              course_no: course.course_no,
              year: course.year,
              semester: course.semester,
              course_icon: course.course_icon,
              assignments: getAssignmentsFromSubject(course.cv_cid)
            }
          jsonCache.push(fetched_cv_cid);
          })
      })
      .catch((error) => console.error(error));
      console.log(jsonCache)
  document.getElementById("loading-assignment-modal").style.display = 'none';
  getItems();
}

const getItems = async () => {
  const options = {
    method: "GET",
    credentials: "include",
  };
  await fetch(`http://${backendIPAddress}/items/`, options)
    .then((response) => response.json())
    .then((data) => {
      tableData = data;
      console.log(Array.isArray(tableData));
      tableData = tableData.filter(item => item.student_id == stu_id);
      console.log(Array.isArray(tableData));
      console.log(tableData);
    })
    .catch((error) => console.error(error));
};

// --------------------------------------------------------------------------------------------------------

const getAssignmentsFromSubject = async (cv_cid) => {
  let allAssignments = new Array;
  const options = {
    method: "GET",
    credentials: "include",
  }

  await fetch(`http://${backendIP}/courseville//get_course_assignments/${cv_cid}`, options)
  .then((response) => response.json())
  .then((data) => data.data)
  .then((assignments) => {
      assignments.map(item => {
        allAssignments.push(item);
      })
  })
  .catch((error) => console.error(error));
  return allAssignments;
}

// --------------------------------------- Select Courses from Semester ----------------------------------------------

let allIdInSemester;
let selectedId;
let assignmentValue = new Map();
let assignmentKey = new Array();

// get number of semesters & subjects in each semester + show the button according to provided semesters in "semester-modal" (loaded upon login)
function getSubjectsFromSemester(year, semester) {
    allIdInSemester = [];
    assignmentValue = new Map();
    assignmentKey = [];
    allIdInSemester = jsonCache.filter(id => id.year == String(year) && id.semester == String(semester));
    console.log(allIdInSemester)
    document.getElementById("subject-modal-info").innerHTML = "";
    for (let id of allIdInSemester) {
        document.getElementById("subject-modal-info").innerHTML += `
              <label><input type="checkbox" id="checkbox_${id.course_no}"><span class="subject-check"><i></i></span></label><span class="option subject" id=${id.course_no}>${id.title}</span><br>
              `
    }
    if (allIdInSemester.length == 0) {toggleError(`error-modal`); closeModal(`subject-modal`);}
}

function selectSubjectFromSemester(year, semester) {
  //if (getCourses(year, semester).isEmpty()) //toggle error modal
  closeModal(`semester-modal`);
  openModal(`subject-modal`);
  getSubjectsFromSemester(year, semester);
}

function confirmSubjects() {
  closeModal(`subject-modal`)
}

// --------------------------------------------------------------------------------------------------------

function createTable() {
  selectedId = [];
  for (let id of allIdInSemester) {
    let isChecked = document.getElementById(`checkbox_${id.course_no}`).checked;
    if (isChecked) {selectedId.push(id)}
  }
  showInTable();
}

function showInTable() {
  for (let each of selectedId) {
    console.log(each.title)
    let promise = each.assignments;
    console.log(promise)
    promise.then(
      function(value) {console.log(value); cacheAssignments(value, each.title);},
      function(error) {cacheAssignments(error, each.title);}
    )
  }
}

function cacheAssignments(x, title) {
  for (each of x) {
      assignmentValue.set(each, title);
      assignmentKey.push(each);
  }
  console.log("key")
  console.log(assignmentKey)
  console.log("pair")
  console.log(assignmentValue)
  sortedArr = assignmentKey;
  show(assignmentKey);
}

// --------------------------------------------------------------------------------------------------------
// *********************************************** Sort ***************************************************

let sortedArr = new Array;

// --------------------------------------------------------------------------------------------------------

function sortByDueDate() {
  console.log(assignmentKey);
  sortedArr = assignmentKey.sort((lhs, rhs) => (lhs.duetime < rhs.duetime) ? 1 : (lhs.duetime > rhs.duetime) ? -1 : 0);
  show(sortedArr);
  console.log(sortedArr);
  closeModal('sort-by-modal');
}

// --------------------------------------------------------------------------------------------------------

function sortByDone() {
  console.log(assignmentKey);
  let doneData = new Array;
  doneData = tableData.filter(d => d.submitted == "SUBMITTED");
  console.log(doneData);
  sortedArr = assignmentKey.sort((lhs, rhs) => 
  (doneData.find(d => d.assignment_id == lhs.itemid) != undefined && doneData.find(d => d.assignment_id == rhs.itemid) == undefined) ? 1 : 
  (doneData.find(d => d.assignment_id == lhs.itemid) == undefined && doneData.find(d => d.assignment_id == rhs.itemid) != undefined) ? -1 : 
  0);
  show(sortedArr);
  console.log(sortedArr);
  closeModal('sort-by-modal');
}

// --------------------------------------------------------------------------------------------------------

function sortBySubject() {
  console.log(assignmentKey);
  sortedArr = assignmentKey.sort((lhs, rhs) => (assignmentValue.get(lhs) < assignmentValue.get(rhs)) ? 1 : (assignmentValue.get(lhs) > assignmentValue.get(rhs)) ? -1 : 0);
  show(sortedArr);
  console.log(sortedArr);
  closeModal('sort-by-modal');
}

// --------------------------------------------------------------------------------------------------------

function sortByAssignment() {
  console.log(assignmentKey);
  sortedArr = assignmentKey.sort((lhs, rhs) => (lhs.title < rhs.title) ? 1 : (lhs.title > rhs.title) ? -1 : 0);
  show(sortedArr);
  console.log(sortedArr);
  closeModal('sort-by-modal');
}

// --------------------------------------------------------------------------------------------------------

function toggleSort() {
  sortedArr = sortedArr.reverse();
  console.log("reversing");
  show(sortedArr);
}

// --------------------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------------------

function show(arr) {
  document.getElementById("assignments-table").innerHTML = "";
  document.getElementById("assignments-table").innerHTML += `<tr class="table-head">
    <th class="check-col">Done</th>
    <th class="assignment-col">Assignment</th>
    <th class="subject-col">Subject</th>
    <th class="date-col">Due Date</th>
    <th class="time-col">Due Time</th>
    <th>Note</th>
    <th class="save-col">Save</th>
    </tr>
    `;
  for (let each of assignmentKey) {
    // ----- time -----
    let epoch = each.duetime;
    let currentDate = new Date(epoch*1000); 
    let localeDateStr = currentDate.toLocaleDateString("en-us", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric"
    })
    let localeTimeStr = currentDate.toLocaleTimeString("en-us", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
    })
    // ----- time -----
    // ------ id ------
    let current_id = each.itemid;
    document.getElementById("assignments-table").innerHTML += `
                  <tr>
                      <td class="check-col"><label><input type="checkbox" id="checkbox_${current_id}" onclick="updateChecked(${stu_id}, ${current_id})"><span><i></i></span></label></td>
                      <td class="assignment-col">${each.title}</td>
                      <td class="subject-col">${assignmentValue.get(each)}</td>
                      <td class="date-col">${localeDateStr}</td>
                      <td class="time-col">${localeTimeStr}</td>
                      <td><textarea id="note_${current_id}"></textarea></td>
                      <td class="save-col">
                          <button type="submit" class="confirm-button" id="save-changes" onclick="addNote(${stu_id}, ${current_id})">Save</button>
                          <button type="submit" class="confirm-button" id="cancel-changes">Cancel</button>
                      </td>
                  </tr>
                  `;
    //console.log("checking");
    //console.log(tableData.find(data => data.assignment == String(current_id)))
    let currentData = new Array;
    currentData = tableData.find(d => d.assignment_id == String(current_id));
    if (currentData != undefined) {
        if (currentData.submitted == "SUBMITTED") {document.getElementById(`checkbox_${current_id}`).setAttribute("checked", true);}
        if (currentData.note != undefined) {document.getElementById(`note_${current_id}`).innerHTML = currentData.note;}
    }
    // ------ id ------
  }
  if (arr.length == 0) {toggleError(`error-no-as-modal`);}
}

function toggleError(errorT) {
  console.log("toggleError was called")
  openModal(`${errorT}`);
}

document.addEventListener("DOMContentLoaded", async function (event) {
  console.log("Trying to load items");
  await getItems();
});
document.addEventListener("click", async function (event) {
  console.log("Trying to load items");
  await getItems();
});

/*let checkbox = document.querySelector("input[type=checkbox]");

checkbox.addEventListener('change', function() {
  console.log("checked!")
});*/