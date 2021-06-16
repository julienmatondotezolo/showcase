console.log("Image script")

const imageLabel = document.getElementById('image-label');

document.getElementById('image').addEventListener('change', () => {
    console.log("%cIMAGE UPLOADED", 'color: red; font-weight: bold');
    imageLabel.style.backgroundColor = "white";
    imageLabel.style.backgroundImage = "url('../assets/images/upload_black.png')";
});