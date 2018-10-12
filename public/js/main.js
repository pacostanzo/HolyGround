var loadFile = function(event) {
    var reader = new FileReader();
    reader.onload = function(){
        var output = document.getElementById('image');
        output.src = reader.result;

    };
    reader.readAsDataURL(event.target.files[0]);
    document.getElementById("image-name").value = event.target.files[0].name;
};