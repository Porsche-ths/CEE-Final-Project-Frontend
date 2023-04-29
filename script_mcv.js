
// Change this IP address to EC2 instance public IP address when you are going to deploy this web application
const backendIPAddress = "127.0.0.1:3000";

// --------------------------------------------------------------------------------------------------------

let jsonCache = new Array;

// --------------------------------------------------------------------------------------------------------

const login_mcv = () => {
  window.location.href = `http://${backendIPAddress}/courseville/login`;
};

const logout_mcv = async () => {
  window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

// --------------------------------------------------------------------------------------------------------

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
      document.getElementById("user-data").innerHTML = `
        ${data.data.student.id} ${data.data.student.firstname_th} ${data.data.student.lastname_th} <br> ${data.data.student.firstname_en} ${data.data.student.lastname_en}
      `;
    })
    .catch((error) => console.error(error));
};

// --------------------------------- Fetching into Cache --------------------------------------

// called when user logged into a new session
const fetchCoursesFromMCV = async () => {
  console.log("Fetching from MCV")
  jsonCache = [];

  const options = {
      method: "GET",
      credentials: "include",
  }

  await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
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
}

// --------------------------------------------------------------------------------------------------------

const getAssignmentsFromSubject = async (cv_cid) => {
  let allAssignments = new Array;
  const options = {
    method: "GET",
    credentials: "include",
  }

  await fetch(`http://${backendIPAddress}/courseville//get_course_assignments/${cv_cid}`, options)
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

let allIdInSemester = new Array;

// get number of semesters & subjects in each semester + show the button according to provided semesters in "semester-modal" (loaded upon login)
function getSubjectsFromSemester(year, semester) {
    allIdInSemester = jsonCache.filter(id => id.year == String(year) && id.semester == String(semester));
    console.log(allIdInSemester)
    document.getElementById("subject-modal-info").innerHTML = "";
    for (let id of allIdInSemester) {
        document.getElementById("subject-modal-info").innerHTML += `
              <label><input type="checkbox" id="checkbox_${id.course_no}"><span class="subject-check"><i></i></span></label><span class="option subject" id=${id.course_no}>${id.title}</span><br>
              `
    }
}

// --------------------------------------------------------------------------------------------------------

let selectedId = new Array;

function createTable() {
  for (let id of allIdInSemester) {
    let isChecked = document.getElementById(`checkbox_${id.course_no}`).checked;
    if (isChecked) {selectedId.push(id)}
  }
  showInTable();
}

// --------------------------------------------------------------------------------------------------------

function showInTable() {
  for (let each of selectedId) {
    console.log(each.title)
    let promise = each.assignments;
    console.log(promise)
    promise.then(
      function(value) {show(value, each.title);},
      function(error) {show(error, each.title);}
    )
  }
}

function show(x, title) {
  for (each of x) {
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
      document.getElementById("assignments-table").innerHTML += `
                    <tr>
                        <td class="check-col"><label><input type="checkbox" id="checkbox_${each.itemid}"><span><i></i></span></label></td>
                        <td class="assignment-col">${each.title}</td>
                        <td class="subject-col">${title}</td>
                        <td class="date-col">${localeDateStr}</td>
                        <td class="time-col">${localeTimeStr}</td>
                        <td><textarea id="note_${each.itemid}"></textarea></td>
                        <td class="save-col">
                            <button type="submit" class="confirm-button" id="save-changes" onclick=addToTable(${each.itemid})>Save</button>
                            <button type="submit" class="confirm-button" id="cancel-changes">Cancel</button>
                        </td>
                    </tr>
                    `;
  }
}