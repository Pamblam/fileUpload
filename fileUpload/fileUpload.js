/**
 * fileUpload plugin for jQuery
 * WTFPL
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
		self.url = typeof params.url === "string" ? params.url : ""+window.location;
		
		self.dragNdropEnabled = function() {
			var div = document.createElement('div');
			return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
		};
		
        self.init = function() {
            var guid = Math.floor(Math.random() * 9999999999999) + 1;
            self.id = "FU_" + guid;

            // get name
            var name = $(button).prop("name");
            $(button).removeAttr("name");

			// set drag n drop stuff
			if(undefined !== params.dragEnterClass) self.dragEnterClassName = params.dragEnterClass;
			if(undefined !== params.dragArea) self.dragArea(params.dragArea);

            // make a hidden file input
            var m = (typeof params.multi !== 'undefined' && params.multi) ? "multiple" : "";
			self.acceptedTypes = (typeof params.accept !== 'undefined' && params.accept) ? params.accept : "";
            var fi = $('<input type="file" name="' + name + '" id="' + self.id + '" accept="' + self.acceptedTypes + '" style="opacity:0; position:absolute;" ' + m + '/>');
            self.input = fi[0];
            $(self.input).insertAfter(button);

            self.setHandlers();
        };
		
        // clear the input
        self.clearFiles = function() {
            if (self.input.value) {
                try {
                    self.input.value = '';
                } catch (err) {}
                if (self.input.value) {
                    var form = document.createElement('form'),
                        parentNode = self.input.parentNode,
                        ref = self.input.nextSibling;
                    form.appendChild(self.input);
                    form.reset();
                    parentNode.insertBefore(self.input, ref);
                }
            }
        };

        //set event handlers
        self.setHandlers = function() {
            $(button).unbind("click").click(function(e) {
                e.preventDefault();
                self.input.click();
            });

            $(self.input).unbind("change").change(function(e) {
				if(!self.files) self.files = [];
                for(var i=0; i<e.target.files.length; i++)
					self.files.push(e.target.files[i]);
				if(!self.files.length) self.files = null;
                self.onChange();
            });
        };

        // get files
        self.getFiles = function() {
            return self.files;
        };
		
		// get the text of the file
		self.getFileText = function(cb){
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				for(var i=0; i<self.files.length; i++){
					var f = self.files[i];
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
		self.getDataURI = function(cb){
			if (window.File && window.FileReader && window.FileList && window.Blob) {
				for(var i=0; i<self.files.length; i++){
					var f = self.files[i];
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
		self.dragEnterClass = function(className){
			self.dragEnterClassName = className;
		};
		
		// set the drag and drop area
		self.dragArea = function(selector){
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
                for(var i=0; i<droppedFiles.length; i++)
					if(self.acceptedTypes === "" || self.acceptedTypes.indexOf(droppedFiles[i].type)>-1)
						self.files.push(droppedFiles[i]);
				if(!self.files.length) self.files = null;
                self.onChange();
			});
		};
		
		// Upload the files
		self.upload = function(){
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
							self.onProgress(percentComplete);
						}
					}, false);
					return xhr;
				}
			}).always(function(xhr){
				self.onUploaded(xhr.responseText===undefined?xhr:xhr.responseText);
			});
		};
		
        self.init();
    }

    // throw it all on top of the jQuery object.
    $.fn.fileUpload = function(p, pp) {
		if(this.length === 1 && typeof p === "string" && $(this[0]).data('fuInstance') !== 'undefined'){
			if(undefined === pp)
				return $(this).data('fuInstance')[p]();
			else
				return $(this).data('fuInstance')[p](pp);
		}else{
			return this.each(function() {
				params = typeof p === 'object' ? p : {};
				if (typeof $(this).data('fuInstance') === 'undefined')
					$(this).data('fuInstance', new fileUpload(this, params));
			});
		}
    };

})(jQuery);
