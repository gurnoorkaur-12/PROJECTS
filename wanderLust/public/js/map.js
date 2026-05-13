let lat = coordinates[1];
let lng = coordinates[0];

const map = L.map('map').setView([lat, lng], 16);

L.tileLayer(`https://api.thunderforest.com/atlas/{z}/{x}/{y}.png?apikey=${mapKey}`, {
    maxZoom: 18
}).addTo(map);
  
const icon = L.icon({
    iconUrl: '/images/home.svg',
    iconSize:     [40 , 40], 
    iconAnchor:   [20,20], 
});

const marker = L.marker([lat,lng], {icon: icon})
                .addTo(map)
                .bindPopup('Exact location provided after booking.');

let circle = L.circle([lat,lng], {
    color : 'transparent',
    fillColor: 'rgba(0, 0, 0, 0.21)',
    fillOpacity: 0.5,
    radius: 200
}).addTo(map);

    
