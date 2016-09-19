### fileUpload();

**UPDATE: FileUpload now supports drag and drop!**
**UPDATE: FileUpload now supports uploading and includes a server-side helper class!**

FileUpload is a jQuery plugin and library that makes it easy to upload or read files on the client side.

## Features

 - Use a button (or anything else you can style with CSS) instead of a real file input. This is handy 'cus you can’t really style a normal file input.
 - Does not apply any styles whatsoever - you are fully in control of the look and feel of your app.
 - Built in file-reading capabilities - you don't have to upload a file to a server to use it.
 - Accept only file types that you want, built in file-type validation.
 - Set an event handler to be called every time a file is added.
 - Can accommodate multiple files at a time.
 - Convert files to a dataURI on the client side.
 - May add a name attribute to your button and it will submit just like a standard file input. (Drag n' drop files will not be submitted this way though).
 - Chainable during instantiation.
 - **NEW:** Now features Drag n' Drop.
 - **NEW:** Now features built-in ajax file-uploading. 
 - **NEW:** Now includes PHP upload helper class for the back-end.

## Usage

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

**To set the drop zone for Drag n' Drop**

    $("#ultext").fileUpload({
		dragArea: "#dragarea",        // a CSS selector for the drop zone div
		dragEnterClass: "dragover"    // a CSS class name that will be applied 
                                      // to the drop zone when  user hovers
                                      // a file over the drop zone
	});

**To upload files**

	$("#chooser").fileUpload({
		multi: true,
		url: "example.php",
		// Update a progress bar or something
		progress: function(percent){
			$("#uploaddisplay").text(percent+"% complete");
		},
		// When upload is finished
		uploaded: function(r){
			alert("All done!");
		}
	});

	// A button to start the upload
	$("#doUpload").click(function(){
		$("#chooser").fileUpload("upload");
	});

# Server Side Implementation

Files are passed to the server in the `$_FILES['fileUploadFiles']` array. You can handle them yourself, or you can utilize the included `fileUpload` class, which provides an easy interface for handling the uploads.

The `fileUpload` PHP class has only one static method, `fileUpload::getFiles()`, which returns an array of `uploadedFile` objects. Each `uploadedFile` object contains a set of useful methods to help handle your files. Methods include: `getName()`, `getType()`, `getSize()`, `getTmpName()`, `getError()`, `moveTo($newLocation)`, and `getContents()`.

**Example server side implementation:**

	require "./fileUpload/fileUpload.php";
	$files = fileUpload::getFiles();
	if(!empty($files)){
		$return = array();
		foreach($files as $file){
			$return[] = array(
				"name" => $file->getName(),
				"moved" => $file->moveTo("/uploads"),
				"error" => $file->getError()
			);
		}
		header("Content-Type: application/json");
		echo json_encode($return);
		exit;
	}

Here ‘s a [jsFiddle]. Check out the example page for more examples.

[W3C recommends]: https://www.w3.org/TR/html5/forms.html#attr-input-accept
[jsFiddle]: http://jsfiddle.net/znnhx99v/
[mime-types]: http://www.iana.org/assignments/media-types/media-types.xhtml