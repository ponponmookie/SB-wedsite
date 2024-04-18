google.charts.load('current', {
    'packages': ['corechart', 'bar']
});
google.charts.setOnLoadCallback(loadTable);

//// Category option
var typelist;
var options;

const xhttp = new XMLHttpRequest();
xhttp.open("GET", "http://localhost:3000/Category/");
xhttp.send();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        typelist = JSON.parse(this.responseText);

        options += "<option disabled selected value> -- select an option -- </option>"

        for (let i = 0; i < typelist.length; i++){
            // console.log(typelist[i].name)
            let opt = "<option value=" + typelist[i].name + ">" + typelist[i].name + "</option>"
            options += opt
        }
        ShowEditBox(id);
    }
}

var auth = { status: false, user: null }
checkAuth();

//// CheckAuth ตรวจสอบ username และ password 
function checkAuth() {
    if (Boolean(localStorage.getItem("auth")) === true) {
        auth.status = true;
        auth.user = localStorage.getItem("user");
        document.getElementById("searchBar").style = "display: block";
        // document.getElementById("user").innerHTML = "Logout";
        document.getElementById("bodyContent").innerHTML =
            "<div class='table-responsive'>" +
            "<table class='table styled-table table-hover '>" +
            "<thead>" +
            "<tr>" +
            "<th scope='col'>#</th>" +
            "<th scope='col'>Customer</th>" +
            "<th scope='col'>Age</th>" +
            "<th scope='col'>Gender</th>" +
            "<th scope='col'>Item Purchased</th>" +
            "<th scope='col'>Category</th>" +
            "<th scope='col'>Purchase Amount (USD)</th>" +
            "<th scope='col'>Shipping Type</th>" +
            "<th scope='col'>Discount Applied</th>" +
            "<th scope='col'></th>" +
            "</tr>" +
            "</thead>" +
            "<tbody id='mytable'>" +
            "</tbody>" +
            "</table>"
            "</div>" +

        loadTable();

    } else {
        document.getElementById("searchBar").style = "display: none";
        // document.getElementById("user").innerHTML = "";
        document.getElementById("bodyContent").innerHTML =
            "<div class='card align-middle m-3 mx-auto' style='width: 20rem;'>" +
            "<div class='card-header bg-secondary text-light m-3'>" +
            "<span class='d-inline'><i class='bi bi-person-square me-2'></i>" +
            "ลงชื่อเข้าใช้งาน</span>" +
            "</div>" +
            "<div class='card-body'>" +
            "<div class='mb-3'><label for='username' class='form-label float-start'>Username:</label>" +
            "<input class='form-control' id='username' placeholder='username'></div>" +
            "<div class='mb-3'><label for='password' class='form-label float-start'>Password:</label>" +
            "<input class='form-control' id='password' type='password' placeholder='password'></div>" +
            "<a onclick='Login()' class='btn btn-secondary float-end'>เข้าสู่ระบบ</a>" +
            "</div>" +
            "</div>" 
    }
}

function Login() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/Users/login/");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        'user': document.getElementById("username").value,
        'pass': document.getElementById("password").value,
    }));
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) { // เช็ค status จาก server ถ้ากรอกผิดมันจะขึ้น status 
                const objects = JSON.parse(this.responseText);
                Swal.fire(
                    'Good job!',
                    'Login Successfully!',
                    'success'
                )
                localStorage.setItem("auth", true);
                localStorage.setItem("user", objects['username']);
                checkAuth();
            } else {
                Swal.fire(
                    'Error!',
                    'The username or password is incorrect',
                    'error'
                )
            }
        }
    };
}


function Logout() {
    auth.status = false;
    auth.user = null;
    localStorage.removeItem('auth');
    localStorage.removeItem('user');
    checkAuth();
}


