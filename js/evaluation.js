// Get the logged user details from localStorage
const logged_user = JSON.parse(localStorage.getItem("logged_user"));
const user_id = logged_user[0].user_id;

// Define variable to check if user is admin
const isAdmin = logged_user[0].isAdmin !== "0";

// Setup table and related variables
const $table = $("#discountsTable");
const exportData = [];

// Extract discount ID from the URL
const discount_id = new URLSearchParams(window.location.search).get("discount_id");

// Set visibility of delete button based on user's admin status
document.getElementById("deleteBtn").setAttribute("data-visible", isAdmin);

// threshold of user ability to like/dislike
const proximityThreshold = 1000;

// Fetch user's location
let userLat, userLon;

getCurrentPosition().then(position => {
    userLat = position.coords.latitude;
    userLon = position.coords.longitude;

    // Call the function to fetch the data and render the table
    $.post("./php/storeOffers.php", { input: discount_id.split(",") }).done(discounts);
});

// get the current position of the user
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

/*
 * Calculates the distance between two points on the Earth's surface given their
 * latitude and longitude.
 * 
 * Based on the Haversine formula it gives great-circle distances between 
 * two points
 * returns the distance between of the two points in meters
*/
function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // distance in meters
}

/*
 * Converts a value from degrees to radians.
 * 
 * This function is necessary because trigonometric functions in JavaScript 
 * operate in radians, not degrees.
 */
function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

function discounts(result) {
    result.forEach((offer) => {
        exportData.push({
            product: offer.product_name,
            product_id: offer.product_id,
            price: offer.price,
            date: offer.date.split(' ')[0], // to get only the date
            discount_id: offer.discount_id,
            likes: offer.likes,
            dislikes: offer.dislikes,
            inventory: offer.inventory,
            username: offer.username,
            overallScore: offer.overallScore,
            lat: offer.lat,   
            lon: offer.lon    
        });
    });
    $table.bootstrapTable({ data: exportData });
    $table.bootstrapTable("togglePagination");
}


/*
 * Generates buttons for liking and disliking offers based on their distance from the user.
 *
 * This function checks the distance of the offer from the user. If it's within 50m, 
 * it returns buttons for liking and disliking the offer. Otherwise, it returns a message
 * indicating either the offer is too far to be rated or the product is unavailable.
 */
function offerRatingButtons(value, row, index) {
    const offerLat = row.lat;
    const offerLon = row.lon;
    const distance = getDistanceFromLatLonInMeters(userLat, userLon, offerLat, offerLon);
    const inv = row.inventory;
    if (row.username === logged_user[0].username) {
        return `<div> <h2> Self-rating isn't allowed! </h2> </div>`
    }
    if (distance <= proximityThreshold && inv === "Yes") {
        return `
            <button id="like" class="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1 rounded-full like${index}" title="Like"></button>
            <button id="dislike" class="bg-red-500 hover:bg-red-600 text-white px-5 py-1 rounded-full dislike${index}" title="Dislike"></button>`;
    } else if (distance > proximityThreshold && inv === "Yes"){
      fireFeedback2("toofar", row.product);
        return ` <button id="like" class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1 rounded-full like${index}" title="Like" disabled></button>
        <button id="dislike" class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1 rounded-full dislike${index}" title="Dislike" disabled></button>`;
        ;
    } else {
      fireFeedback2("unavailable", row.product);
        return  ` <br><button id="like" class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1 rounded-full like${index}" title="Like" disabled></button>
        <button id="dislike" class="bg-gray-500 hover:bg-gray-600 text-white px-5 py-1 rounded-full dislike${index}" title="Dislike" disabled></button>`;
    ;}
}

function inventoryButton(value, row, index) {
    const inv = row.inventory;
    if (inv === "No") {
        return `<button id="inv" class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full inv${index}" title="In inventory"> Available </button>`;
    } else {
        return `<button id="inv" class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-full inv${index}" title="Not in inventory"> Unavailable </button>`;
    }
}

function deleteButton(value, row, index) {
    return `<button id="deleteBtn" class="bg-wh-500 hover:bg-red-600 text-white px-3 py-1 rounded-full">Delete</button>`;
}

