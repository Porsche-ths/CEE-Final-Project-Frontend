function login() {
    document.getElementById(`log-in`).style.display = 'block';
}

function cancelLogin() {
    document.getElementById(`log-in`).style.display = 'none';
}

function selectSubjectFromSemester(year, semester) {
    // if (getCourses(year, semester).isEmpty()) toggle error modal
    cancelSemester();
}

function cancelSemester() {
    document.getElementById('semester-modal').style.display = 'none';
}

function sortBy(criteria) {
    document.getElementById(`sort-by-modal`).style.display = 'none';
}