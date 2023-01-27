const tasks = [];
let form = document.forms.formTodoList;
let inputTodo = document.getElementById("todo");
let divListTasks = document.getElementsByClassName("listTasks")[0];
let clearPanel = document.getElementById("clearPanel");
divListTasks.removeChild(clearPanel); //On le supprime du DOM au démarrage
let inputUser = document.getElementById("todo");
let idTask = 0;

/**
 * Modèle principal pour une tache.
 */
class Task {
    constructor(task_id, text, done) {
        this.task_id = task_id;
        this.text = text;
        this.done = done;
    }
}

//Ajout par validation du formulaire (bouton Add)
form.addEventListener("submit", (ev) => {
    ev.preventDefault();
    addTask();
});

//Ajout par appui sur la touche "Entrée" en etant dans le champ de saisie
inputUser.addEventListener("keypress", (ev) => {
    if (ev.key == "Enter") {
        addTask();
    }
});

/**
 * Ajoute une tache à la liste des taches.
 */
function addTask() {
    let dataInputValue = inputTodo.value.trim();
    if (dataInputValue != '' && !checkDoublon(dataInputValue)) {
        let task = new Task(idTask, dataInputValue, false);
        tasks.push(task);
        divListTasks.appendChild(createTask(task))
        divListTasks.appendChild(clearPanel); //On déplace le clear button à la fin chaque fois
        idTask++;
        inputUser.value = "";
        inputUser.focus();

        if (divListTasks.childElementCount != 0) divListTasks.style.paddingTop = "20px";
    }
}

/**
 * Vérifie l'existence de la tache dans la liste des taches
 * @param dataInputValue 
 * @returns True si le libellé de la tache existe déjà dans la liste et false sinon
 */
function checkDoublon(dataInputValue) {
    for (const task of tasks) {
        if (dataInputValue == task.text) {
            alert("Cette tâche est déjà ajoutée");
            return true;
        }
    }
    return false;
}

/**
 * Crée les élements nécessaire à l'affichage d'une Tache à l'ecran
 * @param task 
 * @returns la tâche créée dans le DOM
 */
function createTask(task) {
    //Div parent
    let item = document.createElement("div");
    item.classList.add("task");
    item.setAttribute("data-task-id", task.task_id);

    //Icone
    let icon = document.createElement("i");
    icon.classList.add("fa-solid", "fa-xmark", "icon");
    icon.addEventListener("click", deleteTask)

    //Espace blanc entre icone et checkox
    let blankNode = document.createTextNode(" ");

    //Checkbox
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.setAttribute("name", "checkbox" + task.task_id);
    checkbox.setAttribute("id", "checkbox" + task.task_id);
    checkbox.addEventListener("input", doneTask);

    //Label
    let labelCheckbox = document.createElement("label");
    labelCheckbox.innerHTML = task.text;
    labelCheckbox.setAttribute("for", "checkbox" + task.task_id);

    item.appendChild(icon);
    item.appendChild(blankNode);
    item.appendChild(checkbox);
    item.appendChild(labelCheckbox);

    return item;
}

/**
 * Permet de changer l'état de la tache (Achevé/Non Achevé)
 * @param event 
 */
function doneTask(event) {
    let taskElement = findTaskElement(event);
    let task = taskElement.task;
    let divParent = taskElement.divParent;

    //Actualisation de l'objet
    task.isDone = event.target.checked;

    //Actualisation du front
    task.isDone ? divParent.lastElementChild.classList.add("task-done") : divParent.lastElementChild.classList.remove("task-done");
}

/**
 * Recherche l'objet Task correspondant à la ligne
 * @returns un objet contenant l'objet Task et la div correspondante
 */
function findTaskElement(event) {
    let taskElement = {};

    let divParent = event.target.closest("div"); //Recuperation du parent de l'element (div parent)

    //Recuperation de l'objet Task correspondant
    let task = tasks.find((taskObject) => {
        return taskObject.task_id == divParent.getAttribute("data-task-id");
    });

    taskElement = { "divParent": divParent, "task": task };

    return taskElement;
}

/**
 * Supprime la tache sélectionnée de la liste des taches
 * @param event 
 */
function deleteTask(event) {
    let taskElement = findTaskElement(event);
    let task = taskElement.task;
    let divParent = taskElement.divParent;

    //Actualisation du tableau
    for (const key in tasks) {
        if (tasks[key].task_id == task.task_id) {
            tasks.splice(key, 1);
            break;
        }
    }

    //Actualisation du front-end
    divListTasks.removeChild(divParent);

    cleanObject();
}

/**
 * Nettoie les objets correspondants quand il n'y a plus de tache dans la liste
 */
function cleanObject() {
    if (tasks.length == 0) {
        idTask = 0;

        //Actualisation du front-end
        divListTasks.style.paddingTop = "0px";
        divListTasks.innerHTML = "";
    }
}

/**
 * Supprime toutes les taches présentes dans la liste
 * @param event 
 */
function clearTasks(event) {
    //Suppression des elements du tableau
    tasks.splice(0, tasks.length);

    cleanObject();
}