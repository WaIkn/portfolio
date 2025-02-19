const togglebutton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');


function toggleSidebar() {
    sidebar.classList.toggle('close');
    togglebutton.classList.toggle('rotate');
}

