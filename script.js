let TC = document.querySelector(".ticket-container");
let allFilters = document.querySelectorAll(".filter");
let modalVisible = false;


//******************************************* LOADING TICKETS ON REFRESHING PAGE**************************************************

function loadTickets(color) {
    let allTasks = localStorage.getItem("allTasks");
    if (allTasks != null) {
        allTasks = JSON.parse(allTasks);

        if (color) {
            allTasks = allTasks.filter(function (data) {
                return data.priority == color;
            })
        }
        for (let i = 0; i < allTasks.length; i++) {
            let ticket = document.createElement("div");

            ticket.classList.add("ticket");
            ticket.innerHTML = `<div class="ticket-color ticket-color-${allTasks[i].priority}"></div>
            <div class="ticket-id">#${allTasks[i].ticketId}</div>
            <div class="task">${allTasks[i].task}</div>`;

            // document.querySelector(".modal").remove();
            // modalVisible = false;
            TC.appendChild(ticket);
            ticket.addEventListener("click", function (e) {
                if (e.currentTarget.classList.contains("active")) {
                    e.currentTarget.classList.remove("active");
                } else {
                    e.currentTarget.classList.add("active");
                }
            });
        }
    }
}

loadTickets();

for (let i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener("click", filterHandler);

}


//***************************************** LOADING TICKETS OF SELECTED COLOR PRIORITY ******************************

function filterHandler(e) {
    TC.innerHTML = "";
    if (e.currentTarget.classList.contains("active")) { // already have active class
        e.currentTarget.classList.remove("active");
        loadTickets();
    } else {
        let activeFilter = document.querySelector(".filter.active");
        if (activeFilter) {  // if and only if someone has active class 
            activeFilter.classList.remove("active");
        }
        e.currentTarget.classList.add("active");
        let ticketPriority = e.currentTarget.children[0].classList[0].split("-")[0];
        loadTickets(ticketPriority);
    }
}


//******************************************* ON CLICK OF '-' BUTTON **************************************************

let deleteBtn = document.querySelector(".delete");

deleteBtn.addEventListener("click", function (e) {
    let selectedTickets = document.querySelectorAll(".ticket.active");
    let allTasks = JSON.parse(localStorage.getItem("allTasks"));
    for (let i = 0; i < selectedTickets.length; i++) {
        selectedTickets[i].remove();
        let ticketID = selectedTickets[i].querySelector(".ticket-id").innerText;
        allTasks = allTasks.filter(function (data) {
            return (("#" + data.ticketId) != ticketID);
        })
    }
    localStorage.setItem("allTasks", JSON.stringify(allTasks));
});



//******************************************* ON CLICK OF '+' BUTTON **************************************************

let addBtn = document.querySelector(".add");
addBtn.addEventListener("click", showModal);
let selecedPriority;

function showModal(e) {

    if (!modalVisible) {
        let modal = document.createElement("div");
        modal.classList.add("modal");
        modal.innerHTML = `<div class="task-to-be-added" data-typed="false" contenteditable="true">Enter your task here</div>
                        <div class="modal-priority-list">
             <div class="modal-red-filter modal-filter active"></div>
             <div class="modal-yellow-filter modal-filter"></div>
             <div class="modal-green-filter modal-filter"></div>
            <div class="modal-blue-filter modal-filter"></div>
            </div>`;
        TC.appendChild(modal);

        selectedPriority = "red";
        let taskModal = document.querySelector(".task-to-be-added");
        taskModal.addEventListener("click", function (e) { // if clicked task div
            if (e.currentTarget.getAttribute("data-typed") == "false") { //it will check if data typed is false then
                e.currentTarget.innerText = ""; // put innerText as empty on click 
                e.currentTarget.setAttribute("data-typed", "true"); // then set data typed as true
            }
        })

        modalVisible = true;
        taskModal.addEventListener("keypress", addTicket.bind(this, taskModal));
        let modalFilters = document.querySelectorAll(".modal-filter");
        for (let i = 0; i < modalFilters.length; i++) {
            modalFilters[i].addEventListener("click", selectPriority.bind(this, taskModal));
        }
    }
}

