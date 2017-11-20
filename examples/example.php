<?php

require "../fileUpload.php";
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

?><!DOCTYPE html>
<html>
	<head>
		<title>fileUpload Example</title>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<style>
			button {
				background: #3498db;
				background-image: -webkit-linear-gradient(top, #3498db, #2980b9);
				background-image: -moz-linear-gradient(top, #3498db, #2980b9);
				background-image: -ms-linear-gradient(top, #3498db, #2980b9);
				background-image: -o-linear-gradient(top, #3498db, #2980b9);
				background-image: linear-gradient(to bottom, #3498db, #2980b9);
				-webkit-border-radius: 28;
				-moz-border-radius: 28;
				border-radius: 28px;
				font-family: Arial;
				color: #ffffff;
				font-size: 20px;
				padding: 10px 20px 10px 20px;
				text-decoration: none;
			}

			button:hover {
				background: #3cb0fd;
				background-image: -webkit-linear-gradient(top, #3cb0fd, #3498db);
				background-image: -moz-linear-gradient(top, #3cb0fd, #3498db);
				background-image: -ms-linear-gradient(top, #3cb0fd, #3498db);
				background-image: -o-linear-gradient(top, #3cb0fd, #3498db);
				background-image: linear-gradient(to bottom, #3cb0fd, #3498db);
				text-decoration: none;
			}
			
			#dragarea{
				width: 150px;
				height: 150px;
				border-radius: 1em;
				border: 3px dotted black;
			}
			
			#ultext{ color:blue; cursor: pointer; }
			
			.dragover{ background-color: blue; }
		</style>
	</head>
	<body>
		
		<h3>Text Preview</h3>
		<button id="tpb">Add a .txt file</button><br>
		<textarea id="tpt">Add a file first</textarea>
		<hr>
		
		<h3>Image Preview</h3>
		<button id="ipb">Add an image file</button><br>
		<div id="ipt">Choose an image first</div>
		<hr>
		
		<h3>Drag and drop</h3>
		<div id="dragarea">
			Drag an image into this box or <span id="ultext">click here</span>.
		</div>
		<div id="dragareadisplay">No images chosen</div>
		<hr>
		
		<h3>Upload to Server</h3>
		<button id="chooser">Choose File(s)</button>
		<button id="doUpload">Upload</button>
		<div id="uploaddisplay">No files chosen</div>
		<hr>
		
		<script src="//code.jquery.com/jquery-1.11.2.min.js"></script>
		<script src="../fileUpload.js"></script>
		<script>
			$(function(){
				
				// Text Preview Example
				$("#tpb").fileUpload({
					accept: "text/plain, .txt",
					change: function(){
						$("#tpb").fileUpload("getFileText", function(txt){
							$("tpt").val(txt);
						});
					}
				});
				
				// Image preview example
				$("#ipb").fileUpload({
					multi: true,
					accept: "image/gif, image/png, image/jpeg, .png, .gif, .jpg",
					change: function(){
						$("#ipt").empty();
						$(this).fileUpload("getDataURI", function(dataURI){
							$("<img style='max-width:150px; max-height:150px;'>").attr("src", dataURI).appendTo("#ipt");
						});
						$(this).fileUpload('clearFiles');
					}
				});
				
				// drag n drop example
				$("#ultext").fileUpload({
					accept: "image/gif, image/png, image/jpeg, .png, .gif, .jpg",
					dragArea: "#dragarea",
					dragEnterClass: "dragover",
					change: function(){
						var f = [];
						var files = $("#ultext").fileUpload("getFiles");
						for(var i=0; i<files.length; i++) f.push(files[i].name);
						$("#dragareadisplay").html(f.join(", "));
						if(!files.length) $("#dragareadisplay").html("No files chosen");
					}
				});
				
				// upload to server example
				$("#chooser").fileUpload({
					multi: true,
					url: "example.php",
					change: function(){
						$("#uploaddisplay").text("0%");
					},
					progress: function(percent){
						$("#uploaddisplay").text(percent+"% complete");
					},
					uploaded: function(r){
						var str = "";
						for(var i=r.length; i--;){
							str += "File: "+r[i].name+"\n";
							str += "Moved: "+(r[i].success?"yes":"no")+"\n";
							if(!r[i].success) str += "Error: "+r[i].error+"\n";
							str += "----\n";
						}
						alert(str);
					}
				});
				$("#doUpload").click(function(){
					$("#chooser").fileUpload("upload");
				});
				
			});
		</script>
	</body>
</html>
