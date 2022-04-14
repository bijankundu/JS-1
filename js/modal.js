let modal = "";
let modalType = "Add";

const idTypesAndPatterns = {
  Adhaar: "[0-9]{12}",
  PAN: "[A-Z]{5}[0-9]{4}[A-Z]{1}",
  DL: "DL[0-9]{12}",
};

const teamsAndManager = {
  Frontend: ["FrontA", "FrontB", "FrontC"],
  Backend: ["BackA", "BackB", "BackC"],
  Product: ["ProA", "ProB", "ProC"],
};

const stateAndCity = {
  StateA: ["S1C1", "S1C2", "S3C3"],
  StateB: ["S2C1", "S2C2"],
};

const handleFormSubmit = (event) => {
  event.preventDefault();

  const employeeObj = {};

  employeeObj["name"] = {
    first: document.getElementById("form--first-name").value,
    middle: document.getElementById("form--middle-name").value ?? "",
    last: document.getElementById("form--last-name").value,
  };
  employeeObj["email_id"] = document.getElementById("form--email").value;
  employeeObj["phone_number"] = document.getElementById("form--phone").value;
  employeeObj["gender"] = document.getElementById("form--gender").value;
  employeeObj["age"] = document.getElementById("form--age").value;
  employeeObj["team"] = document.getElementById("form--team").value;
  employeeObj["manager"] = document.getElementById("form--manager").value;
  employeeObj["address"] = {
    line_1: document.getElementById("form--addr_line_1").value,
    line_2: document.getElementById("form-addr_line_2").value,
    city: document.getElementById("form--city").value,
    state: document.getElementById("form--state").value,
    pincode: document.getElementById("form--pincode").value,
  };
  employeeObj["id"] = {
    type: document.getElementById("form--id-type").value,
    number: document.getElementById("form--id_number").value,
  };

  if (modalType === "Add") addNewEmployee(employeeObj);
  else updateEmployeeDetails(employeeObj);
};

const closeModal = () => {
  document.body.style.overflow = "auto";
  modal.classList.remove("show-modal");
  resetFormFields();
};

const openModal = () => {
  if (modalType === "Edit") setFormFields();
  modal.scrollTop = 0;
  document.body.style.overflow = "hidden";
  modal.classList.add("show-modal");
};

const windowOnClick = (event) => {
  if (event.target === modal) {
    closeModal();
  }
};

window.addEventListener("click", windowOnClick);

const createInputFormGroup = (labelText = "", id, attributes = {}) => {
  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");
  const label = document.createElement("label");
  const input = document.createElement("input");
  label.setAttribute("for", `form--${id}`);
  label.innerText = labelText;
  input.id = `form--${id}`;
  input.setAttribute("name", id);
  Object.keys(attributes).forEach((key) => {
    input.setAttribute(key, attributes[key]);
  });

  formGroup.append(label, input);

  return formGroup;
};

const createSelectFormGroup = (labelText = "", id, options = []) => {
  const formGroup = document.createElement("div");
  formGroup.classList.add("form-group");
  const label = document.createElement("label");
  const select = document.createElement("select");
  label.setAttribute("for", `form--${id}`);
  label.innerText = labelText;
  select.id = `form--${id}`;
  select.setAttribute("name", id);
  options.forEach((optionValue) => {
    const option = document.createElement("option");
    option.value = optionValue;
    option.innerText = optionValue;

    select.append(option);
  });

  formGroup.append(label, select);

  return formGroup;
};

