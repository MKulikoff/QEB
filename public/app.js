const menu = document.querySelector('.userName')
const navElements = document.querySelector('.dropdown')

menu.addEventListener('click', () => {
    if (navElements.classList.contains('hidden')) {
        navElements.classList.remove('hidden')
    }
    else {
        navElements.classList.add('hidden')
    }
})