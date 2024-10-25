$(document).ready(function () {
  // --- Constants ---
  const $loginForm = $(".login-form");
  const $message = $(".message");
  const $phone = $("#phone");
  const $password = $("#password");
  const $productGridHome = $("#productGrid-home");
  const $productGrid = $("#productGrid");
  const $cartItemTable = $("#cart-item");
  const $registerForm = $("#register-form")
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
function addToCart(id){
     const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
          console.log(JSON.stringify(cartItems))
        if (cartItems.length > 0) {
          // Cart has items - Proceed with AJAX request
          $.ajax({
            url: `/addToCart/${id}/`, // Replace with your actual URL
            method: "POST",
            data: JSON.stringify(cartItems),  // Send cartItems as a JSON string
            contentType: "application/json", // Important: Specify data type
          })
              .done(function () {
                alert('Added to cart!');
                localStorage.removeItem('cartItems')
                // Optionally update cart count or provide other feedback
              })
              .fail(function () {
                alert('Error adding to cart.');
                // Handle errors gracefully (e.g., display error message)
              });
        }
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
          addToCart(response.id)
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

  //register
  $registerForm.submit(function(){
    const fname = $("#fname")
    const lname = $("#lname")
    const birth_of_date = $("#birth_of_date")
    const emaill = $("#email")
    const phone_number = $("#phone_number")
    const password = $("#password")
    const password2 = $("#confirm_password")
  })
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
    alert('qq')
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
          <img width="60" height="60" class="rounded-2" src="${image}" style="object-fit: cover" alt=""/>
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

  // show client's cart (login)
  if (localStorage.getItem('client')) {
    $.ajax({
      url: `/cart/get/${localStorage.getItem('client')}`,
      method: "GET",
      dataType: "json",
    })
      .done(function(items) {
        if($("#order-items").length > 0){
          orderItems(items)
        }else displayCartItems(items);

      })
      .fail(function() {
        alert('Error loading cart items.');
      });
  } else {
    // Get cart items from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    displayCartItems(cartItems);
  }
}
$(document).on("click", ".item-detail", function (e) {
  let productId = $(this).find('input[type=hidden]').val();
  let itemName = $(this).find('.item-name').text();
    $.ajax({
      url: `/products/detail/get/${productId}/`,
      method: "GET",
      success: function (data) {
        sessionStorage.setItem("productDetail", JSON.stringify(data));
        window.location.href = `/products/detail/${itemName}/`;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        alert("Failed to retrieve product details: " + errorThrown);
      },
    });
});
function orderItems(orderItems){
  const shipping_charge = 30000
   let totalPrice = 0;
     let totalProductQuantity = 0;
  const $order_items = $("#order-items")
  $order_items.empty()
  orderItems.forEach(item=>{
   totalPrice += parseFloat(item.price); // Calculate price
    totalProductQuantity += item.quantity;
    $order_items.append(`
                <tr>
                  <th scope="row" class="align-center">
                    <img
                      src="${item.image}"
                      alt="${item.name}"
                      title="product-img"
                      class="avatar-lg rounded"
                      width="280"
                      height="280"
                      style="object-fit: cover"
                    />
                  </th>
                  <td>
                    <h5 class="font-size-16 text-truncate">
                       <div style="display: flex; align-items: center; cursor: pointer" class="item-detail"> 
                        <input type="hidden" value="${item.product_id}">
                          <p class="m-0 item-name">${item.name}</p> 
                        </div>
                    </h5>
                    <p class="text-muted mb-0 mt-1">size: ${item.size};  </br>
                     ${item.color === null ? '':(item.color && `color: ${item.color}; </br>`)}
                    quantity: ${item.quantity}</p>
                  </td>
                  <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
                  </tr>
                  `);
                })
               $order_items.append(`
                <tr>
                  <td colspan="2">
                    <h5 class="font-size-14 m-0">Sub Total :</h5>
                  </td>
                  <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</td>
                </tr>
                <tr>
                  <td colspan="2">
                    <h5 class="font-size-14 m-0">Shipping Charge :</h5>
                  </td>
                  <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping_charge)}</td>
                </tr>
                <tr class="bg-light">
                  <td colspan="2">
                    <h5 class="font-size-14 m-0">Total:</h5>
                  </td>
                  <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice+shipping_charge)}</td>
                </tr>
                 `);

}
// Helper function to display cart items in the table
function displayCartItems(cartItems) {
  const $cartItemTable = $("#cart-item");
  $cartItemTable.empty(); // Clear existing cart items

  let totalPrice = 0;
  let totalProductQuantity = 0;

  cartItems.forEach(item => {
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
          <div style="display: flex; align-items: center; cursor: pointer" class="item-detail"> 
          <input type="hidden" value="${item.product_id}">
            <img src="${item.image}" alt="${item.name}" width="50" class="rounded-3 me-2"> 
            <p class="m-0 item-name" style="margin-left: 10px!important;">${item.name}</p> 
          </div>
        </td>
        <td class = "align-middle text-center" id="productSize">${item.size}</td>
        <td class = "align-middle text-center" id="productColor"> ${item.color ? item.color : ''} </td>
        <td class = "align-middle text-center"><input type="number" min="1" value="${item.quantity}" class="border-0 text-center" style="width: auto; max-width: 50px"></td>
        <td class = "align-middle text-center">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
      </tr>   
    `);
  });

  attachDeleteHandlers();
  $("#totalProduct").text(totalProductQuantity); // Use text() to set the content
  $("#totalPrice").text(new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice));
}

// Function to attach delete handlers to cart items
function attachDeleteHandlers() {
  $('.delete-button').on('click', function () {
    const $row = $(this).closest('tr');
    const itemId = $row.find('input[type=hidden]').val();
    let itemColor = $row.find('#productColor').text().trim();
    const itemSize = $row.find('#productSize').text()
    if (itemColor === '') {
    itemColor = undefined;
    }
    // If the user is logged in, make a DELETE request to the server
    if (localStorage.getItem('client')) {
      $.ajax({
        url: `/cart/delete/${itemId}`,
        method: 'DELETE',
      })
        .done(function (response) {
          $row.remove();// Refresh the cart display
          loadCartItems()
        })
        .fail(function () {
          alert('Error deleting item from cart.');
        });
    } else {
      // Remove item from localStorage

      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || []; // Fix: Check if cartItems exist
      if (cartItems) { // Only filter if cartItems exist
        cartItems = cartItems.filter(item => item.id !== itemId || item.color !== itemColor || item.size !== itemSize);
        alert(cartItems)
         localStorage.setItem("cartItems", JSON.stringify(cartItems));
         $row.remove();
        loadCartItems()
      }
    }
  });
}
$(document).on("click", ".item-thumb", function (e) {
    e.preventDefault();
    $("#main-image").attr("src", $(this).data("image"));
});

loadCartItems()

 //resize img
function resizeImage(base64Image, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Calculate new dimensions while maintaining aspect ratio
      let newWidth = maxWidth;
      let newHeight = maxWidth / (img.width / img.height);
      if (newHeight > maxHeight) {
        newHeight = maxHeight;
        newWidth = maxHeight * (img.width / img.height);
      }

      canvas.width = newWidth;
      canvas.height = newHeight;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, newWidth, newHeight);

      // Get the resized base64 image
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8); // Adjust quality (0.8 is a good default)
      resolve(resizedBase64);
    };

    img.onerror = function (error) {
      reject(error); // Handle errors during image loading
    };

    img.src = base64Image;
  });
}

// add to cart
$(".add-to-cart").click(function() {
  const productDetail = JSON.parse(sessionStorage.getItem('productDetail'));
  const data = {
    product_id: productDetail.id,
    color: $("#product-color").val(),
    size: $("#product-size").val(),
    quantity: $("#quantity-input").val()
  };

  // if client login
  if (localStorage.getItem('client')) {
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
  } else {
    // 1. Check if cartItems exist in localStorage
    let cartItems = JSON.parse(localStorage.getItem("cartItems"));
    // 2. If cartItems don't exist, initialize an empty array
    if (!cartItems) {
      cartItems = [];
    }

    // 3. Resize the image
    const imgSrc = $("#main-image").attr('src');
    resizeImage(imgSrc, 100, 100) // Set your desired maxWidth and maxHeight
      .then(resizedSrc => {
        // 4. Check for existing item with matching ID, color, and size
        const existingItem = cartItems.find(item =>
          item.product_id === data.product_id &&
          item.color === data.color &&
          item.size === data.size
        );

        // 5. If the item already exists, update its quantity
        if (existingItem) {
          existingItem.quantity += parseInt(data.quantity);
        } else {
          // 6. Otherwise, add the new item to the cart with resized image
          cartItems.push({
            product_id: data.product_id,
            color: data.color,
            size: data.size,
            quantity: parseInt(data.quantity),
            image: resizedSrc,
            name: productDetail.name,
            price: productDetail.price
          });
        }

        // 7. Update localStorage with the updated cart items
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        //alert mess
        alert('Added to cart!')
      })
      .catch(error => {
        console.error("Error resizing image:", error);
        alert('img error')
      });
  }
  });

  //shipping info (province, district, ward) call api
  const host = "https://provinces.open-api.vn/api/";

      // Function to fetch data and populate select options
      const fetchDataAndPopulateSelect = (apiUrl, selectId) => {
        $.ajax({
          url: apiUrl,
          type: "GET",
          dataType: "json",
          success: (response) => {
            let data;
            if (selectId === 'province-option') {
              data = response;
            } else {
              data = response[`${selectId.replace('-option', 's')}`];
            }

            const $selectElement = $(`#${selectId}`);
            // $selectElement.empty().append('<option value="">Select nameSelect</option>');

            $.each(data, function(index, item) {
              $selectElement.append(`<option value="${item.code}">${item.name}</option>`);
            });
          },
          error: (error) => {
            console.error("Error fetching data:", error);
          }
        });
      };

      // Event listeners for select changes
      $('#province-option').change(function() {
        const selectedProvinceCode = $(this).val();
        if (selectedProvinceCode) {
          fetchDataAndPopulateSelect(`${host}p/${selectedProvinceCode}?depth=2`, 'district-option');
        } else {
          $('#district-option, #ward-option').empty().append('<option value="">Select District</option>');
        }
      });

      $('#district-option').change(function() {
        const selectedDistrictCode = $(this).val();
        if (selectedDistrictCode) {
          fetchDataAndPopulateSelect(`${host}d/${selectedDistrictCode}?depth=2`, 'ward-option');
        } else {
          $('#ward-option').empty().append('<option value="">Select Ward</option>');
        }
      });

      // Initial population of provinces
      fetchDataAndPopulateSelect(`${host}?depth=1`, 'province-option');


});

// --- Tab Switching Function (Outside document.ready) ---
function activateTab(tabName) {
  $('.tab-pane').removeClass('show active');
  $(`#${tabName}`).addClass('show active');

  $('.btn').css({ 'background-color': '', 'border': 'none' }); // Reset all
  $(`#ex1-tab-${tabName === 'description' ? '1' : '2'}`).css({ 'background-color': '#0d6efd', 'border': 'none' });
}