const createModal = (modalTitle = "", type = "Add", extras = {}) => {
  modalType = type;

  const modalContainer = document.createElement("div");
  modalContainer.classList.add("modal");
  const modalContent = document.createElement("div");
  modalContent.classList.add("modal-content");
  const modalHeader = document.createElement("div");
  modalHeader.classList.add("modal-header");
  const modalHeading = document.createElement("h3");
  modalHeading.innerText = modalTitle;
  const closeBtn = document.createElement("button");
  closeBtn.classList.add("btn", "btn-close");
  const closeIcon = document.createElement("i");
  closeIcon.classList.add("fa-solid", "fa-x");
  closeBtn.onclick = closeModal;
  closeBtn.append(closeIcon);
  modalHeader.append(modalHeading, closeBtn);

  const modalBody = document.createElement("div");
  modalBody.classList.add("modal-body");

  const form = document.createElement("form");
  form.classList.add("employee-details-form");
  form.onsubmit = handleFormSubmit;

  const phoneAgeRow = document.createElement("div");
  phoneAgeRow.classList.add("form-row");
  phoneAgeRow.append(
    createInputFormGroup("Phone Number", "phone", {
      type: "text",
      placeholder: "Phone number",
      pattern: "[789][0-9]{9}",
      required: true,
    }),
    createInputFormGroup("Age", "age", {
      type: "number",
      placeholder: "Age",
      min: "15",
      max: "70",
      required: true,
    })
  );

  const teamManagerRow = document.createElement("div");
  teamManagerRow.classList.add("form-row");

  teamManagerRow.append(
    createSelectFormGroup("Team", "team", Object.keys(teamsAndManager)),
    createSelectFormGroup(
      "Manager",
      "manager",
      modalType == "Edit" ? teamsAndManager[extras.team] : teamsAndManager["Frontend"]
    )
  );

  const stateCityRow = document.createElement("div");
  stateCityRow.classList.add("form-row");
  stateCityRow.append(
    createSelectFormGroup("State", "state", Object.keys(stateAndCity)),
    createSelectFormGroup("City", "city", modalType == "Edit" ? stateAndCity[extras.state] : stateAndCity["StateA"])
  );

  const addressGroup = createInputFormGroup("Address", "addr_line_1", { type: "text", required: true });
  const addressLine2Input = document.createElement("input");
  addressLine2Input.id = "form-addr_line_2";
  addressLine2Input.setAttribute("name", "addr_line_2");
  addressLine2Input.setAttribute("type", "text");
  addressGroup.append(addressLine2Input);

  const idGroup = document.createElement("div");
  idGroup.classList.add("form-group");
  const idLabel = document.createElement("label");
  idLabel.setAttribute("for", "form--id");
  idLabel.innerText = "ID Card";
  const idFormRow = document.createElement("div");
  idFormRow.classList.add("form-row");
  const idTypeSelect = document.createElement("select");
  idTypeSelect.id = "form--id-type";
  idTypeSelect.setAttribute("name", "id_type");
  Object.keys(idTypesAndPatterns).forEach((type) => {
    const option = document.createElement("option");
    option.value = type;
    option.innerText = type;
    idTypeSelect.append(option);
  });
  const idNumberInput = document.createElement("input");
  idNumberInput.id = "form--id_number";
  idNumberInput.type = "text";
  idNumberInput.setAttribute("name", "id_number");
  idNumberInput.setAttribute(
    "pattern",
    modalType === "Edit" ? idTypesAndPatterns[extras.idType] : idTypesAndPatterns["Adhaar"]
  );
  idNumberInput.setAttribute("required", true);

  idFormRow.append(idTypeSelect, idNumberInput);
  idGroup.append(idLabel, idFormRow);

  form.append(
    createInputFormGroup("First Name", "first-name", { type: "text", placeholder: "First Name", required: true }),
    createInputFormGroup("Middle Name", "middle-name", { type: "text", placeholder: "Middle Name" }),
    createInputFormGroup("Last Name", "last-name", { type: "text", placeholder: "Last Name", required: true }),
    createInputFormGroup("Email", "email", { type: "email", placeholder: "Email", required: true }),
    createSelectFormGroup("Gender", "gender", ["Male", "Female"]),
    phoneAgeRow,
    teamManagerRow,
    addressGroup,
    stateCityRow,
    createInputFormGroup("Pincode", "pincode", {
      type: "text",
      placeholder: "Pincode",
      required: true,
      pattern: "[0-9]{6}",
    }),
    idGroup
  );

  const modalFooter = document.createElement("div");
  modalFooter.classList.add("modal-footer");
  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("btn", "btn-danger");
  cancelBtn.innerText = "Cancel";
  cancelBtn.type = "button";
  cancelBtn.onclick = closeModal;
  const submitBtn = document.createElement("button");
  submitBtn.classList.add("btn", "btn-primary");
  submitBtn.innerText = modalType;
  submitBtn.type = "submit";
  modalFooter.append(cancelBtn, submitBtn);

  form.append(modalFooter);

  modalBody.append(form);
  modalContent.append(modalHeader, modalBody);
  modalContainer.append(modalContent);

  modal = modalContainer;

  document.body.append(modalContainer);

  document.getElementById("form--team").addEventListener("change", (event) => {
    const managerSelect = document.getElementById("form--manager");
    managerSelect.innerHTML = "";
    teamsAndManager[event.target.value].forEach((manager) => {
      const option = document.createElement("option");
      option.value = manager;
      option.innerText = manager;
      managerSelect.append(option);
    });
  });

  document.getElementById("form--state").addEventListener("change", (event) => {
    const citySelect = document.getElementById("form--city");
    citySelect.innerHTML = "";
    stateAndCity[event.target.value].forEach((city) => {
      const option = document.createElement("option");
      option.value = city;
      option.innerText = city;
      citySelect.append(option);
    });
  });

  document.getElementById("form--id-type").addEventListener("change", (event) => {
    const formIdNumber = document.getElementById("form--id_number");
    formIdNumber.setAttribute("pattern", idTypesAndPatterns[event.target.value]);
  });
};

const resetFormFields = () => {
  document.getElementById("form--first-name").value = "";
  document.getElementById("form--middle-name").value = "";
  document.getElementById("form--last-name").value = "";
  document.getElementById("form--email").value = "";
  document.getElementById("form--phone").value = "";
  document.getElementById("form--gender").value = "";
  document.getElementById("form--age").value = "";
  document.getElementById("form--team").value = "";
  document.getElementById("form--manager").value = "";
  document.getElementById("form--addr_line_1").value = "";
  document.getElementById("form-addr_line_2").value = "";
  document.getElementById("form--city").value = "";
  document.getElementById("form--state").value = "";
  document.getElementById("form--pincode").value = "";
  document.getElementById("form--id-type").value = "";
  document.getElementById("form--id_number").value = "";
};
