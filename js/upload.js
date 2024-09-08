// Function to post upload data to a specified URL and handle the response
function uploadData(url, data, successMsg) {
    $.ajax({
        url: url,
        type: "POST",
        data: data,
        success: function (response) {
            console.log(response);
            // If the response is successful (equals 1), show a success message using Swal
            if (response == 1) {
                Swal.close();
                Swal.fire({
                    icon: "success",
                    title: successMsg,
                    showConfirmButton: false,
                    timer: 2500,
                    background: '#f1f5f9',
                    color: '#45f3ff',
                });
            }
        },
    });
}

// Function to read uploaded file content and return parsed JSON data
function fileRead(input, callback) {
    const file = new FileReader();
    file.readAsText(input.files[0]);
    file.onload = function (e) {
        callback(JSON.parse(e.currentTarget.result));
    };
    file.onerror = function () {
        console.log(file.error); // Log error if any
    };
}

// Handle the stores upload process
function storesUpload(input) {
    fileRead(input, function (data) {
        console.log(data.elements);

        // Map through the elements and filter out stores without names
        // Then prepare the upload data
        const upload = data.elements
            .filter(function (store) {
                return store.tags.name !== undefined;
            })
            .map(function (store) {
                return {
                    id: store.id,
                    name: store.tags.name,
                    lat: store.lat,
                    lon: store.lon
                };
            });

        // On clicking the upload button for stores, initiate the data upload
        document.getElementById("firstCardBtn").addEventListener("click", function () {
            Swal.fire({ title: "Upload in progress . . . ", showConfirmButton: false, background: '#f1f5f9', color: '#45f3ff' });
            uploadData("./php/uploadStores.php", { data: JSON.stringify(upload) }, "File uploaded!");
        });
    });
}

// Handle the categories and products upload process
function catsUpload(input) {
    fileRead(input, function (data) {
        const categories = [];
        const subcategories = [];

        // Populate categories and subcategories arrays from the uploaded data
        data.categories.forEach(function (category) {
            categories.push({ id: category.id, name: category.name });
            category.subcategories.forEach(function (subcategory) {
                subcategories.push({
                    id: subcategory.uuid,
                    name: subcategory.name,
                    categoryId: category.id
                });
            });
        });

        // On clicking the upload button for categories and products, initiate the data upload
        document.getElementById("secondCardBtn").addEventListener("click", function () {
            Swal.fire({ title: "Upload in progress . . . ", showConfirmButton: false, background: '#f1f5f9', color: '#45f3ff' });
            uploadData(
                "./php/uploadCat.php",
                {
                    categories: JSON.stringify(categories),
                    subcategories: JSON.stringify(subcategories),
                    products: JSON.stringify(data.products),
                },
                "File uploaded!"
            );
        });
    });
}

// Handle the prices upload process
function pricesUpload(input) {
    fileRead(input, function (data) {
        // Fetch products data for matching with uploaded price data
        $.getJSON("./php/products.php", { subcategory: 1 }, function (products) {
            const upload = [];

            // Match product names and populate the upload array with price details
            data.data.forEach(function (dato) {
                products.forEach(function (product) {
                    if (product.product_name === dato.name) {
                        dato.prices.forEach(function (price) {
                            upload.push({
                                id: product.product_id,
                                date: price.date,
                                price: price.price
                            });
                        });
                    }
                });
            });

            // On clicking the upload button for prices, initiate the data upload
            document.getElementById("thirdCardBtn").addEventListener("click", function () {
                Swal.fire({ title: "Upload in progress . . . ", showConfirmButton: false, background: '#f1f5f9', color: '#45f3ff' });
                uploadData("./php/uploadPrices.php", { data: JSON.stringify(upload) }, "File uploaded!");
            });
        });
    });
}

// Makes the layer of the cards stay there when hovering
document.querySelectorAll(".card").forEach(function (card) {
    card.addEventListener("mouseover", function () {
        let layer = card.querySelector(".layer");
        layer.classList.add("show-layer");
    });
});