function selectPriority(taskModal, e) {
    let activeFilter = document.querySelector(".modal-filter.active");
    activeFilter.classList.remove("active");
    selectedPriority = e.currentTarget.classList[0].split("-")[1];
    e.currentTarget.classList.add("active");
    taskModal.click();
    taskModal.focus();
}

function addTicket(taskModal, e) {
    if (e.key == "Enter" && e.shiftKey == false && taskModal.innerText.trim() != "") {
        let task = taskModal.innerText;
        let id = uid();

        document.querySelector(".modal").remove();
        modalVisible = false;

        let allTasks = localStorage.getItem("allTasks");

        if (allTasks == null) {
            let data = [{ "ticketId": id, "task": task, "priority": selectedPriority }];
            localStorage.setItem("allTasks", JSON.stringify(data));
        } else {
            let data = JSON.parse(allTasks);
            data.push({ "ticketId": id, "task": task, "priority": selectedPriority });
            localStorage.setItem("allTasks", JSON.stringify(data));
        }
        let activeFilter = document.querySelector(".filter.active");
        TC.innerHTML = "";
        if (activeFilter) {
            let priority = activeFilter.children[0].classList[0].split("-")[0];
            loadTickets(priority);
        } else {
            loadTickets();
        }
    } else if (e.key == "Enter" && e.shiftKey == false) {
        e.preventDefault();
        alert("Error! you have not type anything in task.")
    }
}


//******************************************* ON CLICK OF LOCK BUTTON *********************************************

let lockBtn = document.querySelector(".lock-icon");
let lockState = true;

lockBtn.addEventListener("click", function () {
    let taskToEdit = document.querySelectorAll(".task");

    lockState = !lockState;
    if (lockState == false) {
        lockBtn.classList.remove("fa-lock");
        lockBtn.classList.add("fa-unlock-alt");
        taskToEdit.forEach(function (task) {
            task.setAttribute("contenteditable", "true");
        })


    } else {
        let selectedTickets = document.querySelectorAll(".ticket.active");
        let allTasks = JSON.parse(localStorage.getItem("allTasks"));
        for (let i = 0; i < selectedTickets.length; i++) {
            let ticketID = selectedTickets[i].querySelector(".ticket-id").innerText;
            let task = selectedTickets[i].querySelector(".task").innerText;
            for (let i = 0; i < allTasks.length; i++) {
                if (("#" + allTasks[i].ticketId) == ticketID) {
                    allTasks[i].task = task;
                    localStorage.setItem("allTasks", JSON.stringify(allTasks));
                }
            }
        }
        lockBtn.classList.remove("fa-unlock-alt");
        lockBtn.classList.add("fa-lock");
        taskToEdit.forEach(function (task) {
            task.setAttribute("contenteditable", "false");
        })
    }
})



//****************************************** DISPLAY FEATURES ON HOVER ON i BUTTON **********************************************

let infoBtn = document.querySelector(".info-container");

infoBtn.addEventListener("mouseover", function () {

    let allfunctions = document.createElement("div");
    allfunctions.setAttribute("class", "allfunctions");
    allfunctions.innerHTML = `<h2 style="text-align:center;"><u>Features:</u></h2>
	<ul>
		<li><b>Add Tasks:</b> Click '+' Icon. New task is added with unique ID.</li>
		<br />
        <li><b>Add Color of the Task when adding:</b> Click any color from the color displayed.</li>
		<br />
		<li><b>Delete Tasks:</b> Select the ticket/tickets you want to delete,then Click '-' Icon.</li>
		<br />
        <li>
			<b>Edit Tasks:</b> Unlock the lock by pressing the lock
			icon and click the task description.
		</li>
		<br />
		<li><b>View All Tasks:</b> When no color is chosen from Toolbar all tasks are visible.</li>
		<br />
		<li>
			<b>Filter specific Tasks:</b> Click that specific color in the Toolbar.
		</li>
		<br />			
		<p>
			<b><i>Your data will be stored till the next time you open this app.</b>
		<i></i></p>
	</ul>`;
    body.appendChild(allfunctions);
});

let body = document.body
infoBtn.addEventListener("mouseout", function () {
    body.removeChild(body.childNodes[body.childNodes.length - 1]);
});
