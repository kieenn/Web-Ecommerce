//jquery
$(document).ready(function () {
  const $loginForm = $(".login-form");
  const $message = $(".message");
  const $phone = $("#phone");
  const $password = $("#password");
  const loginStatus = localStorage.getItem('login');

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
  $loginForm.submit(function (e) {
    e.preventDefault();

    const phoneNumber = $phone.val().trim();
    const password = $password.val().trim();

    $message.empty();

    // Validate phone number
    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
      $message.html(
        '<p style="color: red">Invalid Vietnamese phone number format.</p>'
      );
      return;
    }

    // Validate password
    if (!password) {
      $message.html('<p style="color: red">Password cannot be empty.</p>');
      return;
    }

    // Send login request
    $.ajax({
      url: "/login/post",
      method: "POST",
      data: { phone_number: phoneNumber, password: password },
      dataType: "json",
      headers: { "X-CSRFToken": "{{ csrf_token }}" },
    })
      .done(function (response) {
        if (response.status) {
          localStorage.setItem("login", "true")
          localStorage.setItem("client", response.id)
           // Use sessionStorage instead of localStorage
          window.location.href = "/";
        } else {
          alert(response.message);
        }
      })
      .fail(function () {
        alert("An error occurred during login.");
      });
  });

  // Handle logout
  $("#logout-button").click(function () {
    localStorage.removeItem("client");
    localStorage.removeItem("login");
    sessionStorage.clear()
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
    const name = $("#InputName").val().trim();
    if (name.length < 3 || !nameRegex.test(name)) {
      $("#InputName-message").html(
        '<p style="color: red">Name must be at least 3 characters long and contain only letters and spaces.</p>'
      );
      isValid = false;
    } else {
      $("#InputName-message").empty();
    }

    // Validate Message
    const message = $("#FormControlTextarea1").val().trim();
    if (message.length < 10 || !messageRegex.test(message)) {
      $("#InputText-message").html(
        '<p style="color: red" >Message must be at least 10 characters long and contain only letters, numbers, and spaces.</p>'
      );
      isValid = false;
    } else {
      $("#InputText-message").empty();
    }

    // Validate Email
    const email = $("#InputEmail1").val().trim();
    if (!validateEmail(email)) {
      $("#InputEmail-message").html(
        '<p style="color: red" >Please enter a valid email address.</p>'
      );
      isValid = false;
    } else {
      $("#InputEmail-message").empty();
    }
    //validate subject
    const subject = $("#InputSubject").val().trim();
    if (subject.length === 0) {
      $("#InputSubject-message").html(
        '<p style="color: red" >Subject must be at least 1 characters long.</p>'
      );
      isValid = false;
    } else {
      $("#InputSubject-message").empty();
    }
    return isValid;
  }

  $("#contact-form").submit(function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return false;
    }

    const $form = $(this);
    const formData = $form.serializeArray();
    const object = {
      name: $("#InputName").val().trim(),
      email: $("#InputEmail1").val().trim(),
      subject: $("#InputSubject").val().trim(),
      message: $("#FormControlTextarea1").val().trim(),
      access_key: "11932df6-93fa-4459-b7b1-516f39a66e22",
    };

    const json = JSON.stringify(object);

    $.ajax({
      url: "https://api.web3forms.com/submit",
      method: "POST",
      data: json,
      contentType: "application/json",
      dataType: "json",
      headers: { "X-CSRFToken": "{{ csrf_token }}" },
    })
      .done(function (response) {
        alert(response.message);
      })
      .fail(function (response) {
        alert(response.message);
      })
      .always(function () {
        $form[0].reset();
        setTimeout(function () {
          $result.hide();
        }, 3000);
      });
  });
  $("#price-slider").on("input", function () {
    $("#price-value").text(this.value);
  });
  // get products information in homepage and shop
  $.ajax({
    url: "/products/get",
    method: "GET",
    dataType: "json",
  })
    .done(function (response) {
      products = response;
      const isHomePage = $("#productGrid-home").length > 0; // Check if on home page
      const $productGrid = isHomePage
        ? $("#productGrid-home")
        : $("#productGrid"); // Select appropriate grid
      $productGrid.empty(); // Clear existing products

      const productCount = isHomePage
        ? Math.min(products.length, 8)
        : products.length; // Limit to 8 products on home page

      for (let i = 0; i < productCount; i++) {
        const product = products[i];
        const productHtml = `
        
          <div class="product">
          
            <input type="hidden" class="product-id" value="${product.id}">
            <img data-src="${product.image}" alt="${product.name}" class="lazy-load" >
            <div class="product-info">
              <h3>${product.name}</h3>
              <p class="price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
              <button class="btn btn-primary">Add to Cart</button>
            </div>

          </div>`;
        $productGrid.append(productHtml);
      }
      // Lazy loading images
      const lazyLoadImages = document.querySelectorAll(".lazy-load");
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove("lazy-load");
            observer.unobserve(img);
          }
        });
      });

      lazyLoadImages.forEach((image) => {
        imageObserver.observe(image);
      });
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Failed to retrieve products: " + errorThrown);
    });

  //quantity product add to cart
  $("#button-addon1").on("click", function () {
    var quantity = parseInt($("#quantity-input").val());
    if (quantity > 1) {
      $("#quantity-input").val(quantity - 1);
    }
  });
  $("#button-addon2").on("click", function () {
    var quantity = parseInt($("#quantity-input").val());
    $("#quantity-input").val(quantity + 1);
  });
  const isHomePage = $("#productGrid-home").length > 0; // Check if on home page
  const $productGrid = isHomePage ? $("#productGrid-home") : $("#productGrid");
  $productGrid.on("click", ".product", function (e) {
    e.preventDefault(); // Prevent default anchor click behavior
    const productId = $(this).find(".product-id").val();

    // Fetch product details using AJAX
    $.ajax({
      url: `/products/detail/get/${productId}/`,
      method: "GET",
      success: function (data) {
        // Store the product details in session storage to handle multiple tabs
        sessionStorage.setItem("productDetail", JSON.stringify(data));
        // Redirect to the product detail page
        window.location.href = `/products/detail/${data.name}/`;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Failed to retrieve product details: " + errorThrown);
      },
    });
  });
  // image change in detail site
  $(".item-thumb").on("click", function (e) {
    e.preventDefault();
    var newSrc = $(this).data("image");
    $("#main-image").attr("src", newSrc);
  });
  //show data in detail site
