const generateCardDetailsElement = (key, value, icon = []) => {
  const userDetailsContainer = document.createElement("div");
  userDetailsContainer.classList.add("user-details");
  const h5 = document.createElement("h5");
  const p = document.createElement("p");
  const keyIcon = document.createElement("i");
  keyIcon.classList.add(...icon);
  h5.innerText = key;
  p.innerText = value;
  h5.prepend(keyIcon);
  userDetailsContainer.append(h5, p);
  return userDetailsContainer;
};

const cardGenerator = (userDetails = {}) => {
  const card = document.createElement("div");
  card.classList.add("card", `emp_${userDetails.user_id}`);

  const cardTitle = document.createElement("div");
  cardTitle.classList.add("card--title");
  const titleh3 = document.createElement("h3");
  titleh3.innerText = `${userDetails.name.first} ${userDetails.name.middle} ${userDetails.name.last}`;
  cardTitle.append(titleh3);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card--body");
  const userGender = generateCardDetailsElement("Gender", userDetails.gender, ["fa-solid", "fa-venus-mars"]);
  const userAge = generateCardDetailsElement("Age", userDetails.age, ["fa-solid", "fa-cake-candles"]);
  const userTeam = generateCardDetailsElement("Team", userDetails.team, ["fa-solid", "fa-people-group"]);
  const userManager = generateCardDetailsElement("Manager", userDetails.manager, ["fa-solid", "fa-people-roof"]);

  cardBody.append(userGender, userAge, userTeam, userManager);

  const deleteButton = document.createElement("button");
  deleteButton.classList.add("btn", "btn-danger", "btn--delete");
  deleteButton.dataset.user_id = userDetails.user_id;
  deleteButton.innerText = "DELETE";

  const buttonIcon = document.createElement("i");
  buttonIcon.classList.add("fa-regular", "fa-trash-can");

  deleteButton.prepend(buttonIcon);

  cardBody.append(deleteButton);

  card.append(cardTitle, cardBody);

  return card;
};

const deleteCard = (userId) => {
  const card = document.querySelector(`.emp_${userId}`);
  card.remove();

  const existingEmployees = JSON.parse(localStorage.getItem("userdetails"));

  localStorage.setItem("userdetails", JSON.stringify(existingEmployees.filter((user) => user.user_id != userId)));
};

const renderCards = (userDetails) => {
  const container = document.getElementById("container--home");
  userDetails.forEach((user) => {
    const card = cardGenerator(user);
    container.append(card);
  });
};

const addNewEmployee = (employeeDetails) => {
  const existingEmployees = JSON.parse(localStorage.getItem("userdetails"));
  employeeDetails["user_id"] = existingEmployees.length;
  const card = cardGenerator(employeeDetails);
  document.getElementById("container--home").append(card);
  localStorage.setItem("userdetails", JSON.stringify([...existingEmployees, employeeDetails]));
  closeModal();
};

const triggerDownload = () => {
  let userDetails = localStorage.getItem("userdetails");
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(userDetails);
  const dlAnchorElem = document.createElement("a");
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "employee_data.json");
  dlAnchorElem.id = "downloadAnchorElem";
  document.body.append(dlAnchorElem);
  dlAnchorElem.click();
  document.getElementById("downloadAnchorElem").remove();
};

document.addEventListener("DOMContentLoaded", async () => {
  let userDetails = localStorage.getItem("userdetails");

  if (!userDetails) {
    const results = await fetch("sample.json");
    const users = await results.json();
    userDetails = JSON.stringify(users);
    localStorage.setItem("userdetails", userDetails);
  }

  userDetails = JSON.parse(userDetails);
  renderCards(userDetails);

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("btn--delete")) {
      event.stopPropagation();
      deleteCard(event.target.dataset.user_id);
    } else if (event.target.closest(".card")) {
      const empId = event.target.closest(".card").classList[1].split("_")[1];
      window.location.href = `./pages/employeeDetails.html?empId=${empId}`;
    }
  });

  createModal("Add new employee", "Add");
});
