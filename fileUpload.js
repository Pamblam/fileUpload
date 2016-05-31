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

        this.init = function() {
            var guid = Math.floor(Math.random() * 9999999999999) + 1;
            self.id = "FU_" + guid;

            // get name
            var name = $(button).prop("name");
            $(button).removeAttr("name");

            // make a hidden file input
            var m = (typeof params.multi !== 'undefined' && params.multi) ? "multiple" : "";
			var accept = (typeof params.accept !== 'undefined' && params.accept) ? params.accept : "";
            var fi = $('<input type="file" name="' + name + '" id="' + self.id + '" accept="' + accept + '" style="opacity:0; position:absolute;" ' + m + '/>');
            self.input = fi[0];
            $(self.input).insertAfter(button);

            self.setHandlers();
        };

        // clear the input
        this.clearFiles = function() {
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
                self.files = e.target.files;
                self.onChange();
            });
        };

        // get files
        this.getFiles = function() {
            return self.files;
        };
		
		// get the text of the file
		this.getFileText = function(cb){
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
		this.getDataURI = function(cb){
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

        self.init();
    }

    // throw it all on top of the jQuery object.
    $.fn.fileUpload = function(p, pp) {
        if (this.length === 1 && typeof p === "string" && $(this[0]).data('fuInstance') !== 'undefined')
            return $(this).data('fuInstance')[p](pp);

        return this.each(function() {
            params = typeof p === 'object' ? p : {};
            if (typeof $(this).data('fuInstance') === 'undefined')
                $(this).data('fuInstance', new fileUpload(this, params));
        });
    };

})(jQuery);
