
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
    }
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
    }
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
    }
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
function displayOrders(orders, $grid){
         $grid.empty();
    orders.forEach(order => {
        $grid.append(`
          <tr>
            <td scope="row" class="-button align-middle text-center">
                ${order.order_id}
            </td>
            <td class="align-middle text-center"> ${order.created_at.slice(0, 10)}  ${order.created_at.slice(11, 19)} </td>
            <td class="align-middle text-center">  
             <div class="item-detail d-flex align-items-center justify-content-center">  
                <input type="hidden" value="${order.user_id}"> 
                <p class="m-0 item-name">${order.user_name}</p> 
              </div>
            </td>
            <td class="align-middle text-center">${order.receiver_name}</td>
            <td class="align-middle text-center">${order.receiver_phone}</td>
            <td class="align-middle text-center">
            ${order.detail+', ' + order.ward+ ', </br>'+order.district+', '+order.province} 
            </td>
            <td class="align-middle text-center">${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>
            <td class="align-middle text-center">
                 <div style="cursor: pointer">
                    <input type="hidden" value="${order.order_id}">
                    <i class="fas fa-edit text-primary m-auto" ></i>
                    <i style="font-size:20px; color: red" class="fa"></i> 
                </div>
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
                <p class="m-0 item-name">${item.name}</p> 
              </div>
            </td>
            <td class="align-middle text-center">${item.sku}</td>
            <td class="align-middle text-center">${Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</td>
            <td class="align-middle text-center">${item.quantity}</td>
            <td class="align-middle text-center">
                 ${item.created_at.slice(0, 10)}  ${item.created_at.slice(11, 19)} 
                </td>
            <td class="align-middle text-center">
                 <div style="cursor: pointer">
                    <input type="hidden" value="${inventory.product_id}">
                    <i class="fas fa-edit text-primary m-auto" ></i>
                    <i style="font-size:20px; color: red" class="fa"></i> 
                </div>
            </td>
          </tr>   
        `);
    });
}
      function displayDashboardProducts(products, $grid) {
        $grid.empty();

        products.forEach(product => {
            $grid.append(`
              <tr>
                <td scope="row" class=" align-middle text-center">
                    ${product.id}
                </td>
                <td class="align-middle text-center">  
                  <div class="item-detail d-flex align-items-center justify-content-center">  
                    <img src="${product.image}" alt="${product.name}" width="50" class="rounded-3 me-2 lazy-load">  
                    <p class="m-0 item-name">${product.name}</p> 
                  </div>
                </td>
                <td class="align-middle text-center">${product.category}</td>
                <td class="align-middle text-center">${product.subcategory}</td>
                <td class="align-middle text-center">
                 ${product.created_at.slice(0, 10)}  ${product.created_at.slice(11, 19)} 
                </td>
                <td class="align-middle text-center">
                     <div style="cursor: pointer">
                        <input type="hidden" value="${product.id}">
                        <i class="fas fa-edit text-primary m-auto" ></i>
                        <i style="font-size:20px; color: red" class="fa"></i> 
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
                    <i class="fas fa-edit text-primary m-auto" ></i>
                    <i style="font-size:20px; color: red" class="fa"></i> 
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
});