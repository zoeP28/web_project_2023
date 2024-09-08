window.onload = function () {
  // Variable initialization for various HTML elements and map configurations
  const storePin = $("#storeSelect");
  const catPin = $("#categorySelect");
  const storeBtn = $("#searchStore");
  const catBtn = $("#searchCategory");
  let displayedMarkers = [];
  let markersCluster = L.markerClusterGroup();
  var maptilerApiKey = 'fsiCWi4diRBhopKh4KVQ';
  let userLatLng; // this will help to calculate the distance to offers
  const proximityThreshold = 1000; // threshold of user ability to add offer 

  // Setting up the base layer of the map
  var maptile = L.tileLayer(
      'https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=' + maptilerApiKey, 
      {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>',
          maxZoom: 25
      }
  );

  var darktile = L.tileLayer(
    'https://api.maptiler.com/maps/streets-v2-dark/{z}/{x}/{y}.png?key=' + maptilerApiKey, 
    {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://www.maptiler.com/">MapTiler</a>',
        maxZoom: 25
    }
  );

  // Initializing the main map object
  var map = new L.Map("map", {
      center: new L.LatLng(38.246361, 21.734966),
      zoom: 15,
      layers: [maptile],
      zoomControl: false,
  });
  const userMarker = new L.layerGroup();
  map.addLayer(userMarker);
   

  //switch between night and day
    //switch between night and day
  var isDarkMode = false; 
  var ToggleLayersControl = L.Control.extend({
    options: {
        position: 'topright'
    },
    onAdd: function(map) {
        var button = L.DomUtil.create('button', 'toggle-button');
        button.innerText = 'Night';
        button.onclick = function() {
            if (!isDarkMode) {
                map.removeLayer(maptile);
                map.addLayer(darktile);
                button.innerText = 'Day';
            } else {
                map.removeLayer(darktile);
                map.addLayer(maptile);
                button.innerText = 'Night';
            }
            isDarkMode = !isDarkMode;
        }
        return button;
    }
  });
  new ToggleLayersControl().addTo(map);

  // Using the Geolocation API to get user's current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(userPin, showError);
  } else {
    // Alerting the user if geolocation isn't supported by their browser
    Swal.fire({
      icon: "error",
      title: "Location",
      text: "Geolocation is not supported by this browser!",
      background: '#c0c2c9',
      timer: 1500,
      showConfirmButton: false,
    });
  }

  // Function to handle geolocation errors
  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        Swal.fire({
          icon: "error",
          title: "Location",
          text: "Geolocation is not supported by this browser!",
          background: '#c0c2c9',
          timer: 1500,
          showConfirmButton: false,
        });
        break;
      case error.POSITION_UNAVAILABLE:
        Swal.fire({
          icon: "error",
          title: "Location",
          text: "Location can not be tracked!",
          background: '#c0c2c9',
          timer: 1500,
          showConfirmButton: false,
        });
        break;
      case error.TIMEOUT:
        Swal.fire({
          icon: "error",
          title: "Location",
          text: "Location  call timed out!",
          background: '#c0c2c9',
          timer: 1500,
          showConfirmButton: false,
        });
        break;
      case error.UNKNOWN_ERROR:
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Uknown error!",
          background: '#c0c2c9',
          timer: 1500,
          showConfirmButton: false,
        });
        break;
    }
  }

  // Initializing icons for various markers on the map
  const offerIcon = L.icon({
    iconUrl: "icons/offerIcon.png",
    iconSize: [30, 30],
  });
  const storeIcon = L.icon({
    iconUrl: "icons/store.png",
    iconSize: [38, 38],
  });
  const userIcon = L.icon({
    iconUrl: "icons/user.png",
    iconSize: [38, 38],
  });
  const storeWithOfferIcon = L.icon({
    iconUrl: "icons/discount.png",
    iconSize: [38,38],
  });

  let markerdata = [];
  let markers = {};

  // Function to show user's location on the map and fetch marker data
  function userPin(position) {
    let userLoc = L.marker([position.coords.latitude, position.coords.longitude], { icon: userIcon });
    userLoc.bindPopup("User Location");
    userLatLng = L.latLng(position.coords.latitude, position.coords.longitude);
    userMarker.addLayer(userLoc);
    map.setView([position.coords.latitude, position.coords.longitude], 15);

    var userLocationCircle = L.circle([position.coords.latitude, position.coords.longitude], {
      color: '#00C9E0',
      fillColor: '#e2e8f0',
      fillOpacity: 0.5,
      opacity: 0.5,
      radius: proximityThreshold 
    }).addTo(map);


    // Fetch marker data from the server
    const discountAjax = $.ajax({
      url: "./php/mapMarkers.php",
      method: "GET",
      dataType: "json",
      success: function (data) {
      },
    });

    discountAjax.done(offerPins);
  }

  function offerPins(res) {
    res.map((store, index) => {
      markerdata.push(index);
      const storeLatLng = L.latLng(store.lat, store.lon);
      let distance = userLatLng.distanceTo(storeLatLng);
      // Create a container for the marker popup content
      const container = $("<div />");
      markers[index] = L.marker([store.lat, store.lon], { icon: offerIcon });
      if (distance <= proximityThreshold) {
        container.html(
          `<button class="btn showOffer">View Offers</button><br><br><button class="btn submitOffer">Add Offer</button>`
        );
      } else {
        container.html(
          `<button class="btn showOffer">View Offers</button>`
        );
      }
      
      // Handle 'View Offers' button click
      container.on("click", ".showOffer", function () {
        let params = new URLSearchParams();
        params.append("discount_id", store.discount_id);
        let url = "./evaluation.html?" + params.toString();
        window.open(url);
      });
      // Handle 'Add Offer' button click
      container.on("click", ".submitOffer", function () {
        let params = new URLSearchParams();
        params.append("store", store.id);
        let url = "./submission.html?" + params.toString();
        window.open(url);
      });

      // Bind the marker to the popup and add to the map
      markers[index].bindPopup(container[0]);
      markers[index].addTo(map);
    });
  }

  // Fetch store names from the server
  const storesAjax = $.ajax({
    url: "./php/storeInfo.php",
    method: "POST",
    dataType: "json",
    success: function (data) {
    },
  });
  
  // Fetch store with discounts to display different icon
  let storesWithDiscount = {};
  const discountsAjax = $.getJSON("./php/storesWithOffers.php", function(data) {
    storesWithDiscount = data;
  });

  $.when(storesAjax, discountsAjax).done(storePois);

  function storePois(result) {
    storePin.append(new Option("Select Store", ""));
    // Populate the dropdown with the store names - from the storesAjax - result[0]
    result[0].forEach((store) => { 
      const optionText = `${store.store_name} (ID: ${store.store_id})`;
      storePin.append(new Option(optionText, store.store_id));
    });
    // Refresh the select picker
    storePin.selectpicker('destroy');
    storePin.selectpicker();
    // Handle store selection and show the corresponding marker on the map
    storeBtn.off("click").on("click", function() {
      removeLayers(markerdata); //remove initialized offers
      if (markersCluster) {
        markersCluster.clearLayers(); // remove previous clusters of offers
        map.removeLayer(markersCluster);
      }
      if (storePin.val() === "") {
        Swal.fire({
          icon: 'info', // 
          title: 'Select a store',
          text: 'You have not selected a store!',
          background: '#c0c2c9',
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        // Clear previously displayed markers
        for (let i = 0; i < displayedMarkers.length; i++) {
          map.removeLayer(displayedMarkers[i]);
        }
        displayedMarkers = []; // Clear the array

        let selectedStore = result[0].find(
          (store) => store.store_id === storePin.val()
        );
        let iconToUse = storeIcon; // default store icon
        if (storesWithDiscount[selectedStore.store_id]) {
          iconToUse = storeWithOfferIcon;  // Use the discount icon if the store has at least one dicount
        }
        let container = $("<div />");
        markers[markerdata.length] = L.marker(
          [selectedStore.lat, selectedStore.lon],
          {
            icon: iconToUse,
          }
        );

        //Populate the marker with the store details and action button
        container.html(
          `<button class="btn submitOffer">Add Offer</button>`
        );
        container.on("click", ".submitOffer", function () {
          let params = new URLSearchParams();
          params.append("store", selectedStore.store_id);

          let url = "./submission.html?" + params.toString();
          window.open(url);
        });

        // Bind the marker to the popup and add to the map
        markers[markerdata.length].bindPopup(container[0]);
        displayedMarkers.push(markers[markerdata.length]);
        markers[markerdata.length].addTo(map);
        map.setView([selectedStore.lat, selectedStore.lon], 15);
        markerdata[markerdata.length] = markerdata.length;
      }
    });
  } // End of store dropdown handling

  // Category dropdown handling
  const categoryAjax = $.ajax({
    url: "./php/categories.php",
    method: "POST",
    dataType: "json",
    success: function (data) {
      // Process the data if needed
    },
  });

  categoryAjax.done(categoryPois);

  function categoryPois(result) {
    catPin.append(new Option("Select Category", ""));
    // Populate the dropdown with the category names
    result.map((category) => {
      catPin.append(new Option(category.name, category.category_id));
    });
    catPin.selectpicker('destroy');
    catPin.selectpicker();
    catBtn.click(function () {
      if (catPin.val() === "") {
        Swal.fire({
          icon: "error",
          title: "Please select a Category",
        });
      } else {
        removeLayers(markerdata);
        markerdata = [];
      }
      const storeOfferAjax = $.ajax({
        url: "./php/storeOffers.php",
        method: "POST",
        dataType: "json",
        data: { input: catPin.val() },
        success: function (data) {
          if (!data || jQuery.isEmptyObject(data)) { 
            // jQuery.isEmptyObject will check if an object is empty
            Swal.fire({
              icon: 'info', // 
              title: 'No available offers!',
              text: 'There are no offers available for this category!',
              background: '#c0c2c9',
              timer: 1500,
              showConfirmButton: false
            });
        } else {
            categoryClusters(data);
        }
        },
      });

      storeOfferAjax.done(categoryClusters);
      
      function categoryClusters(result) {
        markersCluster.clearLayers();
        result.map((offer, index) => {
          markerdata.push(index);
          const offerLatLng = L.latLng(offer.lat, offer.lon);
          let distance = userLatLng.distanceTo(offerLatLng);
          let container = $("<div />");
          markers[index] = L.marker([offer.lat, offer.lon], { icon: offerIcon });
          if (distance <= proximityThreshold) {
            container.html(
              `<button class="btn showOffer">View Offers</button><br><br><button class="btn submitOffer">Add Offer</button>`
    
            );
          } else {
            container.html(
              `<button class="btn showOffer">View Offers</button>`
            );
          }
          container.on("click", ".showOffer", function () {
            let params = new URLSearchParams();
            params.append("discount_id", offer.discount_id);
            let url = "./evaluation.html?" + params.toString();
            window.open(url);
          });
          container.on("click", ".submitOffer", function () {
            let params = new URLSearchParams();
            params.append("store", offer.store_id);
            let url = "./submission.html?" + params.toString();
            window.open(url);
          });
          markers[index].bindPopup(container[0]);
          markersCluster.addLayer(markers[index]);
        });
       map.addLayer(markersCluster);
      }
    });
  } // End of category dropdown handling

  // Helper function to remove initialized offers upon location discovery
  function removeLayers(offers) {
    for (let i = 0; i < offers.length; i++) {
      let id = offers[i];
      let marker = markers[id];
      map.removeLayer(marker);
    }
  }

};