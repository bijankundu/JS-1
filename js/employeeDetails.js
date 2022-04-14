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

const renderEmployeeDetails = () => {
  const container = document.querySelector(".inner-container");
  document.querySelector(".details-wrapper").innerHTML = "";
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

  if (!document.querySelector(".modal"))
    createModal("Add new employee", "Edit", {
      team: currentEmployee.team,
      state: currentEmployeeAddress.state,
      idType: currentEmployee.id.type,
    });

  const innerContainer = document.querySelector(".details-wrapper");

  innerContainer.append(generateUserDetailsElement("First Name", `${currentEmployee.name.first}`));
  innerContainer.append(generateUserDetailsElement("Email", `${currentEmployee.email_id}`));
  if (currentEmployee.name.middle !== "")
    innerContainer.append(generateUserDetailsElement("Middle Name", `${currentEmployee.name.middle}`));

  innerContainer.append(
    generateUserDetailsElement("Phone", currentEmployee.phone_number),
    generateUserDetailsElement("Last Name", `${currentEmployee.name.last}`),
    generateUserDetailsElement("Gender", currentEmployee.gender),
    generateUserDetailsElement("Age", currentEmployee.age),
    generateUserDetailsElement("Team", currentEmployee.team),
    generateUserDetailsElement("Manager", currentEmployee.manager),
    generateUserDetailsElement("ID", `${currentEmployee.id.type} (${currentEmployee.id.number})`),
    generateUserDetailsElement("Address", `${currentEmployeeAddress.line_1},<br/>${currentEmployeeAddress.line_2}`),
    generateUserDetailsElement("State", `${currentEmployeeAddress.state}`),
    generateUserDetailsElement("City", `${currentEmployeeAddress.city}`),
    generateUserDetailsElement("Pincode", `${currentEmployeeAddress.pincode}`)
  );
};

const updateEmployeeDetails = (employeeDetails) => {
  const existingEmployees = JSON.parse(localStorage.getItem("userdetails"));

  employeeDetails["user_id"] = empId;

  const filteredEmpoyees = existingEmployees.filter((emp) => emp.user_id != empId);

  localStorage.setItem("userdetails", JSON.stringify([...filteredEmpoyees, employeeDetails]));

  renderEmployeeDetails();
  closeModal();
};

const setFormFields = () => {
  let employees = localStorage.getItem("userdetails");
  employees = JSON.parse(employees);
  const filteredEmp = employees.filter((emp) => emp.user_id == empId);
  const currentEmployee = filteredEmp[0];

  document.getElementById("form--first-name").value = currentEmployee.name.first;
  document.getElementById("form--middle-name").value = currentEmployee.name.middle;
  document.getElementById("form--last-name").value = currentEmployee.name.last;
  document.getElementById("form--email").value = currentEmployee.email_id;
  document.getElementById("form--phone").value = currentEmployee.phone_number;
  document.getElementById("form--gender").value = currentEmployee.gender;
  document.getElementById("form--age").value = currentEmployee.age;
  document.getElementById("form--team").value = currentEmployee.team;
  document.getElementById("form--manager").value = currentEmployee.manager;
  document.getElementById("form--addr_line_1").value = currentEmployee.address.line_1;
  document.getElementById("form-addr_line_2").value = currentEmployee.address.line_2;
  document.getElementById("form--city").value = currentEmployee.address.city;
  document.getElementById("form--state").value = currentEmployee.address.state;
  document.getElementById("form--pincode").value = currentEmployee.address.pincode;
  document.getElementById("form--id-type").value = currentEmployee.id.type;
  document.getElementById("form--id_number").value = currentEmployee.id.number;
};

document.addEventListener("DOMContentLoaded", () => {
  const searchParams = window.location.search.replace("?", "");
  empId = searchParams.split("=")[1] ?? "";
  renderEmployeeDetails();
});
