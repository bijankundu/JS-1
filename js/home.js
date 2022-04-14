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

const renderCards = (userDetails) => {
  const container = document.getElementById("container--screen1");
  userDetails.forEach((user) => {
    const card = cardGenerator(user);
    container.append(card);
  });
};

const deleteCard = (userId) => {
  const card = document.querySelector(`.emp_${userId}`);
  card.remove();

  const existingEmployees = JSON.parse(localStorage.getItem("userdetails"));

  localStorage.setItem("userdetails", JSON.stringify(existingEmployees.filter((user) => user.user_id != userId)));
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  // console.log(`trigger`);
  const newEmployee = {};
  newEmployee["name"] = {
    first: document.getElementById("first").value,
    middle: document.getElementById("middle").value ?? "",
    last: document.getElementById("last").value,
  };
  newEmployee["email_id"] = document.getElementById("email").value;
  newEmployee["phone_number"] = document.getElementById("phone").value;
  newEmployee["gender"] = document.getElementById("gender").value;
  newEmployee["age"] = document.getElementById("age").value;
  newEmployee["team"] = document.getElementById("team").value;
  newEmployee["manager"] = document.getElementById("manager").value;
  newEmployee["address"] = {
    line_1: document.getElementById("addr-line1").value,
    line_2: document.getElementById("addr-line2").value,
    city: document.getElementById("addr-city").value,
    state: document.getElementById("addr-state").value,
    pincode: document.getElementById("addr-pincode").value,
  };
  newEmployee["id"] = {
    type: document.getElementById("id-type").value,
    number: document.getElementById("id-number").value,
  };

  const existingEmployees = JSON.parse(localStorage.getItem("userdetails"));

  newEmployee["user_id"] = existingEmployees.length;

  const card = cardGenerator(newEmployee);

  document.getElementById("container--screen1").append(card);

  localStorage.setItem("userdetails", JSON.stringify([...existingEmployees, newEmployee]));

  handleCloseModal();

  return false;
};

const resetFormFields = () => {
  document.getElementById("first").value = "";
  document.getElementById("middle").value = "";
  document.getElementById("last").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("gender").value = "";
  document.getElementById("age").value = "";
  document.getElementById("team").value = "";
  document.getElementById("manager").value = "";
  document.getElementById("addr-line1").value = "";
  document.getElementById("addr-line2").value = "";
  document.getElementById("addr-city").value = "";
  document.getElementById("addr-state").value = "";
  document.getElementById("addr-pincode").value = "";
  document.getElementById("id-type").value = "";
  document.getElementById("id-number").value = "";
};

const handleShowModal = () => {
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
};

const handleCloseModal = () => {
  resetFormFields();
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
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
});
