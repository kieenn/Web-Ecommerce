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
});

// Function to validate Vietnamese phone number
function isValidVietnamesePhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^(?:\+84|0084|0)[235789]\d{8,9}$/;
  return phoneNumberRegex.test(phoneNumber);
}