// กรณีที่ไม่ได้มีการค้นหา
function loadTable() {
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Shopping");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText);
            for (let object of objects) {

                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['Customer ID'] + '</td>';
                trHTML += '<td>' + object['Age'] + '</td>';
                trHTML += '<td>' + object['Gender'] + '</td>';
                trHTML += '<td>' + object['Item Purchased'] + '</td>';
                trHTML += '<td>' + object['Category'] + '</td>';
                trHTML += '<td>' + object['Purchase Amount (USD)'] + '</td>';
                trHTML += '<td>' + object['Shipping Type'] + '</td>';
                trHTML += '<td>' + object['Discount Applied'] + '</td>';
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="ShowEditBox(\'' + object['_id'] + '\')"><i class="fas fa-edit"></i></a>';
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="ShoppingDelete(\'' + object['_id'] + '\')"><i class="fas fa-trash"></i></a></td>';
                trHTML += "</tr>";

                num++;
            }
            document.getElementById("mytable").innerHTML = trHTML;

            loadGraph();
        }
    };
}

//กรณีที่มีการค้นหา 
function loadQueryTable() {
    document.getElementById("mytable").innerHTML = "<tr><th scope=\"row\" colspan=\"5\">Loading...</th></tr>";
    const searchText = document.getElementById('searchTextBox').value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Shopping/shipping_type/" + searchText);

    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var trHTML = '';
            var num = 1;
            const objects = JSON.parse(this.responseText).Shopping;
            for (let object of objects) {
                trHTML += '<tr>';
                trHTML += '<td>' + num + '</td>';
                trHTML += '<td>' + object['Customer ID'] + '</td>';
                trHTML += '<td>' + object['Age'] + '</td>';
                trHTML += '<td>' + object['Gender'] + '</td>';
                trHTML += '<td>' + object['Item Purchased'] + '</td>';
                trHTML += '<td>' + object['Category'] + '</td>';
                trHTML += '<td>' + object['Purchase Amount (USD)'] + '</td>';
                trHTML += '<td>' + object['Shipping Type'] + '</td>';
                trHTML += '<td>' + object['Discount Applied'] + '</td>';
                trHTML += '<td>';
                trHTML += '<a type="button" class="btn btn-outline-secondary" onclick="ShowEditBox(\'' + object['_id'] + '\')"><i class="fa-solid fa-edit"></i></a>';
                trHTML += '<a type="button" class="btn btn-outline-danger" onclick="ShoppingDelete(\'' + object['_id'] + '\')"><i class="fa-solid fa-trash"></i></a></td>';
                trHTML += "</tr>";
                num++;


            }
            console.log(trHTML);
            document.getElementById("mytable").innerHTML = trHTML;

        }
    };
}

