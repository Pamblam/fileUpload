### fileUpload();

FileUpload is a jQuery plugin that lets you turn a normal button into a file input button that you can style with normal CSS. This is handy 'cus you can’t really style a normal file input.

Buttons may be given a “name” attribute and used in a regular form, files will be passed to the server as if the button was a file input. During instantiation, fileInput method maybe chained, but only during instantiation.

**To instantiate the button as a file input button:**

     $("#mybtn").fileUpload(); 

**To instantiate the button to only accept certain file types:**

This should be a comma separated list of [mime-types] to accept. _For full browser support, the [W3C recommends] that you also include the corresponding file-extention for each given mime-type_.

    $("#mybtn").fileUpload({
    	accept: "text/plain, .txt"
    });

**To instantiate the button as a multi file input button:**

    $("#mybtn").fileUpload({
    	multi: true
    }); 

**To instantiate the button with an onchange callback:**

    $("#mybtn").fileUpload({
    	change: function() {
    		alert("files were added!");
    	}
    }); 

**To get the files currently in the input:**

    var files = $("#mybtn").fileUpload("getFiles"); 

**To get the raw text of the files currently in the input:**

    $("#mybtn").fileUpload("getFileText", function(fileText){
        console.log(fileText);
    }); 

**To get the dataURI of the files currently in the input:**

    $("#mybtn").fileUpload("getDataURI", function(dataURI){
        console.log(dataURI);
    }); 

**To clear the files currently in the input:**

    $("#mybtn").fileUpload("clearFiles");

Here ‘s a [jsFiddle]. Check out the example page for more examples.

[W3C recommends]: https://www.w3.org/TR/html5/forms.html#attr-input-accept
[jsFiddle]: http://jsfiddle.net/z292qwob/
[mime-types]: http://www.iana.org/assignments/media-types/media-types.xhtml