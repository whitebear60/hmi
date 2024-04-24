const questions = [
  {
    "question": "Яке ваше ім'я?",
    "type": "input"
  },
  {
    "question": "What is your email?",
    "type": "input"
  },
  {
    "question": "How old are you?",
    "type": "number"
  },
  {
    "question": "Which university are you studying at?",
    "type": "input"
  },
  {
    "question": "How many students are in your group?",
    "type": "number"
  },
  {
    "question": "Do you live in the dormitory?",
    "type": "yes_no"
  },
  {
    "question": "Have you had any experience working with Python?",
    "type": "yes_no"
  },
  {
    "question": "Have you had any experience working with SQL?",
    "type": "yes_no"
  },
  {
    "question": "What is your favourite subject?",
    "type": "input"
  },
  {
    "question": "Have you participated in any off-class activity?",
    "type": "yes_no"
  },
  {
    "question": "Are you enjoying yourself at the university?",
    "type": "yes_no"
  }
]

const form = document.querySelector("#questionnaire");
console.log(form)
questions.forEach((el, idx) => {
  let inputType;
  switch (el.type) {
    case "input":
      inputType = "text";
      break;
    case "number":
      inputType = "number";
      break;
    case "yes_no":
      inputType = "checkbox";
    default:
      break;
  }

  const input = document.createElement("input")
  input.type = inputType
  input.classList.add("form-control")
  input.id = "question" + idx

  const label = document.createElement("label")
  label.setAttribute("for", input.id)
  label.innerText = el.question

  const div = document.createElement("div")
  if (inputType === "checkbox") {
    input.classList.add("form-check-input")
    label.classList.add("form-check-label")
    div.classList.add("form-check")
    div.appendChild(input)
    div.appendChild(label)
  } else {
    div.appendChild(label)
    div.appendChild(input)
  }
  div.classList.add("mb-3")

  form.appendChild(div)

})


const submit = document.createElement("button")
submit.type = "submit";
form.addEventListener("submit", e => {
  const answers = {}
  e.preventDefault();
  const fd = new FormData(form);
  for (const pair of fd.entries()) {
    console.log(pair[0], pair[1]);
  }
  for (let i = 0; i < form.elements.length - 1; i++) {
    // console.log(i)
    let value = "";
    const elem = form.elements[i];
    if (elem.type === "checkbox") {
      value = elem.checked
    } else {
      value = elem.value
    }
    console.log(value)
    const label = document.querySelectorAll("form#questionnaire label")[i].innerText
    Object.defineProperty(answers, label, {
      value: value,
      writable: false,
      enumerable: true
    })
  }
  console.log(JSON.stringify(answers, null, "\t"))
  const modal = document.querySelector("#questionnaireModal");

  const bm = new bootstrap.Modal(modal);
  const modalBody = modal.querySelector(".modal-body")
  modalBody.innerHTML = `<pre>${JSON.stringify(answers, null, "\t")}</pre>`;
  bm.show();
})

submit.classList.add("btn", "btn-success")
submit.innerHTML = "Submit"

form.appendChild(submit)