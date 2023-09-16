const fileInput = document.getElementById('img');
const dragDropArea = document.getElementById('drag-drop-area');

// Show the drag-drop area when file is dragged over
dragDropArea.addEventListener('dragover', (event) => {
    event.preventDefault();
    dragDropArea.classList.add('drag-over');
});

// Hide the drag-drop area when file is dragged outside
dragDropArea.addEventListener('dragleave', () => {
    dragDropArea.classList.remove('drag-over');
});

// Handle file drop
dragDropArea.addEventListener('drop', (event) => {
    event.preventDefault();
    dragDropArea.classList.remove('drag-over');
    handleFiles(event.dataTransfer.files);
    console.log(event.dataTransfer.files)
});

// Handle file input change
fileInput.addEventListener('change', (event) => {
    console.log(fileInput.files)

    handleFiles(fileInput.files);
});

let file
function handleFiles(files) {
    file = files[0];
    // file.type.startsWith('image/')
    if (files[0]) {
        document.getElementById('drop-area').remove()
        const send = document.getElementById('send')
        send.innerHTML += `
        <span style="display: flex">
            <img style="margin-left: 20px" class="user_img" src="/${$('#image_').val()}">
            <h6 style="margin: 7px" class="card-title">${$('#username_').val()}</h6>
        </span>
        <textarea style="padding: 20px;border: 0;width: 100%" id="content" rows="5" placeholder="撰寫想輸入的文字..." ></textarea>
        <button style='float: right;margin: 10px;color:#008aff' class=\"btn \" onclick=\"submit()\">下一步</button>
        `

        const imagePreview = document.getElementById('image-preview');
        const imageItem = document.createElement('div');
        imageItem.classList.add('image-item');
        const image = document.createElement('img');
        image.src = URL.createObjectURL(file);
        image.alt = file.name;
        imageItem.appendChild(image);
        imagePreview.appendChild(imageItem);
    } else {
        alert('Please select an image file.');
    }
}