////โหลดกราฟเขียนกราฟ
function loadGraph() {
    var clothing = 0;
    var accessories = 0;
    var footwaer = 0;
    var outerwear = 0;
    
    // var fall = 0;
    // var winter = 0;
    // var spring = 0;
    // var summer = 0;

    var pants = 0;
    var coat = 0;
    var handbag = 0;
    var sweater = 0;
    var sandals = 0;
    var blouse = 0;
    var belt = 0;
    var jeans = 0;
    var socks = 0;
    var tshirt = 0;
    var gloves = 0;
    var hoodie = 0;
    var jewelry = 0;
    var shorts = 0;
    var skirt = 0;
    var sunglasses = 0;
    var backpack = 0;
    var shoes = 0;
    var dress = 0;
    var boots = 0;
    var scarf = 0;
    var shirt = 0;
    var sneakers =0;

    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Shopping/");
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            // Loop เก็บค่าใน filed ชื่อ "Company response to consumer" ใน MongoDBว่ามีcaseไหนบ้างให้ +1 เข้าไป
            for (let object of objects) { 
                switch (object['Category']) {
                    case "Clothing":
                        clothing = clothing + 1;
                        break;
                    case "Accessories":
                        accessories = accessories + 1;
                        break;
                    case "Footwear":
                        footwaer = footwaer + 1;
                        break;
                    case "Outerwear":
                        outerwear = outerwear + 1;
                        break;
                }
                // Loop เก็บค่าใน filed ชื่อ "Submitted via" ใน MongoDB ว่ามี case ไหนบ้างให้ +1 เข้าไป
                // switch (object['Season']) {
                //     case "Fall":
                //         fall = fall + 1;
                //         break;
                //     case "Winter":
                //         winter = winter + 1;
                //         break;
                //     case "Spring":
                //         spring = spring + 1;
                //         break;
                //     case "Summer":
                //         summer = summer + 1;
                //         break;
                // }

                switch (object['Item Purchased']) {
                    case "Pants":
                        pants = pants + 1;
                        break;
                    case "Coat":
                        coat = coat + 1;
                        break;
                    case "Handbag":
                        handbag = handbag + 1;
                        break;
                    case "Sweater":
                        sweater = sweater + 1;
                        break;
                    case "Sandals":
                        sandals = sandals + 1;
                        break;
                    case "Blouse":
                        blouse = blouse + 1;
                        break;   
                    case "Belt":
                        belt = belt + 1;
                        break; 
                    case "Jeans":
                        jeans = jeans + 1;
                        break;
                    case "Socks":
                        socks = socks + 1;
                        break;
                    case "T-shirt":
                        tshirt = tshirt + 1;
                        break;
                    case "Gloves":
                        gloves = gloves + 1;
                        break;
                    case "Hoodie":
                        hoodie = handbag + 1;
                        break;
                    case "Jewelry":
                        jewelry = jewelry + 1;
                        break;   
                    case "Shorts":
                        shorts = shorts + 1;
                        break;        
                    case "Skirt":
                        skirt = skirt + 1;
                        break;
                    case "Dress":
                        dress = dress + 1;
                        break;
                    case "Boots":
                        boots = boots + 1;
                        break;
                    case "Scarf":
                        scarf = scarf + 1;
                        break;
                    case "Shirt":
                        shirt = shirt + 1;
                        break;
                    case "Sneakers":
                        sneakers = sneakers + 1;
                        break;   
                }
            }
            //กำหนดค่าใน piechart
            var CategoryResponseData = google.visualization.arrayToDataTable([
                ['Category', 'Case'],
                ['Clothing', clothing],
                ['Accessories', accessories],
                ['Footwear', footwaer],
                ['Outerwear', outerwear],
            ]);
            //สร้างชื่อ Piechart
            var optionsCategoryResponse = { title: 'Category Stats (Latest  3900 cases)',
                'width':450,
                'height':300,
            }; 
            //สร้าง piechart
            var chartCategoryResponse = new google.visualization.PieChart(document.getElementById('pieCategoryResponse'));
            chartCategoryResponse.draw(CategoryResponseData, optionsCategoryResponse);

            // var SeasonResponseData = google.visualization.arrayToDataTable([
            //     ['Season', 'Case'],
            //     ['Fall', fall],
            //     ['Winter', winter],
            //     ['Spring', spring],
            //     ['Summer', summer],
            // ]);
            // //สร้างชื่อ Piechart
            // var optionsSeasonResponse = { title: 'Season Stats (Latest  3900 cases)',
            //     'width':350,
            //     'height':300,
            // }; 
            // //สร้าง piechart
            // var chartSeasonResponse = new google.visualization.PieChart(document.getElementById('pieSeasonResponse'));
            // chartSeasonResponse.draw(SeasonResponseData, optionsSeasonResponse);

            //กำหนดค่าในBarchart
            var items = google.visualization.arrayToDataTable([
                // ['Item Purchased', 'Number', {role: 'style'}, {role: 'annotation'}],
                ['Item Purchased', 'Amount', {role: 'style'}],
                ['Pants', pants, 'FFA600'],
                ['Coat', coat, 'color: #F65A83'],
                ['Handbag', handbag, 'color: #F65A83'],
                ['Sweater', sweater, 'color: #008080'],
                ['Sandals', sandals, 'color: #6f00ff '],
                ['Blouse', blouse, 'color: #FFFF00'],
                ['Belt', belt, 'color: #F65A83'],
                ['Jeans', jeans, 'color: #FFA600'],
                ['Socks', socks, 'color: #F65A83'],
                ['T-shirt', tshirt, 'color: #008080'],
                ['Gloves', gloves, 'color: #F65A83'],
                ['Hoodie', hoodie, 'color: #6f00ff'],
                ['Jewelry', jewelry, 'color: #FFFF00'],
                ['Shorts', shorts, 'color: #FFA600'],
                ['Sunglasses', sunglasses, 'color: #F65A83'],
                ['Backpack', backpack, 'color: #F65A83'],
                ['Shoes', shoes, 'color: #F65A83'],
                ['Skirt', skirt, 'color: #F65A83'],
                ['Dress', dress, 'color: #F65A83'],
                ['Boots', boots, 'color: #F65A83'],
                ['Scarf', scarf, 'color: #008080'],
                // ['Sneakers', sneakers, 'color: #F65A83'],
            ]);
            // สร้างชื่อ Barchart
            var optionItems = {
                title: 'Item Purchased stats (Latest  3900 cases)',
                legend: { position: 'none' },
                'width':450,
                'height':300,
            };
            // สร้าง Barchart
            var chartItems = new google.visualization.BarChart(document.getElementById('barchartItems'));
            chartItems.draw(items, optionItems);
        }
    };
}


