function hideLoadingScreen() {
  setTimeout(function () {
    document.getElementById("loading-screen").style.display = "none";
  }, 4000);
}

document.addEventListener("DOMContentLoaded", function () {
  // Wait for the DOM to be fully loaded

  // Simulate a delay (e.g., 3 seconds) before fading out the loading screen
  setTimeout(function () {
    // Fade out the loading screen
    document.getElementById("loading-screen").style.opacity = 0;
  }, 3000);
});

hideLoadingScreen();

var map = L.map("map", {
  center: [0, 0], // Centered map initially; you may adjust the center based on your data
  zoom: 2,
  minZoom: 0,
  maxZoom: 5,
  continuousWorld: false,
});

// Create tile layers for different maps
var streetsLayer = L.tileLayer("maps/streets/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 5,
  noWrap: true,
  continuousWorld: false,
});

var satelliteLayer = L.tileLayer("maps/sattelite/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 5,
  noWrap: true,
});
var meetIcon = L.icon({
  iconUrl: "pintest.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -20],
});
// Add the default layer to the map
satelliteLayer.addTo(map);

// Define an object for the base layers
var baseLayers = {
  Streets: streetsLayer,
  Satellite: satelliteLayer,
};

// Add a layer control to switch between base layers
L.control.layers(baseLayers).addTo(map);

map.invalidateSize();





// Load JSON data and create markers
// Load JSON data and create markers
fetch("markers.json")
  .then((response) => response.json())
  .then((data) => {
    const meetSpotsList = document.getElementById("meet-spots");
    const searchInput = document.getElementById("search-input");

    // Create an array to store markers
    const markers = [];

    data.forEach((markerData) => {
      // Extract marker data
      const { name, location, type, description, imagePath, capacity } =
        markerData;

      // Create a marker with a popup
      const marker = L.marker(location, { icon: meetIcon }).addTo(map);
      marker.bindPopup(`
        <h3>${name}</h3>
        <p>${description}</p>
        <img src="${imagePath}" alt="${name}" style="max-width: 200px;">
      `);

      // Add the marker to the array
      markers.push(marker);

      // Create a list item
      const listItem = document.createElement("li");
      listItem.innerHTML = `
      <div class="meet-spot-block">
  <div class="image-container">
    <img src="${imagePath || "placeholder.png"}" alt="${name} Image">
    <div class="text-overlay">
      <strong>${name}</strong>
    </div>
    </div>
    
    <h3 class="additional-info">${capacity} <span class="material-symbols-outlined">
    person
    </span> </h3>
</div>


      `;
      listItem.addEventListener("click", () => {
        // Zoom to the marker when list item is clicked
        map.setView(location, 15);
        // Open popup for the clicked marker
        marker.openPopup();
      });

      // Append the list item to the meet spots list
      meetSpotsList.appendChild(listItem);
    });

    // Add event listener for search input
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      // Filter the list items based on the search term
      const filteredItems = Array.from(meetSpotsList.children).filter((item) =>
        item.textContent.toLowerCase().includes(searchTerm)
      );
      // Show/hide list items based on the filter
      meetSpotsList.innerHTML = "";
      filteredItems.forEach((item) => meetSpotsList.appendChild(item));
    });

    // Optional: Zoom to fit all markers on the map
    if (markers.length > 0) {
      const group = new L.featureGroup(markers);
      map.fitBounds(group.getBounds());
    }
  })
  .catch((error) => console.error("Error fetching JSON:", error));
