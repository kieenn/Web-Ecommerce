
$(document).ready(function(){
    const $dashboard_products = $("#dashboard-products");
    const $dashboard_users = $("#dashboard-users")
    const $inventory = $("#dashboard-inventory")
    const $dashboard_orders = $("#dashboard-orders")
    let list_products=[]
    let list_users=[]
    let list_inventory =[]
    let list_orders =[]
     const $result = $('.results')
    let regexVietNamCharacter =/^[A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-Za-zÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/
function haveDataChanges(originalData, updatedData) {
    const keys1 = Object.keys(originalData);
    const keys2 = Object.keys(updatedData);

    if (keys1.length !== keys2.length) return true; // Different number of keys

    for (let key of keys1) {
        if (!updatedData.hasOwnProperty(key)) return true; // Key missing in updatedData

        const val1 = originalData[key];
        const val2 = updatedData[key];

        if (typeof val1 === 'object' && val1 !== null && typeof val2 === 'object' && val2 !== null) {
            if (!deepCompare(val1, val2)) return true; // Recursive call for nested objects
        } else if (val1 !== val2) {
            return true; // Values are different
        }
    }

    return false; // No differences found
}

function deepCompare(obj1, obj2) {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) return false;
    for (let key of keys1) {
        if (!obj2.hasOwnProperty(key) || !deepCompare(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}
    function getCookie(name) {
    let cookieValue = null;

    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
function product(){
    if($dashboard_products.length > 0){
        $.ajax({
            url: '/dashboard/products/get',
            method: "GET",
            contentType: 'application/json' // Although GET requests typically don't have a body
        }).done(function(products){
            list_products.push(...products)
            displayDashboardProducts(list_products, $dashboard_products);
             const categories = new Set(products.map(product => product.category));
            addUniqueProductsFilterOptions(categories, $('.category-filter'));
             const subcategories = new Set(products.map(product => product.subcategory));
            addUniqueProductsFilterOptions(subcategories, $('.subcategory-filter'));
            $result.empty()
            $result.append(`<p class="product-length">Showing all ${products.length} results</p>`)
        }).fail(function(error){  // Include error argument for debugging
            console.error("Error fetching products:", error); // Log the error to the console
            alert('Error loading products. Please check the console for details.'); // More informative alert
        });



         $.ajax({
            url: '/dashboard/category/get',
            method: 'GET',
            contentType: 'application/json'
        }).done(function(categories){
               categories.forEach(category =>{
                $('.product-category').append(`<option value="${category.id}">${category.name}</option>`);
            });
        }).fail(function(){
            alert('fail to call api categories')
        })
    }}
    product()
function user(){
    if($dashboard_users.length > 0){
         $.ajax({
            url: '/dashboard/users/get',
            method: "GET",
            contentType: 'application/json' // Although GET requests typically don't have a body
        }).done(function(users){
            list_users.push(...users)
           displayDashboardUsers(users, $dashboard_users)
             $result.empty()
        $result.append(`<p class="product-length">Showing all ${users.length} results</p>`)
        }).fail(function(error){  // Include error argument for debugging
            console.error("Error fetching users:", error); // Log the error to the console
            alert('Error loading users. Please check the console for details.'); // More informative alert
        });
    }}
    user()
    function inventory(){
    if($inventory.length > 0){
        $.ajax({
            url: '/dashboard/inventory/get',
            method: "GET",
            contentType:'application/json'
        }).done(function(inventory){
            list_inventory.push(...inventory)
            displayInventory(inventory, $inventory)
            $result.empty()
        $result.append(`<p class="product-length">Showing all ${inventory.length} results</p>`)
        }).fail(function(){
              console.error("Error fetching inventory:", error); // Log the error to the console
            alert('Error loading inventory. Please check the console for details.'); // More informative alert
        })
    }}
    inventory()
    function order(){
    if($dashboard_orders.length > 0){
        $.ajax({
            url: '/dashboard/orders/get',
            method: "GET",
            contentType: 'application/json'
        }).done(function(orders){
            list_orders.push(...orders)
            displayOrders(orders, $dashboard_orders)
            $result.empty()
        $result.append(`<p class="product-length">Showing all ${orders.length} results</p>`)
        }).fail(function(){
             console.error("Error fetching orders:", error); // Log the error to the console
            alert('Error loading inventory. Please check the console for details.'); // More informative alert
        })
    }
    }
    order()
function displayOrders(orders, $grid){
         $grid.empty();

    orders.forEach(order => {
          let processing = order.status == "0" ? "selected" : "";
            let shipping = order.status == "1" ? "selected" : "";
            let succeed = order.status == "2" ? "selected" : "";
            let canceled = order.status == "3" ? "selected" : "";
             const editIcon = order.status == "0" ? `<i class="fas fa-edit text-primary m-auto edit-order"></i>` : '';
        $grid.append(`
           <tr>
                <td class="align-middle text-center">${order.order_id}</td>
                <td class="align-middle text-center">${order.created_at.slice(0, 10)} ${order.created_at.slice(11, 19)}</td>
                <td class="align-middle text-center">
                    <div class="item-detail d-flex align-items-center justify-content-center">
                        <p class="m-0 item-name">${order.user_name}</p>
                    </div>
                </td>
                <td class="align-middle text-center">${order.receiver_name}</td>
                <td class="align-middle text-center">${order.receiver_phone}</td>
                <td class="align-middle text-center">${order.detail + ', ' + order.ward + ', <br>' + order.district + ', ' + order.province}</td>
                <td class="align-middle text-center">${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>
                <td class="align-middle text-center">
                    <select class="order-status form-control text-center">
                        <option value="0" ${processing}>processing</option>
                        <option value="1" ${shipping}>shipping</option>
                        <option value="2" ${succeed}>succeed</option>
                        <option value="3" ${canceled}>canceled</option>
                    </select>
                </td>
                <td class="align-middle text-center">
                    <div class="order-actions">${editIcon}</div>
                    <input type="hidden" class="order-id" value="${order.order_id}">
                </td>
            </tr> 
        `);
    });
}

    function displayInventory(inventory, $grid){
        $grid.empty();
    inventory.forEach(item => {
        $grid.append(`
          <tr>
            <td scope="row" class="align-middle text-center">
                ${item.product_id}
            </td>
            <td class="align-middle text-center">  
             <div class="item-detail d-flex align-items-center justify-content-center">  
                <img src="${item.image}" alt="${item.name}" width="50" class="rounded-3 me-2 lazy-load">  
              </div>
            </td>
             <td class="align-middle text-center">${item.name}</td>
            <td class="align-middle text-center">${item.sku}</td>
            <td class="align-middle text-center">${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
            <td class="align-middle text-center">${item.quantity}</td>
            <td class="align-middle text-center">
                 ${item.created_at.slice(0, 10)}  ${item.created_at.slice(11, 19)} 
                </td>
            <td class="align-middle text-center">
                 <div style="cursor: pointer">
                    <input type="hidden" value="${item.sku}">
                    <i class="fas fa-edit text-primary m-auto" id="edit-sku" ></i>
                    <i style="font-size:20px; color: red" class="fa" id="delete-sku"></i> 
                </div>
            </td>
          </tr>   
        `);
    });
}
      function displayDashboardProducts(products, $grid) {
        $grid.empty();
        products.forEach(product => {
            let activeSelected = product.status == "1" ? "selected" : "";
            let disactiveSelected = product.status == "O" ? "selected" : ""; // Or !== "1"
            $grid.append(`
              <tr>
                <td scope="row" class=" align-middle text-center">
                    ${product.id}
                </td>
                <td class="align-middle text-center">  
                  <div class="item-detail d-flex align-items-center justify-content-center">  
                    <img src="${product.image}" alt="${product.name}" width="50" class="rounded-3 me-2 lazy-load">  
                  </div>
                </td>
                <td class="align-middle text-center ">${product.name}</td>
                <td class="align-middle text-center">${product.category}</td>
                <td class="align-middle text-center">${product.subcategory}</td>
                <td class="align-middle text-center">
                 ${product.created_at.slice(0, 10)}  ${product.created_at.slice(11, 19)} 
                </td>
                <td class="align-middle text-center">
                 <select name="product-status" class="product-status form-control text-center">   
                 <option value="0" ${disactiveSelected}>Disactive</option>
                <option value="1" ${activeSelected}>Active</option>
              </select>
                </td>
                <td class="align-middle text-center">
                     <div style="cursor: pointer">
                        <input type="hidden" value="${product.id}">
                        <i class="fas fa-edit text-primary m-auto" id="edit-product"></i>
                    </div>
                </td>
              </tr>   
            `);
        });
    }
    function displayDashboardUsers(users, $grid) {
    $grid.empty();

    users.forEach(user => {
        $grid.append(`
          <tr>
            <td scope="row" class=" align-middle text-center">
                ${user.id}
            </td>
            <td class="align-middle text-center">  
              ${user.first_name}
            </td>
            <td class="align-middle text-center">${user.last_name}</td>
            <td class="align-middle text-center">${user.email}</td>
            <td class="align-middle text-center">${user.phone_number}</td>
            <td class="align-middle text-center">${user.birth_of_date}</td>
            <td class="align-middle text-center">
                 ${user.created_at.slice(0, 10)}  ${user.created_at.slice(11, 19)} 
                </td>
            <td class="align-middle text-center">
                 <div style="cursor: pointer">
                    <input type="hidden" value="${user.id}">
                    <i class="fas fa-edit text-primary m-auto" id="edit-user-info" ></i>
                </div>
            </td>
          </tr>   
        `);
    });
}

    //button event
$("#dashboard-login-form").submit(function(event) {
    event.preventDefault();

    const username = $("#username").val();
    const password = $("#password").val();


    // Option 1: Send JSON (for DRF @api_view)
    $.ajax({
        url: '/dashboard/login/post',
        method: "POST",
        data: JSON.stringify({ username: username, password: password }),  // Use userName if that's what your serializer expects
        contentType: 'application/json',
    }).done(function(response) { // Include the response for more informative success handling
        console.log("Login successful:", response);
        window.location.href = '/dashboard/';
    }).fail(function(error) {
        console.error("Login failed:", error.responseJSON); // Log the error details!
        alert('Login failed. Check the console for details.');
    });


});
    //filter product

  $("#dashboard-products-name, .sort-products-time, .category-filter, .subcategory-filter").on("change, input", function (e) {
    const products = filterProducts(list_products); // Assuming 'list_products' is defined
    displayDashboardProducts(products, $dashboard_products);

    $result.empty(); // Clear the previous result message
    $result.append(`<p class="product-length">Showing all ${products.length} results</p>`);
});

function filterProducts(products) {
    let filteredProducts = [...products];
    const productName = $('#dashboard-products-name').val().toLowerCase();

    if (productName !== '') {
        filteredProducts = filteredProducts.filter(product => product.name.toLowerCase().includes(productName));
    }

    const selected_category = $('.category-filter').val();
    if (selected_category !== '') {
        filteredProducts = filteredProducts.filter(product => product.category === selected_category);
        console.log(filteredProducts)
    }


    const selected_subcategory = $('.subcategory-filter').val()
    console.log(filteredProducts)
    console.log(selected_subcategory)
    if (selected_subcategory !== '') {
        filteredProducts = filteredProducts.filter(product => product.subcategory === selected_subcategory);
        console.log(filteredProducts)
    }

    const selectedSort = $('.sort-products-time').val();
    switch (selectedSort) {
        case 'latest':
            filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            console.log(filteredProducts)
            break;
        case 'oldest':
            filteredProducts.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            console.log(filteredProducts)
            break;
    }

    return filteredProducts;
}

    //filter sku
     $("#sku-name, .sort-inventory-price-time").on("change, input", function (e) {
        const skus = filterSkus(list_inventory);
        displayInventory(skus, $inventory)
         $result.empty()
        $result.append(`<p class="product-length">Showing all ${skus.length} results</p>`)
    })
    function filterSkus(inventory) {
         let filteredProductSku = [...inventory];
          // Filter by Product Name
        const skuName = $('#sku-name').val().toLowerCase();
        if (skuName !== '') {
            filteredProductSku = filteredProductSku.filter(item => item.name.toLowerCase().includes(skuName)||
            item.sku.toLowerCase().includes(skuName));
        }
          const selectedSort = $('.sort-inventory-price-time').val();
    switch (selectedSort) {
        case 'latest':
            filteredProductSku.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'oldest':
            filteredProductSku.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case 'price-low':
                filteredProductSku.sort((a, b) => a.price - b.price);
                console.log(filteredProductSku)
                break;
            case 'price-high':
                filteredProductSku.sort((a, b) => b.price - a.price);
                console.log(filteredProductSku)
                break;
    }
        return filteredProductSku;
        }

        //filter user
     $("#user-name, .sort-user-time").on("change, input", function (e) {
        const users = filterUsers(list_users)
        displayDashboardUsers(users, $dashboard_users);
        $result.empty()
        $result.append(`<p class="product-length">Showing all ${users.length} results</p>`)
    })
    function filterUsers(users) {
         let filteredUsers = [...users];
          // Filter by Product Name
        const userName = $('#user-name').val().toLowerCase();
        if (userName !== '') {
            filteredUsers = filteredUsers.filter(user =>
            user.first_name.toLowerCase().includes(userName) ||
            user.last_name.toLowerCase().includes(userName) ||
            user.email.toLowerCase().includes(userName) ||
            user.phone_number.toString().includes(userName)
        )
        }
          const selectedSort = $('.sort-user-time').val();
    switch (selectedSort) {
        case 'latest':
            filteredUsers.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'oldest':
            filteredUsers.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
    }
        return filteredUsers;
        }

    // filter order
     $("#order-input, .sort-order-time-price").on("change, input", function (e) {
    const orders = filterOrders(list_orders);
    displayOrders(orders, $dashboard_orders);
    $result.empty()
        $result.append(`<p class="product-length">Showing all ${orders.length} results</p>`)
});

function filterOrders(orders) {
    let filtered_orders = [...orders];

    const orderInput = $('#order-input').val().toLowerCase();
    if (orderInput !== '') {
        filtered_orders = filtered_orders.filter(order =>
            order.order_id.toString().includes(orderInput) ||
            order.user_name.toLowerCase().includes(orderInput) ||
            order.receiver_name.toLowerCase().includes(orderInput) ||
            order.receiver_phone.toString().includes(orderInput) ||
            order.detail.toLowerCase().includes(orderInput) ||
            order.ward.toLowerCase().includes(orderInput) ||
            order.district.toLowerCase().includes(orderInput) ||
            order.province.toLowerCase().includes(orderInput)
        );
    }

    const selectedSort = $('.sort-order-time-price').val();
    switch (selectedSort) {
        case 'latest':
            filtered_orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        case 'oldest':
            filtered_orders.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
            break;
        case 'price-low':
            filtered_orders.sort((a, b) => parseInt(a.total) - parseInt(b.total)); // Convert to numbers for sorting
            break;
        case 'price-high':
            filtered_orders.sort((a, b) => parseInt(b.total) - parseInt(a.total)); // Convert to numbers for sorting
            break;
    }

    return filtered_orders;
}
function addUniqueProductsFilterOptions(filterValues, $selectElement) {
    const existingOptions = new Set($selectElement.find('option').map((_, option) => $(option).val()).get());

    filterValues.forEach(value => {
      if (!existingOptions.has(value)) {
        $selectElement.append(`<option value="${value}">${value}</option>`);
        existingOptions.add(value);
      }
    });
  }
  function imageToBase64(imgElement, callback) {
    if (typeof FileReader === 'undefined') {
        console.error("FileReader API not supported.");
        callback(null);
        return;
    }

    const file = imgElement.files[0];
    if (!file ) { //Check if a file was selected
        console.error('No image selected.');
        callback(null);
        return;
    }

    // Get file extension or default to "image/jpeg"
    const fileType = file.type || 'image/jpeg';  // Default to JPEG

     const reader = new FileReader();

    reader.onload = function (event) {
        const base64String = event.target.result;

        // Construct the data URL with the determined file type
        const base64DataUrl = `data:${fileType};base64,${base64String.split(',')[1]}`;

        callback(base64DataUrl); // Return data URL with file type
    };

    reader.onerror = function (error) {
        console.error('Error reading image:', error);
        callback(null);
    };

    reader.readAsDataURL(file);
}
$('#add-more-img').click(function(){
    $('.img-input').append('<input type="file" class="form-control mb-1 product-img" >')
})
     $('#product-subCategory, #new-product-subCategory').on('change',function() {
        if ($(this).val() === 'add') {
            $('#add-subCategory').modal('show'); // Use Bootstrap's modal('show')
            $(this).val(''); // Reset dropdown
            $("#add-product").modal('hide');
              $("#update-product").modal('hide');
        }
    });
    $('.product-category').on('change',function() {
        if ($(this).val() === 'add') {
            $('#add-category').modal('show'); // Use Bootstrap's modal('show')
            $(this).val(''); // Reset dropdown
            $("#add-subCategory").modal('hide');
             $("#add-product").modal('hide');
             $("#update-product").modal('hide');

        }else if($(this).val() !==''){
            const parentId = $(this).val()
             $.ajax({
            url: `/dashboard/subcategory/get/${parentId}`,
            method: 'GET',
            contentType: 'application/json'
            }).done(function(categories){
                $('#product-subCategory').empty()
                   $('#product-subCategory').append(`
                    <option value="">Select Sub Category</option>
                <option value="add">Add Sub Category</option>
                   `)
                 $('#new-product-subCategory').empty()
                   $('#new-product-subCategory').append(`
                    <option value="" selected>Select Sub Category</option>
                    <option value="add">Add Sub Category</option>
                   `)
               categories.forEach(category =>{
                $('#product-subCategory').append(`<option value="${category.id}">${category.name}</option>`);
                $('#new-product-subCategory').append(`<option value="${category.id}">${category.name}</option>`);
            });
        }).fail(function(){
            alert('fail to call api categories')
        })
        }
    });

 let imageFiles = []; // Array to store image Base64 strings
    // Handle add product
    $('#btn-add-product').click(function() {
        imageFiles = []; // Clear imageFiles array when button is clicked
        let productName = $('#product-name').val();
        let subCategory = $('#product-subCategory').val();
        let description = $('#product-description').val();
        let summary = $('#product-summary').val();
        let imgElements = $('.product-img')
        let numImages = imgElements.length;
        let processedImages = 0

        // Function to send data after all image processing is complete.
        function sendProductData(){
            const productData = {
                name: productName,
                 sub_category_id: subCategory,
                image: imageFiles,
                description: description,
                summary: summary
            };
            $.ajax({
                url: '/dashboard/products/add',  // Your API endpoint
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(productData),
                 headers: {
                    'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if needed
                }
            }).done(function(response) {
                // Product added successfully
                alert("Product added successfully");
                $('#add-product').modal('hide'); // Close the modal
                // ... any other actions you want to perform (e.g., refresh product list)
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert("Failed to add Product: " + errorThrown);
                console.error(jqXHR, textStatus, errorThrown); // Log errors for debugging
            });
        }
        if (numImages > 0) { // Check if there are any image inputs.
            imgElements.each(function() {
                imageToBase64(this, function(base64String) {
                    if (base64String) {
                        imageFiles.push(base64String);
                    }
                    processedImages++;
                    // Check if all images have been processed.
                    if(processedImages === numImages){
                        sendProductData();
                    }
                });
            });
        }else{ //Send product data without images
            sendProductData();
        }
    });
    $('#btn-add-subcategory').click(function() {  // Assuming this is the Add button in your modal
        let category = $('#product-category').val();
        let subcategoryName = $('#new-subCategory').val();
        let description = $('#subCategory-description').val();
        const subCategoryData = {
            name: subcategoryName,
            description: description,
            parent_id: category, // Use the category ID directly
        };
        $.ajax({
            url: '/dashboard/subcategory/add',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(subCategoryData),
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
        }).done(function(response) {
            // Subcategory added successfully
            alert("Subcategory added successfully");
            // Update the subcategory dropdown on the product form
            $('#product-subCategory').append(`<option value="${response.sub_category_id}" selected>${subcategoryName}</option>`);
            $('#add-subCategory').modal('hide'); // Close the modal
             $('#product-category').val(''); // Reset category select
            $('#new-subCategory').val('') // Reset the input value
            $('#subCategory-description').val('')
             // ... any other actions you want to perform (e.g., refresh category list)
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to add Sub Category: " + errorThrown);
            console.error(jqXHR, textStatus, errorThrown); // Log errors for debugging
            // Handle errors and display appropriate messages to the user
            if (jqXHR.responseJSON && jqXHR.responseJSON.name) {
              $('.summary-message').text(jqXHR.responseJSON.name[0]); // Display error on page
            }
             if (jqXHR.responseJSON && jqXHR.responseJSON.parent_id) {
              $('.category-message').text(jqXHR.responseJSON.parent_id[0]); // Display error on page
            }
            if(jqXHR.responseJSON && jqXHR.responseJSON.description){
               $('.subCategory-des-message').text(jqXHR.responseJSON.description[0]);
            }
        });
    });
    $('#btn-add-category').click(function() {
        let categoryName = $('#new-category').val();
        let description = $('#Category-description').val();

        const categoryData = {
            name: categoryName,
            description: description,
        };

        $.ajax({
            url: '/dashboard/category/add', // Your API endpoint
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(categoryData),
            headers: {
                'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if using Django
            }
        }).done(function(response) {
            alert("Category added successfully");
            product()
            // Update product add modal select options
            $('#product-category').append(`<option value="${response.category_id}" selected>${categoryName}</option>`);
            // Update product filter select options
            $('.category-filter').append(`<option value="${categoryName}" selected>${categoryName}</option>`);

            // Close and reset the modal
            $('#add-category').modal('hide');
            $('#new-category').val(''); // Clear category input
            $('#Category-description').val(''); // Clear description input
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert("Failed to add Category: " + errorThrown);
            console.error("Add category error:", jqXHR, textStatus, errorThrown);
             if (jqXHR.responseJSON && jqXHR.responseJSON.name) {
              $('.category-message').text(jqXHR.responseJSON.name[0]); // Display error message
            }
             if (jqXHR.responseJSON && jqXHR.responseJSON.description) {
              $('.Category-des-message').text(jqXHR.responseJSON.description[0]); // Display error message
            }
        });
 })
     $dashboard_products.on("change", ".product-status", function() {
    const newStatus = $(this).val();
    const productId = $(this).closest("tr").find("input[type='hidden']").val();

    console.log(`Product ID: ${productId}, New Status: ${newStatus}`);

    // Now send an AJAX request to your server to update the product status
    $.ajax({
        url: `/dashboard/products/status/update`, // Replace with your update URL
        method: "POST", // Or whichever method your API uses
        data: {
            id: productId,
            status: newStatus
        },
         headers: {
                'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if using Django
            }
    }).done(function(response){
            alert(response.message)
        }).fail(function(){
            alert("error")
    })
    })
let id_imgs_delete = [];
let initialProductData = {};

$dashboard_products.on("click", "#edit-product", function () {
    const productId = $(this).closest("tr").find("input[type='hidden']").val();
    $.ajax({
        url: `/dashboard/products/detail/${productId}`,
        method: 'get',
        contentType: 'application/json'
    }).done(function (detail) {
        initialProductData = detail;
        // Populate the modal fields with the retrieved data
        $("#new-product-name").val(detail.name);

        $("#new-product-description").val(detail.description);
        $("#new-product-summary").val(detail.summary);
        $('.product-category').val(detail.category)
        $.ajax({
            url: `/dashboard/subcategory/get/${detail.category}`,
            method: 'GET',
            contentType: 'application/json'
            }).done(function(categories){
                 $('#new-product-subCategory').empty()
                   $('#new-product-subCategory').append(`
                    <option value="" selected>Select Sub Category</option>
                    <option value="add">Add Sub Category</option>
                   `)
               categories.forEach(category =>{
                $('#new-product-subCategory').append(`<option value="${category.id}">${category.name}</option>`);
            });
                 $("#new-product-subCategory").val(detail.subcategory);
        }).fail(function(){
            alert('fail to call api categories')
        })


        $("#old-img").empty(); // Clear previous images
        detail.images.forEach(img =>
            $("#old-img").append(`
                <tr>
                    <td class="align-middle text-center">  
                      <div class="item-detail d-flex align-items-center justify-content-center">  
                        <img src="${img.image}" alt="" width="100" class="rounded-3 me-2 lazy-load">  
                      </div>
                    </td>
                    <td class="align-middle text-center ">
                        <input type="hidden" class="img-id" value="${img.id}">
                        <i style="font-size:20px; color: red; cursor:pointer;" class="fa delete-img"></i>
                    </td>
                </tr>
            `)
        );

        // Event handler for deleting images (delegated)
        $("#old-img").on("click", ".delete-img", function () {
            const $row = $(this).closest("tr");
            const imgId = $row.find(".img-id").val();
            id_imgs_delete.push(imgId);
            $row.remove();

            console.log("Images to delete:", id_imgs_delete);
        });

    }).fail(function () {
        alert('error')
    });
    $('#update-product').modal('show');
});

$('#add-img').click(function () {
    $('.new-img-input').append('<input type="file" class="form-control mb-1 new-product-img" >');
});
$("#btn-update-product").click(function () {
    const updatedProductData = {
        name: $("#new-product-name").val(),
        subcategory: $("#new-product-subCategory").val(),
        description: $("#new-product-description").val(),
        summary: $("#new-product-summary").val(),
        images_to_delete: id_imgs_delete,
    };
    const newImagePromises = [];

    $(".new-product-img").each(function () {
        const imgElement = this;
        const promise = new Promise(function (resolve) {
            imageToBase64(imgElement, function (base64) {
                resolve(base64 || null);  // Resolve with base64 or null if error/no image
            });
        });
        newImagePromises.push(promise);
    });

    Promise.all(newImagePromises).then(function (newImages) {
        newImages = newImages.filter(img => img !== null); // Filter out null values

        if (newImages.length > 0) {
            updatedProductData.new_images = newImages;
        }

        if (haveDataChanges(initialProductData, updatedProductData) || newImages.length > 0 || updatedProductData.images_to_delete.length > 0) {
            $.ajax({
                url: `/dashboard/products/update/${initialProductData.id}`,
                method: "POST",
                data: JSON.stringify(updatedProductData),
                contentType: "application/json",
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                success: function (response) {
                    // Handle success
                    $('#update-product').modal('hide');
                    location.reload();
                    id_imgs_delete = [];
                    initialProductData = {};
                    $(".new-product-img").remove(); // Clear new image input fields
                },
                error: function (error) {
                    console.error("Error updating product:", error);
                    // ... any error handling you need ...
                }
            });
        } else {
            console.log("No changes to update.");
        }
    })
});

$(".add-sku").click(function() {

    $.ajax({
        url: '/dashboard/products/get',
        method: "GET",
        contentType: 'application/json'
    }).done(function (products) {

        console.log(products);
        products.forEach(product => {
            $("#product-info").append(`<option value="${product.id}">${product.name}</option>`);
        });
    }).fail(function () {
        alert('error')
    })
})

$("#btn-add-sku").click(function() {
    const productId = $("#product-info").val();
    const sku = $("#product-sku").val();
    const quantity = $("#sku-quantity").val();
    const price = $("#sku-price").val();
    const color = $("#sku-color").val();
    const size = $("#sku-size").val();

    // Validation (important!)
    if (!productId || !sku || !quantity || !price) {  // Add other required fields
        alert("Please fill in all required fields.");
        return; // Stop further execution
    }


    const data = {
        product_id: productId,
        sku: sku,
        quantity: quantity,
        price: price,
        color: color,
        size: size
    };

    $.ajax({
        url: '/dashboard/sku/add',
        method: "POST",
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
    }).done(function(response) {
        console.log("SKU added successfully:", response);

        // Clear form after success
        $("#product-sku").val("");
        $("#sku-quantity").val("");
        $("#sku-price").val("");
        $("#sku-color").val("");
        $("#sku-size").val("");


        // More user-friendly success feedback (optional)
       // Replace alert with a modal, or update a status message on the page.
        inventory()
        alert("SKU added successfully!");

    }).fail(function(error) {
        console.error("Error adding SKU:", error);
        // More informative error handling (display specific error messages if available)
        if (error.responseJSON && error.responseJSON.error) {  // Example: check for a JSON error message from the server.
          alert("Error: " + error.responseJSON.error);
        } else {
          alert("Error adding SKU. Check the console for details.");
        }

    });
});
$(document).on('click', '#delete-sku', function() {
    let sku = $(this).closest("tr").find("input[type='hidden']").val();
    const $row = $(this).closest('tr');
    $.ajax({
        url: `/dashboard/sku/delete/${sku}`,
        method: 'POST',
        contentType: 'application/json',
         headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
    }).done(function(response){
        $row.remove()
        alert(response.message)
    }).fail(function(){
        alert("delete error")
    })
});

$(document).on('click', '#edit-sku', function() {
    const $row = $(this).closest("tr");
    const skuId = $(this).closest("tr").find("input[type='hidden']").val();
     // Initialize outside AJAX call

    $("#update-sku").modal('show');
    $("#update-product-info").empty(); // Clear dropdown before populating
    $("#update-product-sku, #update-sku-quantity, #update-sku-price, #update-sku-color, #update-sku-size").val("");

    $.ajax({
        url: '/dashboard/products/get',
        method: "GET",
        contentType: 'application/json'
    }).done(function(products) {
        products.forEach(product => {
            $("#update-product-info").append(`<option value="${product.id}">${product.name}</option>`);
        });
    }).fail(function() {
        alert('Error fetching products');
    });

    $.ajax({
        url: `/dashboard/sku/get/${skuId}`,
        method: "GET",
        contentType: 'application/json'
    }).done(function(sku) {
        initialProductData = sku;

        $("#update-product-info").val(sku.product_id);
        $("#update-product-sku").val(sku.sku);
        $("#update-sku-quantity").val(sku.quantity);
        $("#update-sku-price").val(sku.price);
        $("#update-sku-color").val(sku.color);
        $("#update-sku-size").val(sku.size);
    }).fail(function() {
        alert("Error fetching SKU details");
    });
});

$("#btn-update-sku").click(function() {
    if (!initialProductData) {  // Check if initial data was loaded
        alert("SKU data not loaded. Please try again.");
        return;
    }

    const newData = {
        product_id: parseInt($("#update-product-info").val()),
        sku: $("#update-product-sku").val(),
        color: $("#update-sku-color").val(),
        size: $("#update-sku-size").val(),
        quantity: parseInt($("#update-sku-quantity").val()),
        price: parseFloat($("#update-sku-price").val())
    };

    console.log(initialProductData.sku)
    if (haveDataChanges(initialProductData, newData)) {
        $.ajax({
            url: `/dashboard/sku/update/${initialProductData.sku}`, // Use ID, not SKU
            method: 'PUT', // Use PUT for update (not POST)
            data: JSON.stringify(newData),
            contentType: 'application/json',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
        }).done(function(response) {
            $("#update-sku").modal('hide');
            // Update table row with newData
             alert('Update success!')
        }).fail(function(error) {
            console.error("Error updating SKU:", error);
            alert("Error updating SKU. Check the console for details.");
        });
    } else {
        alert("No changes detected.");
    }
});
$dashboard_orders.on('change', ".order-status",function(){
    const orderId = $(this).closest("tr").find("input[type='hidden']").val();
    const newStatus = $(this).val()
    $.ajax({
        url: `/dashboard/order/status/update`, // Replace with your update URL
        method: "POST", // Or whichever method your API uses
        data: {
            id: orderId,
            status: newStatus
        },
         headers: {
                'X-CSRFToken': getCookie('csrftoken') // Include CSRF token if using Django
            }
    }).done(function(response){
        order()
            alert(response.message)
        }).fail(function(){
            alert("error")
    })
})
 let orderId = 0
$(document).on('click', '.edit-order', function() {
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
         orderId = $(this).closest("tr").find("input[type='hidden']").val();
      $.ajax({
          url:`/dashboard/order/detail/${orderId}`,
          method:'get',
          contentType:'application/json'
      }).done(function(order){
          initialProductData = {
            receiver_name: order.receiver_name,
            receiver_phone: order.receiver_phone,
            detail: order.detail,
            province: order.province,
            district: order.district,
            ward: order.ward
        };
          $("#receiver-name").val(`${order.receiver_name}`)
          $("#receiver-phone").val(`${order.receiver_phone}`)
          $("#address-detail").val(`${order.detail}`)
        const province = order.province;
        const district = order.district;
        const ward = order.ward;
        if(province && district && ward){
            $.ajax({
                url: `${host}?depth=1`,
                type: "GET",
                dataType: "json",
                success: (provinces) => {
                  const provinceCode = provinces.find(p => p.name === province)?.code;
                  if (provinceCode) {
                    $('#province-option').val(provinceCode);
                    $('#province-option').trigger('change'); // Trigger change to populate districts

                    setTimeout(() => { // Give time for district to load
                      const districtCode = $('#district-option option').filter((i, el) => $(el).text() === district).val();
                      if (districtCode) {
                        $('#district-option').val(districtCode);
                        $('#district-option').trigger('change'); // Trigger change to populate wards
                        setTimeout(() => { // Give time for ward to load
                          $('#ward-option').val($('#ward-option option').filter((i, el) => $(el).text() === ward).val());
                        }, 200); // adjust timeout as needed
                      }
                    }, 200); // adjust timeout as needed
                  }
                }
              });
        }

    }).fail(function(error) {
        console.error("Error fetching order details:", error);
        alert("Error fetching order details.");
    });
   $('#edit-order').modal('show');
})
    $("#edit-order-info").click(function(){
        const newData = {
            receiver_name:  $("#receiver-name").val(),
            receiver_phone: $("#receiver-phone").val(),
            detail: $("#address-detail").val(),
            province:  $('#province-option').find('option:selected').text(),
            district: $('#district-option').find('option:selected').text(),
            ward:  $('#ward-option').find('option:selected').text()
        }
        console.log(initialProductData)
        console.log(newData)
        if(haveDataChanges(initialProductData, newData)){
            $.ajax({
                url:`/dashboard/order/update/${orderId}`,
                method:'PUT',
                data: JSON.stringify(newData),
                contentType: 'application/json',
                 headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
            }).done(function(response){
                alert(response.message)
            }).fail(function(){
                alert('error')
            })
        }
        else{
            alert("No changes detected.");
        }
    })
      function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
    function isValidVietnamesePhoneNumber(phoneNumber) {
    return /^(?:\+84|0084|0)[235789]\d{8,9}$/.test(phoneNumber);
  }
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
 $("#btn-add-user").click(function(e){
    e.preventDefault()
    const fname = $("#fname").val().trim()
    const lname = $("#lname").val().trim()
    let birth_of_date = $("#birth_of_date").val()
    // birth_of_date = dateFormat(birth_of_date, 'MM-dd-yyyy')
    const email= $("#email").val().trim()
    const phone_number = $("#phone_number").val().trim()
    const password = $("#password").val().trim()
    const password2 = $("#confirm_password").val().trim()
    const gender = $("#user-gender").val().trim()
    if (!validateRegisterForm(fname, lname, birth_of_date, email, phone_number, password, password2)){
    return;
   }
    const data ={
      first_name:fname,
      last_name: lname,
      birth_of_date:birth_of_date,
      email:email,
      password:password,
      phone_number:phone_number,
        gender:gender
    }
    console.log(data)
    $.ajax({
      url: '/dashboard/user/add',
      method: 'POST',
      data: data,
      dataType: "json",
      headers: { "X-CSRFToken":getCookie('csrftoken') },
    }).done(function(response){
        user()
      alert(response.message)
    }).fail(function(response){
      alert(response.message)
    })
  })
    let userID = 0;
    $dashboard_users.on('click', '#edit-user-info', function(){
        userID = $(this).closest("tr").find("input[type='hidden']").val();
        $.ajax({
            url:`/dashboard/user/get/${userID}`,
            method:'get',
            contentType:'application/json'
        }).done(function(user){
            initialProductData = user
            $("#new-fname").val(`${user.first_name}`)
            $("#new-lname").val(`${user.last_name}`)
            $("#new-birth_of_date").val(`${user.birth_of_date}`)
            // birth_of_date = dateFormat(birth_of_date, 'MM-dd-yyyy')
            $("#new-email").val(`${user.email}`)
            $("#new-phone_number").val(`${user.phone_number}`)
            $("#new-password").val(`${user.password}`)
            $("#new-user-gender").val(`${user.gender}`)
        }).fail(function(){
            alert('error')
        })
        $("#update-user").modal('show')
    })
    $("#btn-update-user").click(function(){
        const fname = $("#new-fname").val()
            const lname = $("#new-lname").val()
            let birth_of_date = $("#new-birth_of_date").val()
            // birth_of_date = dateFormat(birth_of_date, 'MM-dd-yyyy')
            const email= $("#new-email").val()
            const phone_number = $("#new-phone_number").val()
            const password = $("#new-password").val()
            const password2 = $("#new-confirm_password").val()
            const gender = $("#new-user-gender").val()
        const newData = {
            first_name: fname,
            last_name: lname,
            phone_number: phone_number,
            email: email,
            birth_of_date: birth_of_date,
            password: password,
            gender: gender
        }
        console.log(newData)
        console.log(initialProductData)
        if(haveDataChanges(initialProductData, newData)){
            $.ajax({
                url:`/dashboard/user/update/${userID}`,
                method:'PUT',
                data: JSON.stringify(newData),
                contentType: 'application/json',
                 headers: {
                'X-CSRFToken': getCookie('csrftoken')
            }
            }).done(function(response){
                user()
                alert(response.message)
            }).fail(function(){
                alert('error')
            })
        }else{
            alert("No changes detected.");
        }
    })
});