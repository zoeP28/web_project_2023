window.onload = function () {
  // Get DOM elements
  const month_select = document.getElementById("month");
  const searchButton = document.getElementById("search");
  const ctx2 = document.getElementById('avgChart').getContext('2d');
  let currentWeekAverage;
  let previousWeekAverage;
  let averageDiscount;

  // Create Chart.js instance
  let ctx = document.getElementById("numberOfOffers").getContext("2d");
  let myChart = new Chart(ctx);

  // Making an AJAX request to fetch the categories from the server
  $.post("./php/categories.php").done(function(data) {
    const categoryDropdown = document.getElementById('categoryDropdown');
    data.forEach(category => {
        dropDown(categoryDropdown, category.category_id, category.name);
    });
  });

  // Helper function to create dropdown options and append them to the provided dropdown element.
  function dropDown(element, value, text) {
      let option = document.createElement("option");
      option.value = value;
      option.text = text;
      element.appendChild(option);
  }

  const myChart2 = new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Previous Week Average', 'Current Week Average', 'Average Discount'],
        datasets: [{
            label: 'Price',
            data: [previousWeekAverage, currentWeekAverage, averageDiscount],
            backgroundColor: [
                'rgba(75, 192, 192, 0.2)', // Previous week color
                'rgba(255, 99, 132, 0.2)', // Current week color
                'rgba(255, 206, 86, 0.2)' // Discount color
            ],
            borderColor: [
                'rgba(75, 192, 192, 1)', // Previous week color
                'rgba(255, 99, 132, 1)', // Current week color
                'rgba(255, 206, 86, 1)' // Discount color
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        },
        plugins: {
          legend: {
              display: false
          }
        }
      }
  }); 

  // Event listener for when a category is selected from the dropdown.
  const categoryDropdown = document.getElementById('categoryDropdown');
  categoryDropdown.addEventListener('change', function() {
    const selectedCategory = categoryDropdown.value;
    if (selectedCategory) {
        $.post("./php/averageDiscounts.php", {categoryId: selectedCategory}).done(function(data) {
            if (data.error) {
                console.error(data.error);
            } else {
                const currentWeekAverage = data.currentWeekAverage;
                const previousWeekAverage = data.previousWeekAverage;
                const averageDiscount = - data.averageDiscount;
                myChart2.data.labels = ['Previous Week Average', 'Current Week Average', 'Average Discount'];
                myChart2.data.datasets[0].data = [previousWeekAverage, currentWeekAverage, averageDiscount];
                myChart2.update();
                if (!previousWeekAverage && !currentWeekAverage) {
                  Swal.fire({
                      icon: 'info',
                      title: 'No discount!',
                      text: 'No discounts have been submitted in the past week!',
                      background: '#c0c2c9',
                      timer: 2000,
                      showConfirmButton: false
                  });
              }
            }
        });
    }
    });

  // Add click event listener to search button
  searchButton.addEventListener("click", function () {
    document.getElementById("chart").style.display = "block";
    getChartData("2023", parseInt(month_select.value, 10));
  });

  month_select.addEventListener("change", function() {
        searchButton.classList.remove("disabled"); 
  });

  // Fetch chart data from server
  function getChartData(year, month) {
    let firstDay = new Date(year, month, 2).toISOString().slice(0, 10);
    let lastDay = new Date(year, month + 1, 1).toISOString().slice(0, 10);
    $.post("./php/discounts.php", {
      firstDate: firstDay,
      lastDate: lastDay,
    }).done(function (data) {
      myChart.destroy();
      makeChart(data, month, year);
    });
  };

  // Generate and display the chart
  function makeChart(data, month, year) {
  const days = numberofDays(parseInt(month) + 1);
  const dates = monthDays(parseInt(year), parseInt(month) + 1);
  const chartData = [];

  // Count the number of offers for each day
  dates.forEach((d) => {
    const offersCount = data.filter((m) => m.date.split(" ")[0] === d).length;
    chartData.push(offersCount);
  });

  const labels = Array.from({ length: days }, (_, i) => i + 1);

  // Calculate the next month for the title - auto ginetai giati h js ksekinaei tous mhnes me index 0
  const nextMonth = (parseInt(month) + 1) % 12; // Increment month and wrap around if needed
  const displayMonth = nextMonth === 0 ? 12 : nextMonth;

    // Create the Chart.js configuration
    const config = {
      type: "bar",
      data: {
        labels: labels,
        datasets: [
          {
            label: "# of offers",
            data: chartData,
            backgroundColor: "rgba(54, 162, 235, 0.5)", // Light blue background color with transparency
            borderColor: "rgba(54, 162, 235, 1)", // Dark blue border color
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Number of Offers",
              font: {
                size: 16,
              },
            },
          },
          x: {
            title: {
              display: true,
              text: "Day of Month",
              font: {
                size: 16,
              },
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Hide legend
          },
          title: {
            display: true,
            text: `Number of Offers in ${displayMonth}/${year}`, // Display the next month
            font: {
              size: 20,
            },
          },
        },
      },
    };

    // Create new Chart instance
    myChart = new Chart(ctx, config);
  };
};

// Get the number of days in a month
function numberofDays(month) {
  return new Date(2023, month, 0).getDate();
}

// Get all days in a month as ISO strings
function monthDays(year, month) {
  const date = numberofDays(month);
  const dates = [];

  for (let i = 2; i <= date + 1; i++) {
    dates.push(new Date(year, month - 1, i).toISOString().slice(0, 10));
  }

  return dates;
}
