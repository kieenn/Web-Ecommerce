$(document).ready(function () {
  // --- Constants ---
  const $loginForm = $(".login-form");
  const $message = $(".message");
  const $phone = $("#phone");
  const $password = $("#password");
  const $productGridHome = $("#productGrid-home");
  const $productGrid = $("#productGrid");
  const $cartItemTable = $("#cart-item");
  let regexVietNamCharacter =/^[A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/
  let list_products=[]
  // --- Utility Functions ---
  function isValidVietnamesePhoneNumber(phoneNumber) {
    return /^(?:\+84|0084|0)[235789]\d{8,9}$/.test(phoneNumber);
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

function displayProducts(products, $grid) {
  $grid.empty();

  products.forEach(product => {
    const productHtml = `
      <div class="product" data-category="${product.category}" data-size="${product.size}" data-color="${product.color}" data-price="${product.price}">
        <input type="hidden" class="product-id" value="${product.id}">
        <img data-src="${product.image}" alt="${product.name}" class="lazy-load">
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
          <button class="btn btn-primary">Add to Cart</button>
        </div>
      </div>`;
    $grid.append(productHtml);
  });

  lazyLoadImages();
}
function addUniqueFilterOptions(filterValues, $selectElement) {
    const existingOptions = new Set($selectElement.find('option').map((_, option) => $(option).val()).get());

    filterValues.forEach(value => {
      if (!existingOptions.has(value)) {
        $selectElement.append(`<option value="${value}">${value}</option>`);
        existingOptions.add(value);
      }
    });
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

  function validateRegisterForm(fname, lname, birth_of_date, email, phone_number, password, password2) {
    let isValid = true;
    let currentDate = new Date().toJSON().slice(0, 10);
    if (fname.length < 3 || !regexVietNamCharacter.test(fname)) {
      $(".fname-mess").html('<p style="color: red">Name must be at least 3 characters long, contain only letters and spaces, and uppercase the first Letter in each word.</p>');
      isValid = false;
    } else {
      $(".fname-mess").empty();
    }
    if (lname.length < 3 || !regexVietNamCharacter.test(lname)) {
      $(".lname-mess").html('<p style="color: red">Name must be at least 3 characters long and contain only letters and spaces.</p>');
      isValid = false;
    } else {
      $(".lname-mess").empty();
    }
    if(birth_of_date > currentDate){
      $(".bod-mess").html('<p style="color: red">Birthday cannot be greater than today</p>');
      isValid = false;
    } else {
      $(".bod-mess").empty();
    }
    if (!validateEmail(email)) {
      $(".email-mess").html('<p style="color: red" >Please enter a valid email address.</p>');
      isValid = false;
    } else {
      $(".email-mess").empty();
    }
    if (!isValidVietnamesePhoneNumber(phone_number)) {
      $(".phone-mess").html('<p style="color: red" >Please enter a valid Vietnam phone number.</p>');
      isValid = false;
    } else {
      $(".phone-mess").empty();
    }
    if(password.length < 7){
        $(".pass-mess").html('<p style="color: red" >Password must have at least 6 characters long.</p>');
      isValid = false;
    } else {
      $(".pass-mess").empty();
    }
    if (password !== password2){
    $(".pass2-mess").html('<p style="color: red" >Passwords do not match. Please try again.</p>');
      isValid = false;
    } else {
      $(".pass2-mess").empty();
    }
    return isValid;
  }
  //register
    const $registerForm =  $("#register-form")
$registerForm.submit(function(e){
    e.preventDefault()
    const fname = $("#fname").val().trim()
    const lname = $("#lname").val().trim()
    let birth_of_date = $("#birth_of_date").val()
    // birth_of_date = dateFormat(birth_of_date, 'MM-dd-yyyy')
    const email= $("#email").val().trim()
    const phone_number = $("#phone_number").val().trim()
    const password = $("#password").val().trim()
    const password2 = $("#confirm_password").val().trim()
    if (!validateRegisterForm(fname, lname, birth_of_date, email, phone_number, password, password2)){
    return;
   }
    const data ={
      first_name:fname,
      last_name: lname,
      birth_of_date:birth_of_date,
      email:email,
      password:password,
      phone_number:phone_number
    }
    $.ajax({
      url: '/register/post',
      method: 'POST',
      data: data,
      dataType: "json",
      headers: { "X-CSRFToken": "{{ csrf_token }}" },
    }).done(function(response){
      window.location.href='/login'
    }).fail(function(response){
      alert(response.message)
    })
  })
  // --- Contact Form Validation and Submission ---
  function validateForm() {
    let isValid = true;
    const name = $("#InputName").val().trim();
    const message = $("#FormControlTextarea1").val().trim();
    const email = $("#InputEmail1").val().trim();
    const subject = $("#InputSubject").val().trim();

    if (name.length < 3 || !regexVietNamCharacter.test(name)) {
      $("#InputName-message").html('<p style="color: red">Name must be at least 3 characters long and contain only letters and spaces.</p>');
      isValid = false;
    } else {
      $("#InputName-message").empty();
    }

    if (message.length < 10) {
      $("#InputText-message").html('<p style="color: red" >Message must be at least 10 characters long</p>');
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
    list_products.push(...products);
    const isHomePage = $productGridHome.length > 0;
    const $grid = isHomePage ? $productGridHome : $productGrid;

    // If homepage, display only 8 products, otherwise display all
    const productsToDisplay = isHomePage ? products.slice(0, 8) : products;
    if(!isHomePage){
        const categories = new Set(products.map(product => product.category));
    addUniqueFilterOptions(categories, $('.category-filter'));
     const subcategories = new Set(products.map(product => product.subcategory));
    addUniqueFilterOptions(subcategories, $('.subcategory-filter'));

   const sizes = new Set(products.map(product => product.attributes.Size).flat());
    addUniqueFilterOptions(sizes, $('.size-filter'));

     const colors = new Set(products
      .map(product => product.attributes?.Color) // Optional chaining for safety
      .flat()
      .filter(color => color !== undefined) // Filter out undefined values
    );
    addUniqueFilterOptions(colors, $('.color-filter'));

    }
     const minPrice = Math.min(...products.map(product => product.price));
    const maxPrice = Math.max(...products.map(product => product.price));
    $("#price-slider").attr({
       "max" : maxPrice,
       "min" : minPrice,
      "value":minPrice
    });
    $(".price-slider").append(`
        <div id="price-display">Price: <span id="price-value">${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(minPrice)}</span> - ${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(maxPrice)}</div>
    `);
    const $result = $('.results')
    $result.empty()
    $result.append(`<p class="product-length">Showing all ${products.length} results</p>`)
    //handle price slider

    displayProducts(productsToDisplay, $grid);
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

  let orderItems = []
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
        orderItems.push(...items)
        if($("#order-items").length > 0){
          DisplayOrderItems(items)
        }else displayCartItems(items);
        // console.log(orderItems)
      })
      .fail(function() {
        console.log('Error loading cart items.');
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
    let shipping_charge = 30000
function DisplayOrderItems(orderItems){

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
                  <td class ='sub_total'>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</td>
                </tr>
                <tr>
                  <td colspan="2">
                    <h5 class="font-size-14 m-0">Shipping Charge :</h5>
                  </td>
                  <td class>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(shipping_charge)}</td>
                </tr>
                <tr class="bg-light">
                  <td colspan="2">
                    <h5 class="font-size-14 m-0">Total:</h5>
                  </td>
                  <td class="total_price">${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice+shipping_charge)}</td>
                </tr>
                 `);

}
 let totalProductQuantity = 0;
// Helper function to display cart items in the table
function displayCartItems(cartItems) {
  // const $cartItemTable = $("#cart-item");
  $cartItemTable.empty(); // Clear existing cart items

  let totalPrice = 0;


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
if($("#order-items").length > 0 || $cartItemTable.length > 0){
  loadCartItems()
}


 function resizeImage(base64Image, maxWidth, maxHeight) {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let newWidth = maxWidth;
        let newHeight = maxWidth / (img.width / img.height);
        if (newHeight > maxHeight) {
          newHeight = maxHeight;
          newWidth = maxHeight * (img.width / img.height);
        }

        canvas.width = newWidth;
        canvas.height = newHeight;
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(resizedBase64);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = function(error) {
      reject(error);
    };

    img.src = base64Image;
  });
}

// add to cart
$(".add-to-cart").click(async function() {
  const productDetail = JSON.parse(sessionStorage.getItem('productDetail'));
  const data = {
    product_id: productDetail.id,
    color: $("#product-color").val(),
    size: $("#product-size").val(),
    quantity: $("#quantity-input").val()
  };

  try {
    let resizedSrc; // Declare resizedSrc outside the conditional blocks

    if (localStorage.getItem('client')) {
      // Client is logged in
      await $.ajax({ // Use await for the AJAX call
        url: `/addToCart/${localStorage.getItem('client')}/`,
        method: "POST",
        data: data
      });

      alert('Added to cart!');
    } else {
      // Client is not logged in
      let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
      if (!cartItems) {
        cartItems = [];
      }

      const imgSrc = $("#main-image").attr('src');

      // Resize the image using await
      resizedSrc = await resizeImage(imgSrc, 100, 100);

      const existingItem = cartItems.find(item =>
        item.product_id === data.product_id &&
        item.color === data.color &&
        item.size === data.size
      );

      if (existingItem) {
        existingItem.quantity += parseInt(data.quantity);
      } else {
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

      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      alert('Added to cart!');
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    if (error.message === "Image resizing failed.") {
      alert('Error adding to cart. Image resizing failed.');
    } else {
      alert('Error adding to cart.');
    }
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

$("#checkout").click(function(){
  // alert(totalProductQuantity)
  // if(totalProductQuantity > 0){
    window.location.href = "/checkout/";
  // }
})

  function checkoutValidate(billing_name, billing_phone, province_option, district_option, ward_option, detail){
    let isValid = true
    let $billing_name_message = $(".billing-name-message")
     let $billing_phone_message = $(".billing-phone-message")

    if(billing_name.length < 3 || !regexVietNamCharacter.test(billing_name)){
      $billing_name_message.append('<p style="color: red">Name must be at least 3 characters long and contain only letters and spaces.</p>')
      isValid = false
    }else{
      $billing_name_message.empty()
    }
    if(!isValidVietnamesePhoneNumber(billing_phone)){
       $billing_phone_message.append('<p style="color: red">Please enter valid Vietnam phone number</p>')
      isValid = false
    }else{
      $billing_phone_message.empty()
    }
    // Address Validation (Add similar checks for other address fields)
    if (province_option === "Select Province" || district_option === "Select District" || ward_option === "Select Ward") {
      $(".address-message").html("<p style='color: red'>Please select a valid province, district, and ward.</p>");
      isValid = false;
    } else {
      $(".address-message").empty();
    }
    if(detail.length < 1){
        $(".detail-message").html("<p style='color: red'>Please enter address detail.</p>");
      isValid = false;
    } else {
      $(".detail-message").empty();
    }


    return isValid;
  }

  const $proceedCheckOut= $("#proceed-checkout")
  $proceedCheckOut.click(function(){
    const billing_name = $("#billing-name").val().trim()
    const billing_phone = $("#billing-phone").val().trim()
    const province_option = $("#province-option").find(":selected").text().trim()
    const district_option = $("#district-option").find(":selected").text().trim()
    const ward_option = $("#ward-option").find(":selected").text().trim()
    const detail = $("#address-detail").val().trim()
    const payment_method =  $('input[name="pay-method"]:checked').val()
    const sub_total = parseFloat($(".sub_total").text().replace(/\.| ₫/g, ''))
    const data ={
      receiver_name: billing_name,
      receiver_phone: billing_phone,
      province: province_option,
      district: district_option,
      ward: ward_option,
      sub_total: sub_total,
      shipping_charge: shipping_charge,
      total: sub_total+shipping_charge,
      products: orderItems,
      detail: detail,
      payment_method: payment_method,
      status: "Processing"
    }
    console.log(data)
    // console.log(billing_name, billing_phone, province_option, district_option, ward_option, detail, payment_method)
    if(checkoutValidate(billing_name, billing_phone, province_option, district_option, ward_option, detail)){
    $.ajax({
      url: `/order/post/${localStorage.getItem('client')}`,
      method: "POST",
      data: JSON.stringify(data),
      dataType: 'json',
      contentType: 'application/json',
    }).done(function(response){
       window.location.href ='/order/success'
      }).fail(function(response){
        alert(response.error)
      })
    }
  })

  //filter product
$('.category-filter, .subcategory-filter, .size-filter, .color-filter, .sort-price').on('change', function() {
    const filteredProducts = filterProducts(list_products);
    displayProducts(filteredProducts, $('.product-grid'));
    const $result = $('.results')
    $result.empty()
    $result.append(`<p class="product-length">Showing all ${filteredProducts.length} results</p>`)
});

$("#product-name").on("input", function() {
  console.log($(this).val())
  const filteredProducts = filterProducts(list_products);
    displayProducts(filteredProducts, $('.product-grid'));
    const $result = $('.results')
    $result.empty()
    $result.append(`<p class="product-length">Showing all ${filteredProducts.length} results</p>`)
})
// Handle price slider change (use 'input' event instead of 'change')
     $("#price-slider").on("input", function() {
      const value = $(this).val();

  // Format the price using Intl.NumberFormat
  const formattedValue = Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

  $("#price-value").text(formattedValue);
   const filteredProducts = filterProducts(list_products);
    displayProducts(filteredProducts, $('.product-grid'));
    const $result = $('.results')
    $result.empty()
    $result.append(`<p class="product-length">Showing all ${filteredProducts.length} results</p>`)
});
// $priceSlider.on('input', function() {
//     const filteredProducts = filterProducts(list_products);
//     displayProducts(filteredProducts, $('.product-grid'));
//     const $result = $('.results')
//     $result.empty()
//     $result.append(`<p class="product-length">Showing all ${filteredProducts.length} results</p>`)
// });
function filterProducts(products) {
    let filteredProducts = [...products]; // Copy array to avoid modifying original
    // Filter by Category
    const selectedCategory = $('.category-filter').val();
    if (selectedCategory !== '') {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
    }

    // Filter by Subcategory
    const selectedSubcategory = $('.subcategory-filter').val();
    if (selectedSubcategory !== '') {
        filteredProducts = filteredProducts.filter(product => product.subcategory === selectedSubcategory);
    }

    // Filter by Size
    const selectedSize = $('.size-filter').val();
    if (selectedSize !== '') {
        filteredProducts = filteredProducts.filter(product => product.attributes.Size.includes(selectedSize));
        console.log(filteredProducts)
    }

    // Filter by Color
    const selectedColor = $('.color-filter').val()
    if (selectedColor !== '') {
        filteredProducts = filteredProducts.filter(product =>
            product.attributes?.Color?.includes(selectedColor) // Optional Chaining
        )
        console.log(filteredProducts)
    }

    // Filter by Price
    const minPrice = parseInt($("#price-slider").val(), 10);
    filteredProducts = filteredProducts.filter(product => product.price >= minPrice);

    // Filter by Product Name
    const productName = $('#product-name').val().toLowerCase();
    if (productName !== '') {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(productName));
    }
    const selectedSort = $('.sort-price').val();
        switch (selectedSort) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                console.log(filteredProducts)
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                console.log(filteredProducts)
                break;
        }
    return filteredProducts;
}
$('.reset-products').click(function(){
  const $grid = $('.product-grid')
  $grid.empty()
  displayProducts(list_products, $grid)
})
});

// --- Tab Switching Function (Outside document.ready) ---
function activateTab(tabName) {
  $('.tab-pane').removeClass('show active');
  $(`#${tabName}`).addClass('show active');

  $('.btn').css({ 'background-color': '', 'border': 'none' }); // Reset all
  $(`#ex1-tab-${tabName === 'description' ? '1' : '2'}`).css({ 'background-color': '#0d6efd', 'border': 'none' });
}