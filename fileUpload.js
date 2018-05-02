/**
 * fileUpload plugin for jQuery
 * Do What The Fuck You Want To Public License wtfpl.org
 * Version "1.3.0"
 */
(function($) {

    // the main function that is instatiated 
    // upon each element in the group
    function fileUpload(button, params) {
        var self = this;
        self.id = null;
        self.input = null;
        self.files = null;
        self.onChange = typeof params.change === "function" ? params.change : function() {};
		self.onProgress = typeof params.progress === "function" ? params.progress : function() {};
		self.onUploaded = typeof params.uploaded === "function" ? params.uploaded : function() {};
		self.dragEnterClassName = "dragEnter";
		self.acceptedTypes = "";
		self.multi = false;
		self.url = typeof params.url === "string" ? params.url : ""+window.location;
		self.context = button || params.dragArea;
		
		var guid = Math.floor(Math.random() * 9999999999999) + 1;
		self.id = "FU_" + guid;

		// get name
		var name = 'fileUploadFile';
		if(button){
			name = $(button).prop("name");
			$(button).removeAttr("name");
		}
		if(params.name) name = params.name;	
		
		// set drag n drop stuff
		if(undefined !== params.dragEnterClass) self.dragEnterClassName = params.dragEnterClass;
		if(undefined !== params.dragArea) self.dragArea(params.dragArea);

		// make a hidden file input
		self.multi = !!params.multi;
		var m = (self.multi) ? "multiple" : "";
		self.acceptedTypes = (typeof params.accept !== 'undefined' && params.accept) ? params.accept : "";
		var fi = $('<input type="file" name="' + name + '" id="' + self.id + '" accept="' + self.acceptedTypes + '" style="z-index:-999999; opacity:0; position:absolute;" ' + m + '/>');
		self.input = fi[0];
		
		// determine where to put the invisible input
		if(params.form) $(self.input).insertAfter(params.form);
		else if(button) $(self.input).insertAfter(button);
		else if(params.dragArea) $(self.input).insertAfter(params.dragArea);
		else $(body).append(self.input);

		// Event listeners
		if(button){
			$(button).click(function(e) {
				e.preventDefault();
				self.input.click();
			});
		}

		$(self.input).unbind("change").change(function(e) {
			if(!self.files || !self.multi) self.files = [];
			for(var i=0; i<e.target.files.length; i++)
				self.files.push(e.target.files[i]);
			if(!self.files.length) self.files = null;
			self.onChange.call(self.context, e);
		});
	}
	
	fileUpload.prototype.dragNdropEnabled = function() {
		var div = document.createElement('div');
		return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
	};
		
    // clear the input
    fileUpload.prototype.clearFiles = function() {
		this.files = [];
		this.input.value = '';
		return;
	};

    // get files
    fileUpload.prototype.getFiles = function() {
        return this.files;
    };
		
	// get the text of the file
	fileUpload.prototype.getFileText = function(cb){
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			for(var i=0; i<this.files.length; i++){
				var f = this.files[i];
				if(!f) continue;
				var r = new FileReader;
				r.onload = function(e){
					cb(e.target.result);
				};
				r.readAsText(f);
			}
		} else return false;
		return true;
	};
		
	// get the dataURI of the file
	fileUpload.prototype.getDataURI = function(cb){
		if (window.File && window.FileReader && window.FileList && window.Blob) {
			for(var i=0; i<this.files.length; i++){
				var f = this.files[i];
				if(!f) continue;
				var r = new FileReader;
				r.onload = function(e){
					cb(e.target.result);
				};
				r.readAsDataURL(f);
			}
		} else return false;
		return true;
	};
		
	// set a classname to be applied when user drags file into input
	fileUpload.prototype.dragEnterClass = function(className){
		this.dragEnterClassName = className;
	};
		
	// set the drag and drop area
	fileUpload.prototype.dragArea = function(selector){
		var self = this;
		if(!self.dragNdropEnabled) return false;
		$(selector).on('drag dragstart dragend dragover dragenter dragleave drop', function (e) {
			e.preventDefault();
			e.stopPropagation();
		}).on('dragover dragenter', function () {
			$(selector).addClass(self.dragEnterClassName);
		}).on('dragleave dragend drop', function () {
			$(selector).removeClass(self.dragEnterClassName);
		}).on('drop', function (e) {
			var droppedFiles = e.originalEvent.dataTransfer.files;
			if(!self.files) self.files = [];
			var added = 0;
			for(var i=0; i<droppedFiles.length; i++){
				var ext = droppedFiles[i].name.split(".").pop();
				if(self.acceptedTypes === "" || self.acceptedTypes.indexOf(droppedFiles[i].type)>-1 || self.acceptedTypes.indexOf(ext)>-1 || self.acceptedTypes.indexOf('.'+ext)>-1){
					if(!self.multi) self.files = [];
					self.files.push(droppedFiles[i]);
					added++;
					if(!self.multi) break;
				}
			}
			if(!self.files.length) self.files = null;
			if(added) self.onChange.call(self.context, e);
		});
	};
		
	// Upload the files
	fileUpload.prototype.upload = function(){
		var self = this;
		var formData = new FormData();
		for(var i=self.files.length; i--;)
			formData.append('fileUploadFiles[]', self.files[i], self.files[i].name);
		$.ajax({
			url: self.url,
			type: 'POST',
			data: formData,
			processData: false,
			contentType: false,
			xhr: function () {
				var xhr = window.XMLHttpRequest ? new window.XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
				xhr.upload.addEventListener("progress", function (evt) {
					if (evt.lengthComputable) {
						var percentComplete = evt.loaded / evt.total;
						percentComplete = parseInt(percentComplete * 100);
						self.onProgress.call(self.context, percentComplete, evt);
					}
				}, false);
				return xhr;
			}
		}).always(function(xhr){
			self.onUploaded.call(self.context, xhr.responseText===undefined?xhr:xhr.responseText);
		});
	};

	$.fileUpload = function(opts){
		// to do... make it instantiate like this
		// added a name paramter, 
		// made button optional as long as drag area exists
		// addeda  form paramter... input is appended to form 
		// change name to fileInput
		// emit events instead of passing callbacks into the constructor
	};

    // throw it all on top of the jQuery object.
    $.fn.fileUpload = function(p, pp){
		if(this.length === 1 && typeof p === "string" && this.data('fuInstance') !== 'undefined'){
			return this.data('fuInstance')[p](pp);
		}else{
			return this.each(function() {
				params = typeof p === 'object' ? p : {};
				if (typeof $(this).data('fuInstance') === 'undefined')
					$(this).data('fuInstance', new fileUpload(this, params));
			});
		}
    };

})(jQuery);
