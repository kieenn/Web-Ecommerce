$(document).ready(function() {
  const $loginForm = $(".login-form");
  const $message = $('.message');
  const $phone = $('#phone');
  const $password = $('#password');

  $loginForm.submit(function(e) {
    e.preventDefault();

    const phoneNumber = $phone.val();
    const password = $password.val();

    $message.empty();

    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
      $message.html('<p style="color: red">Invalid Vietnamese phone number format.</p>');
      return;
    }

    if (!password.trim()) {
      $message.html('<p style="color: red">Password cannot be empty.</p>');
      return;
    }

    $.ajax({
      url: "http://localhost:8000/loginhandle/",
      method: "POST",
      data: { phone_number: phoneNumber, password: password },
      dataType: "json",
      headers: {'X-CSRFToken': '{{ csrf_token }}'},
    }).done(function(response) {
      sessionStorage.setItem('client', response.id);
      window.location.href = 'http://localhost:8000/';
    }).fail(function(error) {
      alert(error);
    });
  });

  $('#logout-button').click(function() {
    sessionStorage.clear();
  });

  $('.contact-form').submit(function(e) {
    e.preventDefault(); // Prevent default form submission
    alert('check')

    // Client-side validation (optional)
    if (!validateForm()) {
      return false;
    }

    var formData = $(this).serialize();

    $.ajax({
      url: 'https://api.web3forms.com/submit',
      method: "POST",
      data: formData,
      dataType: 'json'
    })
    $('#InputName').val('')
    $('#InputEmail1').val('')
    $('#FormControlTextarea1').val('')

    // window.location.href = 'http://localhost:8000/';
  });

});

// Function to validate Vietnamese phone number
function isValidVietnamesePhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^(?:\+84|0084|0)[235789]\d{8,9}$/;
  return phoneNumberRegex.test(phoneNumber);
}
  function validateForm() {
    // Add your validation logic here, e.g., checking for required fields, email format, etc.
    // Return true if valid, false otherwise
    return true;
}