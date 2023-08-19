const imageInput = document.getElementById('imageInput');
const previewImage = document.getElementById('previewImage');
const hotspotsContainer = document.getElementById('hotspots');

let hotspots = [];
let selectedHotspotIndex = -1;

imageInput.addEventListener('change', function(event) {
    const selectedImage = event.target.files[0];
    if (selectedImage) {
        previewImage.src = URL.createObjectURL(selectedImage);
        hotspotsContainer.innerHTML = ''; // Clear existing hotspots
        hotspots = [];
        updateImagemapCode();
    }
});

previewImage.addEventListener('click', function(event) {
    const rect = this.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width * 100).toFixed(2);
    const y = ((event.clientY - rect.top) / rect.height * 100).toFixed(2);

    if (selectedHotspotIndex === -1) {
        selectedHotspotIndex = hotspots.length;
        const hotspotElement = document.createElement('div');
        hotspotElement.className = 'hotspot';
        hotspotElement.style.left = `${x}%`;
        hotspotElement.style.top = `${y}%`;

        hotspotsContainer.appendChild(hotspotElement);
        hotspots.push({ x, y, width: 0, height: 0, redirect: '#', title: '#' });
    } else {
        const selectedHotspot = hotspots[selectedHotspotIndex];
        const width = x - selectedHotspot.x;
        const height = y - selectedHotspot.y;
        selectedHotspot.width = Math.abs(width).toFixed(2);
        selectedHotspot.height = Math.abs(height).toFixed(2);
        selectedHotspot.x = width < 0 ? x : selectedHotspot.x;
        selectedHotspot.y = height < 0 ? y : selectedHotspot.y;
        selectedHotspotIndex = -1;
        updateImagemapCode();
    }
});

hotspotsContainer.addEventListener('click', function(event) {
    const clickedHotspot = event.target;
    const hotspotIndex = Array.from(hotspotsContainer.children).indexOf(clickedHotspot);

    if (hotspotIndex !== -1) {
        selectedHotspotIndex = hotspotIndex;
        const selectedHotspot = hotspots[selectedHotspotIndex];
        previewImage.style.pointerEvents = 'none';
        clickedHotspot.style.pointerEvents = 'none';
        clickedHotspot.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        clickedHotspot.style.width = `${selectedHotspot.width}%`;
        clickedHotspot.style.height = `${selectedHotspot.height}%`;
    }
});

function updateImagemapCode() {
    const imagemapCodeTextArea = document.getElementById('imagemapCode');
    let code = '[imagemap]\n';
    code += `${previewImage.src}\n`;

    for (const hotspot of hotspots) {
        if (hotspot.width > 0 && hotspot.height > 0) {
            code += `${hotspot.x} ${hotspot.y} ${hotspot.width} ${hotspot.height} ${hotspot.redirect} ${hotspot.title}\n`;
        }
    }

    code += '[/imagemap]';
    imagemapCodeTextArea.value = code;
}
