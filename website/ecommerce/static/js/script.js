$(document).ready(function() {
  const $loginForm = $(".login-form");
  const $message = $('.message');
  const $phone = $('#phone');
  const $password = $('#password');

  /**
   * Validates a Vietnamese phone number.
   * @param {string} phoneNumber - The phone number to validate.
   * @returns {boolean} True if the phone number is valid, false otherwise.
   */
  function isValidVietnamesePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^(?:\+84|0084|0)[235789]\d{8,9}$/;
    return phoneNumberRegex.test(phoneNumber);
  }

  // Handle login form submission
  $loginForm.submit(function(e) {
    e.preventDefault();

    const phoneNumber = $phone.val().trim();
    const password = $password.val().trim();

    $message.empty();

    // Validate phone number
    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
      $message.html('<p style="color: red">Invalid Vietnamese phone number format.</p>');
      return;
    }

    // Validate password
    if (!password) {
      $message.html('<p style="color: red">Password cannot be empty.</p>');
      return;
    }

    // Send login request
    $.ajax({
      url: "http://localhost:8000/loginhandle/",
      method: "POST",
      data: { phone_number: phoneNumber, password: password },
      dataType: "json",
      headers: {'X-CSRFToken': '{{ csrf_token }}'},
    }).done(function(response) {
      if(response.status){
        sessionStorage.setItem('client', response.id);
        window.location.href = 'http://localhost:8000/';
      }
      else{
        alert(response.message);
      }
    }).fail(function() {
      alert('An error occurred during login.');
    });
  });

  // Handle logout
  $('#logout-button').click(function() {
    sessionStorage.clear();
    // Optionally redirect to login page or home page
    // window.location.href = 'http://localhost:8000/login/';
  });

  /**
   * Validates an email address.
   * @param {string} email - The email address to validate.
   * @returns {boolean} True if the email is valid, false otherwise.
   */
  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates the contact form inputs.
   * @returns {boolean} True if all inputs are valid, false otherwise.
   */
  function validateForm() {
    let isValid = true;
    const nameRegex = /^[a-zA-Z\s]+$/;
    const messageRegex = /^[a-zA-Z0-9\s]+$/;
    
    // Validate Name
    const name = $('#InputName').val().trim();
    if (name.length < 3 || !nameRegex.test(name)) {
      $('#InputName-message').html('<p>Name must be at least 3 characters long and contain only letters and spaces.</p>');
      isValid = false;
    } else {
      $('#InputName-message').empty();
    }

    // Validate Message
    const message = $('#FormControlTextarea1').val().trim();
    if (message.length < 10 || !messageRegex.test(message)) {
      $('#InputText-message').html('<p>Message must be at least 10 characters long and contain only letters, numbers, and spaces.</p>');
      isValid = false;
    } else {
      $('#InputText-message').empty();
    }

    // Validate Email
    const email = $('#InputEmail1').val().trim();
    if (!validateEmail(email)) {
      $('#InputEmail-message').html('<p>Please enter a valid email address.</p>');
      isValid = false;
    } else {
      $('#InputEmail-message').empty();
    }

    return isValid;
  }

  $('.contact-form').submit(function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
      return false;
    }

    const $form = $(this);
    const $result = $('#result');
    const formData = $form.serializeArray();
    const object = {};
    $.each(formData, function(_, item) {
      object[item.name] = item.value;
    });
    const json = JSON.stringify(object);

    $result.html("Please wait...").show();

    $.ajax({
      url: 'https://api.web3forms.com/submit',
      method: 'POST',
      data: json,
      contentType: 'application/json',
      dataType: 'json',
    }).done(function(response) {
      alert(response.message);
    }).fail(function(response) {
      alert(response.message);
    }).always(function() {
      $form[0].reset();
      setTimeout(function() {
        $result.hide();
      }, 3000);
    });
  });

});


