(function () {
    "use strict";
    window.addEventListener("load", function () {  
        const cat = document.getElementById("inputCategory");
        const subCat = document.getElementById("inputSubcategory");
        const prd = document.getElementById("inputProduct");
        const price = document.getElementById("inputPrice");
        const submit = document.getElementById("submit");
        const validateForm = document.querySelectorAll(".validation");
        const spc = new URLSearchParams(window.location.search),
        store = spc.get("store");
        
        //Request categories from server
        $.post("./php/categories.php").done(function (data) {
          getCategories(data);}, "json");

          /* Creates and appends an option to the given dropdown element
          * Parameteres
          * htmlElement - the dropdown element to append the option
          * value - value of the option
          * text - the display value
          */
          function dropDown(element, value, text) {
            let option = document.createElement("option");
            option.value = value;
            option.text = text;
            element.appendChild(option);
        }

        /* Populates a dropdown with data using specified fields for
        * value and text
        */
        function populateDropdown(element, data, valueField, textField) {
            empty(element);
            data.map(item => dropDown(element, item[valueField], item[textField]));
        }

        // Handles the population of the categories dropdown
        function getCategories(result) {
            populateDropdown(cat, result, 'category_id', 'name');
            cat.addEventListener("change", getSubcats);
        }
        
        // Fecthes the subcategories of each category
        function getSubcats() {
            subCat.removeAttribute("disabled");
        
            $.post("./php/subcategories.php", {
                category: cat.value,
            }).done(data => subCats(data));
        }
        // Populates the subcategories dropdown and sets up product fetching
        function subCats(result) {
            populateDropdown(subCat, result, 'subcategory_id', 'name');
            populateDropdown(prd, [], '', '');  // To clear product dropdown
            subCat.addEventListener("change", getProds);
        }
        // Gets the products of each subcategory
        function getProds() {
            prd.removeAttribute("disabled");
            $.get("./php/products.php", {
                subcategory: subCat.value,
            }).done(data => prds(data));
        }
        // Populates the products dropdown
        function prds(result) {
            populateDropdown(prd, result, 'product_id', 'product_name');
        }
        
        validateForm.forEach(form => {
          form.addEventListener("submit", function (event) {
              event.preventDefault();
              if (form.checkValidity() === false) {
                  event.stopPropagation();
              } else {
                  evaluateAndSubmitOffer();
                  form.classList.add("was-validated");
              }
          });
      });
      

        /*
        * Computes the score based on the average prices and current price.
        * After the score is computed, an offer is uploaded if certain conditions are met.
        * */
        function evaluateAndSubmitOffer() {
          let scorePoints = 0;
          let avgWeeklyPrice = 0;
          let lastDayPrice = 0;
          let allowSubmission = true;
      
          $.post("./php/prices.php", {
              store: store,
              price: price.value,
              product: prd.value,
          }).done(function (data) {
              // Calculate weekly average and the last day's price
              if (data[1].length) {
                  data[1].map((data) => {
                      avgWeeklyPrice += parseFloat(data.price);
                  });
                  avgWeeklyPrice /= data[1].length;
                  lastDayPrice = data[1][data[1].length - 1].price;
      
                  // Determine the points based on price comparison
                  if (price.value <= lastDayPrice - lastDayPrice * 0.2) {
                      scorePoints = 50;
                  } else if (price.value < avgWeeklyPrice * 0.8) {
                      scorePoints = 20;
                  } else {
                      scorePoints = 0;
                  }
              }
      
              // Ensure that a similar offer has not been previously submitted
              if (data[1].length) {
                let existingOffer = data[1].find((data) => {
                    return data && data.product_id == prd.value && data.store_id == store;
                });
    
                if (existingOffer) {
                    // If existing offer is found and new price isn't at least 20% cheaper
                    if (!(parseFloat(price.value) < parseFloat(existingOffer.price) * 0.8)) {
                        allowSubmission = false;
                    }
                }
              }
      
              // If all checks passed, upload the offer; else, notify user
              if (allowSubmission) {
                $.post("./php/uploadOffer.php", {
                    store: store,
                    price: price.value,
                    product: prd.value,
                    points: scorePoints,
                }).done(function(data) {
                    triggerFeedback("success");
                    reload_delay(2000);
                });
            } else {
                triggerFeedback("multi_submit");
            }
          });
      }
      },
      false
    );
  })();
  
  function empty(element) {
    element.options.length = 0;
  }
  
  //Helper function for success/fail message
  function triggerFeedback(indicator) {
    let config;
  
    if (indicator === "success") {
      config = {
        icon: 'success',
        title: 'Submission',
        text: 'You submitted an offer!',
        background: '#f1f5f9',
        timer: 2000,
        showConfirmButton: false
      };
    } else if (indicator === "multi_submit") {
      config = {
        icon: 'error',  
        title: 'Operation not allowed!',
        text: 'You can not sumbit an offer multiple times!',
        background: '#c0c2c9',
        timer: 2000,
        showConfirmButton: false
      };
    } else {
      return; // Invalid indicator
    }
  
    Swal.fire(config);
  }

  //Helper function for reload delay
  function reload_delay(duration){
    setTimeout(function() {
      location.reload(true);
  }, duration);   
  }