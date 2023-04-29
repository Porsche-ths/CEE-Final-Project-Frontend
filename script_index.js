function openModal(idName) {
    document.getElementById(`${idName}`).style.display = 'block';
    if (idName === 'log-in-popup') document.getElementById(`student-id`).focus();
}

function closeModal(idName) { document.getElementById(`${idName}`).style.display = 'none'; }

function login() {
    closeModal(`log-out-modal`);
    openModal(`log-in-popup`);
    login_mcv();
}

function logout() {
    closeModal(`log-out-modal`);
    logout_mcv();
    openModal(`log-in-popup`);
}

function selectSubjectFromSemester(year, semester) {
    //if (getCourses(year, semester).isEmpty()) //toggle error modal
    closeModal(`semester-modal`);
    openModal(`subject-modal`);
    getSubjectsFromSemester(year, semester);
}

function confirmSubjects() {
    closeModal(`subject-modal`)
    //loopCreateTable();
}

function sortBy(criteria) {
    closeModal(`sort-by-modal`);
}

function toggleSort() {
    //for loop sort data in reverse order
    openModal(`error-modal`);
}