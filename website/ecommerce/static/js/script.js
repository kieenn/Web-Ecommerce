$(document).ready(function () {
  // --- Constants ---
  const $loginForm = $(".login-form");
  const $message = $(".message");
  const $phone = $("#phone");
  const $password = $("#password");
  const $productGridHome = $("#productGrid-home");
  const $productGrid = $("#productGrid");
  const $cartItemTable = $("#cart-item");

  // --- Utility Functions ---
  function isValidVietnamesePhoneNumber(phoneNumber) {
    return /^(?:\+84|0084|0)[235789]\d{8,9}$/.test(phoneNumber);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function displayProduct(product, $grid) {
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
    $grid.append(productHtml);
  }

  // if scroll into the div hold img then load else not
  function lazyLoadImages() {
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
    document.querySelectorAll(".lazy-load").forEach((image) => {
      imageObserver.observe(image);
    });
  }

  // --- Login/Logout Functionality ---
  $loginForm.submit(function (e) {
    e.preventDefault();
    const phoneNumber = $phone.val().trim();
    const password = $password.val().trim();
    $message.empty();

    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
      $message.html('<p style="color: red">Invalid Vietnamese phone number format.</p>');
      return;
    }
    if (!password) {
      $message.html('<p style="color: red">Password cannot be empty.</p>');
      return;
    }

    $.ajax({
      url: "/login/post",
      method: "POST",
      data: { phone_number: phoneNumber, password: password },
      dataType: "json",
      headers: { "X-CSRFToken": "{{ csrf_token }}" }, // Assuming you're using Django
    })
      .done(function (response) {
        if (response.status) {
          localStorage.setItem("login", "true");
          localStorage.setItem("client", response.id);
          window.location.href = "/";
        } else {
          alert(response.message);
        }
      })
      .fail(function () {
        alert("An error occurred during login.");
      });
  });

  $("#logout-button").click(function () {
    localStorage.removeItem("client");
    localStorage.removeItem("login");
    sessionStorage.clear();
  });

  // --- Contact Form Validation and Submission ---
  function validateForm() {
    let isValid = true;
    const name = $("#InputName").val().trim();
    const message = $("#FormControlTextarea1").val().trim();
    const email = $("#InputEmail1").val().trim();
    const subject = $("#InputSubject").val().trim();

    if (name.length < 3 || !/^[a-zA-Z\s]+$/.test(name)) {
      $("#InputName-message").html('<p style="color: red">Name must be at least 3 characters long and contain only letters and spaces.</p>');
      isValid = false;
    } else {
      $("#InputName-message").empty();
    }

    if (message.length < 10 || !/^[a-zA-Z0-9\s]+$/.test(message)) {
      $("#InputText-message").html('<p style="color: red" >Message must be at least 10 characters long and contain only letters, numbers, and spaces.</p>');
      isValid = false;
    } else {
      $("#InputText-message").empty();
    }

    if (!validateEmail(email)) {
      $("#InputEmail-message").html('<p style="color: red" >Please enter a valid email address.</p>');
      isValid = false;
    } else {
      $("#InputEmail-message").empty();
    }

    if (subject.length === 0) {
      $("#InputSubject-message").html('<p style="color: red" >Subject must be at least 1 characters long.</p>');
      isValid = false;
    } else {
      $("#InputSubject-message").empty();
    }

    return isValid;
  }

  //handle contact form (get an email if client have a contact)
  $("#contact-form").submit(function (e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const object = {
      name: $("#InputName").val().trim(),
      email: $("#InputEmail1").val().trim(),
      subject: $("#InputSubject").val().trim(),
      message: $("#FormControlTextarea1").val().trim(),
      access_key: "11932df6-93fa-4459-b7b1-516f39a66e22",
    };

    $.ajax({
      url: "https://api.web3forms.com/submit",
      method: "POST",
      data: JSON.stringify(object),
      contentType: "application/json",
      dataType: "json",
      headers: { "X-CSRFToken": "{{ csrf_token }}" }, // If needed
    })
      .done(function (response) {
        alert(response.message);
        $("#contact-form")[0].reset();
      })
      .fail(function (response) {
        alert(response.message);
      });
  });

  // --- Product Display (Home and Shop) ---
  $.ajax({
    url: "/products/get",
    method: "GET",
    dataType: "json",
  })
    .done(function (products) {
      const isHomePage = $productGridHome.length > 0;
      const $grid = isHomePage ? $productGridHome : $productGrid;
      $grid.empty();
      // if homepage just show 8 products else all
      const productCount = isHomePage ? Math.min(products.length, 8) : products.length;
      for (let i = 0; i < productCount; i++) {
        displayProduct(products[i], $grid);
      }
      lazyLoadImages();
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      alert("Failed to retrieve products: " + errorThrown);
    });

  // --- Product Detail Page ---
  ($productGridHome.add($productGrid)).on("click", ".product", function (e) {
    e.preventDefault();
    const productId = $(this).find(".product-id").val();

    $.ajax({
      url: `/products/detail/get/${productId}/`,
      method: "GET",
      success: function (data) {
        sessionStorage.setItem("productDetail", JSON.stringify(data));
        window.location.href = `/products/detail/${data.name}/`;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Failed to retrieve product details: " + errorThrown);
      },
    });
  });

  // --- Product Detail Page - Image Change, Data Display ---
  $(".item-thumb").on("click", function (e) {
    e.preventDefault();
    $("#main-image").attr("src", $(this).data("image"));
  });

  const productData = JSON.parse(sessionStorage.getItem("productDetail"));
  if (productData) {
    $('#main-image').attr('src', productData.images[0]);
    $('#product-name').text(productData.name);
    $('#product-description').text(productData.description);
    $('#product-summary').text(productData.summary);
    $('#product-price').text(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(productData.price));
    $('#product-orders').html(`</i>${productData.quantity} orders`);
    $('#product-stock-status').text(productData.quantity > 0 ? 'In stock' : 'Out of stock');

    [...new Set(productData.attributes.Color)].forEach(color => {
      $('#product-color').append(`<option value="${color}">${color}</option>`);
    });

    [...new Set(productData.attributes.Size)].forEach(size => {
      $('#product-size').append(`<option value="${size}">${size}</option>`);
    });

    productData.images.forEach(image => {
      $('#image-thumbnails').append(`
        <a class="border mx-1 rounded-2 item-thumb" href="#" data-image="${image}">
          <img width="60" height="60" class="rounded-2" src="${image}" style="object-fit: cover" />
        </a>
      `);
    });
  }

  // --- product quantity ---
  $("#button-addon1").on("click", function () {
    const quantity = parseInt($("#quantity-input").val());
    if (quantity > 1) {
      $("#quantity-input").val(quantity - 1);
    }
  });

  $("#button-addon2").on("click", function () {
    const quantity = parseInt($("#quantity-input").val());
    $("#quantity-input").val(quantity + 1);
  });

  // loading cart item
  function loadCartItems() {
    $cartItemTable.empty(); // Clear before reloading
    let totalPrice = 0; // Initialize totalPrice to 0
    let totalProductQuantity = 0; // Initialize totalQuantity to 0
    // show client's cart ( login )
    if (localStorage.getItem('client')) {
      $.ajax({
        url: `/cart/get/${localStorage.getItem('client')}`,
        method: "GET",
        dataType: "json",
      })
        .done(function (items) {
          items.forEach((item) => {
            totalPrice += parseFloat(item.price); // Calculate price
            totalProductQuantity += item.quantity;
            $cartItemTable.append(`
              <tr>
                <th scope="row" class="delete-button align-middle" style="cursor: pointer">
                  <div>
                    <input type="hidden" value="${item.id}">
                    <i style="font-size:20px; color: red" class="fa"></i> 
                  </div>
                </th>
                <td class = "align-middle">
                  <div style="display: flex; align-items: center;"> 
                    <img src="${item.image}" alt="${item.name}" width="30" class="rounded-3 me-2"> 
                    <p class="m-0">${item.name}</p> 
                  </div>
                </td>
                <td class = "align-middle text-center">${item.size}</td>
                <td class = "align-middle text-center">${item.color}</td>
                <td class = "align-middle text-center"><input type="number" min="1" value="${item.quantity}" class="border-0 text-center" style="width: auto; max-width: 50px"></td>
                <td class = "align-middle text-center">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
              </tr>   
            `);
          });
          attachDeleteHandlers();
           $("#totalProduct").append(totalProductQuantity)
          $("#totalPrice").append(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice))
        })
        .fail(function () {
          alert('Error loading cart items.');
        });
    }
    // if not login
  }

  //delete item in cart
  function attachDeleteHandlers() {
    $('.delete-button').on('click', function () {
      const $row = $(this).closest('tr');
      const itemId = $row.find('input[type=hidden]').val();
      $.ajax({
        url: `/cart/delete/${itemId}`,
        method: 'DELETE',
      })
        .done(function (response) {
          $row.remove();
        })
        .fail(function () {
          alert('Error deleting item from cart.');
        });
    });
  }

  loadCartItems();

  // add to cart
  $(".add-to-cart").click(function(){
    const productDetail = JSON.parse(sessionStorage.getItem('productDetail'));
    const data = {
      product_id: productDetail.id,
      color: $("#product-color").val(),
      size: $("#product-size").val(),
      quantity: $("#quantity-input").val()
    };
    // if client login
    $.ajax({
      url: `/addToCart/${localStorage.getItem('client')}/`,
      method: "POST",
      data: data,
    })
    .done(function(){
      alert('Added to cart!'); // Or update cart count dynamically
    })
    .fail(function(){
      alert('Error adding to cart.');
    });
  });
  // if not login

});

// --- Tab Switching Function (Outside document.ready) ---
function activateTab(tabName) {
  $('.tab-pane').removeClass('show active');
  $(`#${tabName}`).addClass('show active');

  $('.btn').css({ 'background-color': '', 'border': 'none' }); // Reset all
  $(`#ex1-tab-${tabName === 'description' ? '1' : '2'}`).css({ 'background-color': '#0d6efd', 'border': 'none' });
}