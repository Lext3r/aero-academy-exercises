const filterTriggers = document.querySelectorAll('.filter__toogle');
const classes = {
 isActive: 'is-active'
 }

const toggleClass = (el, className) => {
  if (el.classList.contains(className)) {
     el.classList.remove(classes.isActive);
   } else {
     el.classList.add(className);
   }
 }

 filterTriggers.forEach(element => element.addEventListener('click', (e) => {
    toggleClass(e.currentTarget.parentNode, classes.isActive);
  }));