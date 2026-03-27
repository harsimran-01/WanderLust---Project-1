function initMap() {
    const lat = coordinates[1];
    const lng = coordinates[0];

    const location = { lat, lng };

    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: location,
    });

    const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: listingTitle,
        animation: google.maps.Animation.DROP,
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
            <div style="padding: 6px 10px;">
                <h6 style="margin: 0; font-size: 15px;">📍 ${listingTitle}</h6>
            </div>
        `,
    });

    // Open on click
    marker.addListener("click", () => {
        infoWindow.open(map, marker);
    });

    // Open automatically when page loads
    infoWindow.open(map, marker);
}