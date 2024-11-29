const backArrow = document.querySelector('.back-arrow');
const sidebar = document.getElementById('sidebar');
// const mainContent = document.getElementById('main-content');

backArrow.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
    // mainContent.classList.toggle('full-width');
});