//// Create Function
function ShowCreateBox() {
    Swal.fire({
        title: 'Create Shopping-Behavior',
        html:  
            '<div class="mb-3"><label for="Customer_ID" class="form-label">Customer ID</label>' +
            '<input class="form-control" id="Customer_ID" placeholder="Customer ID"></div>' +
            
            '<div class="mb-3"><label for="Age" class="form-label">Age</label>' +
            '<input class="form-control" id="Age" placeholder="Age"></div>' +
            
            '<div class="mb-3"><label for="Gender" class="form-label">Gender</label>' +
            '<input class="form-control" id="Gender" placeholder="Gender"></div>' +
            
            '<div class="mb-3"><label for="Item_purchased" class="form-label">Item purchased</label>' +
            '<input class="form-control" id="Item_purchased" placeholder="Item purchased"></div>' +
            
            '<div class="mb-3"><label for="Category" class="form-label">Category</label>' +
            '<select class="form-control" id="Category" placeholder="Category">'+ options + '</select></div>' +
            
            '<div class="mb-3"><label for="Purchase_Amount_USD" class="form-label">Purchase Amount (USD)</label>' +
            '<input class="form-control" id="Purchase_Amount_USD" placeholder="Purchase Amount (USD)"></div>' +
            
            '<div class="mb-3"><label for="Shipping_Type" class="form-label">Shipping Type</label>' +
            '<input class="form-control" id="Shipping_Type" placeholder="Shipping Type"></div>' +
            
            '<div class="mb-3"><label for="Discount_Applied" class="form-label">Discount Applied</label>' +
            '<input class="form-control" id="Discount_Applied" placeholder="Yes or No"></div>',
            
        focusConfirm: false,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Confirm',
        preConfirm: () => {
            ShoppingCreate();
        }
    });
}

function ShoppingCreate() {
    const Customer_ID = document.getElementById("Customer_ID").value;
    const Age = document.getElementById("Age").value;
    const Gender = document.getElementById("Gender").value;
    const Item_purchased = document.getElementById("Item_purchased").value;
    const Category = document.getElementById("Category").value;
    const Purchase_Amount_USD = document.getElementById("Purchase_Amount_USD").value;
    const Shipping_Type = document.getElementById("Shipping_Type").value;
    const Discount_Applied = document.getElementById("Discount_Applied").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:3000/Shopping/create");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ 
        //JSON.stringify คือการแปลง ข้อมูลที่จะส่งไปยัง server เป็น  json ก่อน เพื่อให้ server สามารถอ่านข้อมูลได้
        // column ใน DB : ตัวแปรด้านบนที่เก็บค่าที่ user กรอก
        "Customer ID": Customer_ID,
        Age: Age,
        Gender: Gender,
        "Item Purchased": Item_purchased,
        Category: Category,
        "Purchase Amount (USD)": Purchase_Amount_USD,
        "Shipping Type": Shipping_Type,
        "Discount Applied": Discount_Applied,
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // const objects = JSON.parse(this.responseText);
                Swal.fire(
                    'Good job!',
                    'Create Successfully!',
                    'success'
                );
                loadTable();
            } else {
                Swal.fire(
                    'Error!',
                    'Failed to create the item.',
                    'error'
                );
            }
        }
    };
}

//// Delete Function
function ShoppingDelete(id) {
    console.log("Delete: ", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "http://localhost:3000/Shopping/delete");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({ //JSON.stringify() = converts a JavaScript object or value to a JSON string
        "_id": id
    }));
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                // const objects = JSON.parse(this.responseText);
                Swal.fire(
                    'Good job!',
                    'Delete Successfully!',
                    'success' // ประเภทของ Alert
                );
                loadTable(); // โหลดข้อมูลใหม่
            } else {
                Swal.fire(
                    'Error!',
                    'Failed to delete the item',
                    'error'
                );
            }
        }
    };
}