// Event handlers for table action buttons
window.operateEvents = {
  // this updates the inventory -> sets available product 
  "click #inv": function (e, value, row) {
      const inv = row.inventory;
      if (inv === "No") {
        fireFeedback("inv");
      } else {
        fireFeedback("n/a");
      }
      
      $.post("./php/updateInventory.php", { id: row.product_id });
  },
  // this deletes an offer
  "click #deleteBtn": function (e, value, row) {
      fireFeedback("delete");
      $.post("./php/removeOffer.php", { id: row.product_id, username: row.username });
  },
  // this posts a like for an offer
  "click #like": function (e, value, row, index) {
      fireFeedback("like");
      toggleButtons(index, 'like', 'dislike');
      const newLikesCount = parseInt(row.likes) + 1;
      const userScoreChange = 5;
      $.post("./php/offerStats.php", {
          id: row.discount_id,
          username: row.username,
          count: newLikesCount,
          control: "1",
          scoreChange: userScoreChange,
          userId: user_id,
          userAction: "like"
      });
  },
  // posts a dislike for an offer
  "click #dislike": function (e, value, row, index) {
      fireFeedback("dislike");
      toggleButtons(index, 'dislike', 'like');
      const newDislikesCount = parseInt(row.dislikes) + 1;
      const userScoreChange = -1;
      $.post("./php/offerStats.php", {
          id: row.discount_id,
          username: row.username,
          count: newDislikesCount,
          control: "2",
          scoreChange: userScoreChange,
          userId: user_id,
          userAction: "dislike"
      });
  }
};



// Helper function to toggle like/dislike buttons
function toggleButtons(index, btnToDisable, btnToEnable) {
    $(`.${btnToDisable}${index}`).prop("disabled", true);
    $(`.${btnToEnable}${index}`).prop("disabled", false);
}

// Helper function for feedback regarding like/dislike/inventory
function fireFeedback(indicator) {
  let config;

  if (indicator === "like") {
    config = {
      icon: 'success',
      title: 'Liked!',
      text: 'You liked this offer!',
      background: '#f1f5f9',
      timer: 1500,
      showConfirmButton: false
    };
  } else if (indicator === "dislike") {
    config = {
      icon: 'error', // 
      title: 'Disliked!',
      text: 'You disliked this offer.',
      background: '#c0c2c9',
      timer: 1500,
      showConfirmButton: false
    };
  } else if (indicator === "inv") {
    config = {
      icon: 'info', // 
      title: 'Inventory',
      text: 'The product is now available',
      background: '#c0c2c9',
      timer: 1500,
      showConfirmButton: false
    };
  } else if (indicator === "n/a") {
    config = {
    icon: 'info', // 
    title: 'Inventory',
    text: 'The product is not available',
    background: '#c0c2c9',
    timer: 1500,
    showConfirmButton: false
    }
  } else if (indicator === "delete") {
    config = {
        icon: 'error', // 
        title: 'Delete',
        text: 'You deleted the offer',
        background: '#ff0000',
        timer: 1500,
        showConfirmButton: false
    };
  } else {
    return; // Invalid indicator
  }

  Swal.fire(config);
  setTimeout(function() {location.reload();}, 1500);
}

/*Helper function for feedback regarding like/dislike/inventory
* options that are related to distance between the user and the 
* offer and the availability of the product
*/
// This array will act as a queue to hold the configurations for alerts that need to be displayed.
let alertQueue = [];
// A Set to keep track of product names for which alerts have already been shown.
let alertedProducts = new Set();
function fireFeedback2(indicator, productName) {
    let config;
    // If the user has already been alerted about this product, exit w/o creating a new alert.
    if (alertedProducts.has(productName)) {
        return; 
    }
    alertedProducts.add(productName);
    // Configure the alert based on the feedback type.
    if (indicator === "unavailable") {
        config = {
            icon: 'info',
            title: 'Unavailable',
            text: productName + " is unavailable",
            background: '#c0c2c9',
            timer: 1500,
            showConfirmButton: false
        };
    } else if (indicator === "toofar") {
        config = {
            icon: 'info',
            title: 'Too far',
            text: "You are too far away to rate " + productName + "!",
            background: '#c0c2c9',
            timer: 1500,
            showConfirmButton: false
        };
    } else {
        return; // Invalid indicator
    }

    // Add the config to the queue
    alertQueue.push(config);
}

// Process the queue, runs every 2 seconds to process and show the alerts.
setInterval(() => {
    if (alertQueue.length > 0) {
        const config = alertQueue.shift(); // take the first config from the queue
        Swal.fire(config);
    }
}, 2000); // Show the next alert every 2 seconds