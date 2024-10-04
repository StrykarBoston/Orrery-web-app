// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Sun setup
const sunTexture = new THREE.TextureLoader().load('/img/sun.jpg');
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ 
  map: sunTexture, 
  color: 0xffdd00 
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Create a ring around the Sun
const sunRingGeometry = new THREE.RingGeometry(2.1, 2.3, 32);
const sunRingMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.5
});
const sunRing = new THREE.Mesh(sunRingGeometry, sunRingMaterial);
sunRing.rotation.x = Math.PI / 2; // Rotate the ring to lie flat
scene.add(sunRing);

// Earth setup
const earthTexture = new THREE.TextureLoader().load('/img/earth.jpg');
const earthGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const earthMaterial = new THREE.MeshBasicMaterial({ 
  map: earthTexture, 
  color: 0x0000ff 
});
const earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.x = 5;
scene.add(earth);

// Create a ring around the Earth
const earthRingGeometry = new THREE.RingGeometry(0.6, 0.8, 32);
const earthRingMaterial = new THREE.MeshBasicMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.5
});
const earthRing = new THREE.Mesh(earthRingGeometry, earthRingMaterial);
earthRing.position.x = 5;
earthRing.rotation.x = Math.PI / 2; // Rotate the ring to lie flat
scene.add(earthRing);

// Celestial body function
const createCelestialBody = (size, color, distance) => {
  const geometry = new THREE.SphereGeometry(size, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: color });
  const body = new THREE.Mesh(geometry, material);
  body.position.x = distance;
  scene.add(body);
  return body;
};

// Add stars around the Sun and Earth
const addStars = () => {
  const starGeometry = new THREE.BufferGeometry();
  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff, // White stars
    size: 0.05 // Small size for stars
  });

  const starVertices = [];
  for (let i = 0; i < 1000; i++) {  // Number of stars
    const x = (Math.random() - 0.5) * 1000; // Randomize position
    const y = (Math.random() - 0.5) * 1000;
    const z = (Math.random() - 0.5) * 1000;
    starVertices.push(x, y, z);
  }

  starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
  
  const stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
};

// Call the function to add stars
addStars();

let bodies = [];
const createBodies = (data) => {
  data.near_earth_objects[Object.keys(data.near_earth_objects)[0]].forEach((neo) => {
    const size = Math.random() * 0.2 + 0.1;
    const distance = Math.random() * 5 + 3;
    const body = createCelestialBody(size, 0x00ff00, distance);
    bodies.push(body);
  });
};

// Fetch Near Earth Objects (NEO) data
const fetchNEOData = async () => {
  const response = await fetch('/neo');
  const data = await response.json();
  createBodies(data);
};

let angle = 0;
const earthSpeed = 0.01; // Adjust this value to control the speed of Earth's orbit

const animate = () => {
  requestAnimationFrame(animate);
  bodies.forEach((body, index) => {
    body.position.x += 0.01 * index;
  });

  // Update Earth's position and rotation to revolve around the Sun
  earth.position.x = 5 * Math.cos(angle);
  earth.position.z = 5 * Math.sin(angle);
  earth.rotation.y = angle;

  angle += earthSpeed; // Increment the angle by the earthSpeed value

  renderer.render(scene, camera);
};

camera.position.z = 10;
fetchNEOData();

// Create a raycaster object
const raycaster = new THREE.Raycaster();

// Add event listener to the renderer
document.addEventListener('click', (event) => {
  // Get the mouse position
  const mousePosition = new THREE.Vector2();
  mousePosition.x = (event.clientX / window.innerWidth) * 2 - 1;
  mousePosition.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Update the raycaster
  raycaster.setFromCamera(mousePosition, camera);

  // Check if the raycaster intersects with the Sun
  const intersects = raycaster.intersectObjects([sun]);
  if (intersects.length > 0) {
    // Get the Sun information
    const sunInfo = {
      name: 'Sun',
      description: 'The star at the center of our solar system',
      temperature: '5500°C',
      radius: '696,000 km'
    };

    // Update the information panel with the Sun's information
    document.getElementById('body-name').textContent = sunInfo.name;
    document.getElementById('body-info').textContent = sunInfo.description + '\nTemperature: ' + sunInfo.temperature + '\nRadius: ' + sunInfo.radius;

    // Show the information panel
    document.getElementById('info-panel').classList.remove('hidden');
  } else {
    // Hide the information panel if the user clicks outside the Sun
    document.getElementById('info-panel').classList.add('hidden');
  }
});

animate();