//// Edit function
function ShowEditBox(id) {
    console.log("edit", id);
    const xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:3000/Shopping/" + id);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const object = JSON.parse(this.responseText).object;

            console.log("ShowEditBox", object);

            var sl1, options1;
            options1 += "<option disabled selected value> -- select an option -- </option>"
            for (let i = 0; i < typelist.length; i++){
                if (typelist[i].name === object['Category']){ sl1 = "selected" } else { sl1 = "" };
                options1 += "<option value=" + typelist[i].name + " " + sl1 + ">" + typelist[i].name + "</option>"
            }

            Swal.fire({
                title: 'Edit Shopping-Behavior',
                html: 
                    '<input id="id" class="swal2-input" placeholder="Product" type="hidden" value="' + object['_id'] + '"><br>' +

                    '<div class="mb-3"><label for="Customer_ID" class="form-label">Customer ID</label>' +
                    '<input class="form-control" id=" Customer_ID" placeholder="Customer ID" value="' + object['Customer ID'] + '"></div>' +
                    
                    '<div class="mb-3"><label for="Age" class="form-label">Age</label>' +
                    '<input class="form-control" id="Age" placeholder="Age" value="' + object['Age'] + '"></div>' +
                    
                    '<div class="mb-3"><label for="Gender" class="form-label">Gender</label>' +
                    '<input class="form-control" id="Gender" placeholder="Gender" value="' + object['Gender'] + '"></div>' +
                    
                    '<div class="mb-3"><label for="Item_purchased" class="form-label">Item purchased</label>' +
                    '<input class="form-control" id="Item_purchased" placeholder="Item purchased" value="' + object['Item Purchased'] + '"></div>' +
                    
                    '<div class="mb-3"><label for="Category" class="form-label">Category</label>' +
                    '<select class="form-select form-select-sm" id="Category">' + options1 + '</select></div>' +
                    
                    '<div class="mb-3"><label for="Purchase_Amount_USD" class="form-label">Purchase Amount (USD)</label>' +
                    '<input class="form-control" id="Purchase_Amount_USD" placeholder="Purchase Amount (USD)" value="' + object['Purchase Amount (USD)'] + '"></div>' +
                    
                    '<div class="mb-3"><label for="Shipping_Type" class="form-label">Shipping Type</label>' +
                    '<input class="form-control" id="Shipping_Type" placeholder="Shipping Type" value="' + object['Shipping Type'] + '"></div>' +
                    
                    '<div class="mb-3"><label for="Discount_Applied" class="form-label">Discount Applied</label>' +
                    '<input class="form-control" id="Discount_Applied" placeholder="Discount Applied" value="' + object['Discount Applied'] + '"></div>',
    
                focusConfirm: false,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Confirm',
                preConfirm: () => {
                    userEdit();
                }
            });
        }
    };

}

function userEdit() {
    const id = document.getElementById("id").value;
    const Customer_ID = document.getElementById(" Customer_ID").value;
    const Age = document.getElementById("Age").value;
    const Gender = document.getElementById("Gender").value;
    const Item_purchased = document.getElementById("Item_purchased").value;
    const Category = document.getElementById("Category").value;
    const Purchase_Amount_USD = document.getElementById("Purchase_Amount_USD").value;
    const Shipping_Type = document.getElementById("Shipping_Type").value;
    const Discount_Applied = document.getElementById("Discount_Applied").value;

    const xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:3000/Shopping/update");
    xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhttp.send(JSON.stringify({
        "_id": id,
        "Customer ID": Customer_ID,
        Age: Age,
        Gender: Gender,
        "Item Purchased": Item_purchased,
        Category: Category,
        "Purchase Amount (USD)": Purchase_Amount_USD,
        "Shipping Type": Shipping_Type,
        "Discount Applied": Discount_Applied,
    }));

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            const objects = JSON.parse(this.responseText);
            if (objects) {
                Swal.fire(
                    'Good job!',
                    'Edit Successfully!',
                    'success'
                )
            } else {
                Swal.fire(
                    'Error!',
                    'Failed to edit information',
                    'error'
                )
            }
            loadTable();
        }
    };
}
