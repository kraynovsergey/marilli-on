//form attach
const forms = document.querySelectorAll('form[enctype="multipart/form-data"]');
const inputFile = document.querySelectorAll('.upload-file__input');

//modals
const modal = new HystModal({
  linkAttributeName: "data-hystmodal",
  backscroll: false,
});

/////////// Кнопка «Прикрепить файл» /////////// 
inputFile.forEach(function (el) {
  let textSelector = document.querySelector('.upload-file__text');
  let fileList;

  // Событие выбора файла(ов) 
  el.addEventListener('change', function (e) {

    // создаём массив файлов 
    fileList = [];
    for (let i = 0; i < el.files.length; i++) {
      fileList.push(el.files[i]);
    }

    // вызов функции для каждого файла 
    fileList.forEach(file => {
      uploadFile(file);
    });
  });

  // Проверяем размер файлов и выводим название 
  const uploadFile = (file) => {

    // файла <50 Мб 
    if (file.size > 50 * 1024 * 1024) {
      alert('The file must be no larger than 50 MB.');
      return;
    }

    // Показ загружаемых файлов 
    if (file && file.length > 1) {
      if (file.length <= 4) {
        textSelector.textContent = `Selected ${file.length} files`;
      }
      if (file.length > 4) {
        textSelector.textContent = `Selected ${file.length} files`;
      }
    } else {
      textSelector.textContent = file.name;
    }
  }
});

// inputmask
const form = document.querySelector('#request-form');
const telSelector = form.querySelector('input[type="tel"]');
const inputMask = new Inputmask('+7 (999) 999-99-99');

inputMask.mask(telSelector);

const validation = new JustValidate('#request-form', {
  errorFieldCssClass: 'is-invalid',
  errorFieldStyle: {
    border: '1px solid #ff4362',
  },
  errorLabelCssClass: 'error-container',
  errorLabelStyle: {
    color: '#ff4362',
  },
  errorContainer: '.errors-container',
}, );

validation
  .addField('#company-name', [{
    rule: 'minLength',
    value: 3,
    errorMessage: '<span class="form__requirement">Minimum number of characters - 3</span>',
  },
  {
    rule: 'maxLength',
    value: 80,
    errorMessage: '<span class="form__requirement">Maximum number of characters - 80</span>'
  },
  {
    rule: 'required',
    value: true,
    errorMessage: '<span class="form__requirement">Enter your name</span>',
  },
])
  .addField('#name', [{
      rule: 'minLength',
      value: 2,
      errorMessage: '<span class="form__requirement">Minimum number of characters - 2</span>',
    },
    {
      rule: 'maxLength',
      value: 80,
      errorMessage: '<span class="form__requirement">Maximum number of characters - 80</span>'
    },
    {
      rule: 'required',
      value: true,
      errorMessage: '<span class="form__requirement">Enter your First and Last name</span>',
    },
  ])
  .addField('#email', [{
      rule: 'required',
      value: true,
      errorMessage: '<span class="form__requirement">Enter email</span>',
    },
    {
      rule: 'email',
      value: true,
      errorMessage: '<span class="form__requirement">Please enter a valid Email</span>',
    },
  ])
  // .addField('#tel', [{
  //     value: true,
  //     errorMessage: '<span class="form__requirement">Enter phone</span>',
  //   },
  //   {
  //     rule: 'function',
  //     validator: function () {
  //       const phone = telSelector.inputmask.unmaskedvalue();
  //       return phone.length === 10;
  //     },
  //     errorMessage: '<span class="form__requirement">wrong phone number</span>',
  //   },
  // ])
  .addRequiredGroup(
    '#agreement',
    'You must consent to the processing of personal data',
  )
  .onSuccess((event) => {

    let attachmentTitle = form.querySelectorAll('.upload-file__text');
    console.log('Validation passes and form submitted', event);
    let formData = new FormData(event.target);
    console.log(...formData);
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          console.log('sended');
        }
      }
    }

    xhr.open('POST', '/mail.php', true);
    xhr.send(formData);
    event.target.reset();
    // modal.open("#modal-success");
    attachmentTitle.forEach(title => {
      title.textContent = 'Attach a file (up to 50 mb)';
    });
  
  });