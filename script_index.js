function openModal(idName) {
    document.getElementById(`${idName}`).style.display = 'block';
    if (idName === 'log-in-popup') document.getElementById(`student-id`).focus();
}

function closeModal(idName) { document.getElementById(`${idName}`).style.display = 'none'; }

function selectSubjectFromSemester(year, semester) {
    // if (getCourses(year, semester).isEmpty()) toggle error modal
    closeModal(`semester-modal`);
    openModal(`subject-modal`);
}

function confirmSubjects() {
    closeModal(`subject-modal`)
}

function sortBy(criteria) {
    closeModal(`sort-by-modal`);
}

function toggleSort() {
    openModal(`error-modal`);
}