const productData = JSON.parse(sessionStorage.getItem("productDetail"));
    // alert(productData.attributes.Size[1])
    if (productData) {
      $('#main-image').attr('src', productData.images[0]); // Changed index to 0
      $('#product-name').text(productData.name);
      $('#product-description').text(productData.description);
      $('#product-summary').text(productData.summary);
      $('#product-price').text(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productData.price));
      $('#product-orders').html(`</i>${productData.quantity} orders`);
      $('#product-stock-status').text(productData.quantity > 0 ? 'In stock' : 'Out of stock');

      // Use forEach for color options
      const uniqueColors = [...new Set(productData.attributes.Color)];
      uniqueColors.forEach(color => {
        $('#product-color').append(`<option>${color}</option>`);
      });

      const uniqueSizes = [...new Set(productData.attributes.Size)];
      uniqueSizes.forEach(size => {
        $('#product-size').append(`<option>${size}</option>`);
      });

      // Use forEach for images
      productData.images.forEach(image => {
        $('#image-thumbnails').append(`
          <a class="border mx-1 rounded-2 item-thumb" href="#" data-image="${image}">
            <img width="60" height="60" class="rounded-2" src="${image}" style="object-fit: cover" />
          </a>
        `);
      });
    }

    // call api cart item then fetch data in cart site
    const cart_item = $("#cart-item")
 if (cart_item.length > 0) {
  // Attach the click handler to the cart-item element (or a closer ancestor)
  cart_item.on('click', '.delete-button', function() {
         // Get the parent row of the clicked delete button
    const $row = $(this).closest('tr'); // Assumes the delete button is directly in the row

    // Find the hidden input within the row and get its value
    const itemId = $row.find('input[type=hidden]').val();
    $.ajax({
      url: `/cart/delete/${itemId}`,
      method:"DELETE"
    }).done(function (response){
      alert('done')
    }).fail(function(re){
      alert('cart/delete/'+itemId)
    })
  });
  // check if client exist else get products in local store

      $.ajax({
        url: `/cart/get/${localStorage.getItem('client')}`,
        method: "GET",
        dataType: "json"
      }, 500).done(function(items){
        items.forEach(item =>{
          cart_item.append(`
                <tr>
                  <th scope="row" class="delete-button align-middle" style="cursor: pointer">
                    <div>
                        <input type="hidden" value="${item.id}">
                        <i style="font-size:20px; color: red" class="fa">&#xf014;</i>
                    </div>
                  </th>
                  <td>
                      <div style="display: flex; align-items: center;"> 
                        <img src="${item.image}" alt="${item.name}" width="30" class="rounded-3 me-2"> 
                        <p class="m-0" style=" margin: 0;">${item.name}</p> 
                    </div>
                  </td>
                  <td><input type="number" min="1" value="${item.quantity}" class="rounded-3 " style="width: auto; max-width: 50px"></td>
                  <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                </tr>   
            `)
        })

      }).fail(function () {
        alert('error')
      })
    }

});

//js
function activateTab(tabName) {
  $('.tab-pane').removeClass('show active');
  $('#' + tabName).addClass('show active');
  $('.btn').css('background-color', ''); // Reset background color
  $('.btn').css('border', 'none'); // Reset border
  $('#ex1-tab-' + (tabName === 'description' ? '1' : '2')).css('background-color', '#0d6efd'); // Set active background color
  $('#ex1-tab-' + (tabName === 'description' ? '1' : '2')).css('border', 'none');
}