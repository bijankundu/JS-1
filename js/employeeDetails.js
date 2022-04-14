let empId = "";

const generateUserDetailsElement = (key, value) => {
  const userDetailsContainer = document.createElement("div");
  userDetailsContainer.classList.add("user-details-row");
  const h5 = document.createElement("h5");
  const p = document.createElement("p");
  h5.innerText = key;
  p.innerHTML = value;
  userDetailsContainer.append(h5, p);

  return userDetailsContainer;
};

const renderDetails = () => {
  const container = document.querySelector(".details-wrapper");
  while (container.lastElementChild && container.lastElementChild.classList.contains("user-details-row")) {
    container.removeChild(container.lastElementChild);
  }
  let employees = localStorage.getItem("userdetails");
  if (!employees || empId == "") {
    container.innerText = "Employee not found";
    return;
  }
  employees = JSON.parse(employees);
  const filteredEmp = employees.filter((emp) => emp.user_id == empId);
  if (filteredEmp.length === 0) {
    container.innerText = "Employee not found";
    return;
  }
  const currentEmployee = filteredEmp[0];
  const currentEmployeeAddress = currentEmployee.address;

  container.prepend(
    generateUserDetailsElement(
      "Name",
      `${currentEmployee.name.first} ${currentEmployee.name.middle} ${currentEmployee.name.last}`
    ),
    generateUserDetailsElement("Email", currentEmployee.email_id),
    generateUserDetailsElement("Phone", currentEmployee.phone_number),
    generateUserDetailsElement("Gender", currentEmployee.gender),
    generateUserDetailsElement("Age", currentEmployee.age),
    generateUserDetailsElement("Team", currentEmployee.team),
    generateUserDetailsElement("Manager", currentEmployee.manager),
    generateUserDetailsElement("ID", `${currentEmployee.id.type} (${currentEmployee.id.number})`),
    generateUserDetailsElement(
      "Address",
      `${currentEmployeeAddress.line_1}<br/>${currentEmployeeAddress.line_2}<br/>${currentEmployeeAddress.state}<br/>${currentEmployeeAddress.city} - ${currentEmployeeAddress.pincode}`
    )
  );
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  console.log(`trigger`);
  const updatedEmployee = {};
  updatedEmployee["name"] = {
    first: document.getElementById("first").value,
    middle: document.getElementById("middle").value ?? "",
    last: document.getElementById("last").value,
  };
  updatedEmployee["email_id"] = document.getElementById("email").value;
  updatedEmployee["phone_number"] = document.getElementById("phone").value;
  updatedEmployee["gender"] = document.getElementById("gender").value;
  updatedEmployee["age"] = document.getElementById("age").value;
  updatedEmployee["team"] = document.getElementById("team").value;
  updatedEmployee["manager"] = document.getElementById("manager").value;
  updatedEmployee["address"] = {
    line_1: document.getElementById("addr-line1").value,
    line_2: document.getElementById("addr-line2").value,
    city: document.getElementById("addr-city").value,
    state: document.getElementById("addr-state").value,
    pincode: document.getElementById("addr-pincode").value,
  };
  updatedEmployee["id"] = {
    type: document.getElementById("id-type").value,
    number: document.getElementById("id-number").value,
  };

  const existingEmployees = JSON.parse(localStorage.getItem("userdetails"));

  updatedEmployee["user_id"] = empId;

  const filteredEmpoyees = existingEmployees.filter((emp) => emp.user_id != empId);
  console.log([...filteredEmpoyees, updatedEmployee]);

  localStorage.setItem("userdetails", JSON.stringify([...filteredEmpoyees, updatedEmployee]));

  renderDetails();

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

const setFormFields = () => {
  let employees = localStorage.getItem("userdetails");
  employees = JSON.parse(employees);
  const filteredEmp = employees.filter((emp) => emp.user_id == empId);
  const currentEmployee = filteredEmp[0];

  document.getElementById("first").value = currentEmployee.name.first;
  document.getElementById("middle").value = currentEmployee.name.middle;
  document.getElementById("last").value = currentEmployee.name.last;
  document.getElementById("email").value = currentEmployee.email_id;
  document.getElementById("phone").value = currentEmployee.phone_number;
  document.getElementById("gender").value = currentEmployee.gender;
  document.getElementById("age").value = currentEmployee.age;
  document.getElementById("team").value = currentEmployee.team;
  document.getElementById("manager").value = currentEmployee.manager;
  document.getElementById("addr-line1").value = currentEmployee.address.line_1;
  document.getElementById("addr-line2").value = currentEmployee.address.line_2;
  document.getElementById("addr-city").value = currentEmployee.address.city;
  document.getElementById("addr-state").value = currentEmployee.address.state;
  document.getElementById("addr-pincode").value = currentEmployee.address.pincode;
  document.getElementById("id-type").value = currentEmployee.id.type;
  document.getElementById("id-number").value = currentEmployee.id.number;
};

const handleShowModal = () => {
  setFormFields();
  const modal = document.querySelector(".modal");
  modal.style.display = "block";
};

const handleCloseModal = () => {
  resetFormFields();
  const modal = document.querySelector(".modal");
  modal.style.display = "none";
};

document.addEventListener("DOMContentLoaded", () => {
  const searchParams = window.location.search.replace("?", "");
  empId = searchParams.split("=")[1] ?? "";
  renderDetails(empId);
});
