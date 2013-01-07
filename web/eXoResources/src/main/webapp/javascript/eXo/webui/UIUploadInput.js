/**
 * Copyright (C) 2009 eXo Platform SAS.
 * 
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 * 
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

var uiUploadInput = {
  listUpload : [],
  refreshTime : 1000,
  delayTime : 0,

  /**
   * Initialize upload and create a upload request to server
   * 
   * @param {String}
   *          uploadId identifier upload
   */
  initUploadEntry : function(id, uploadId, limited) {	    
    if (!uiUploadInput.progressURL) {
    	var context = eXo.env.server.context;
      uiUploadInput.progressURL = context + "/upload?action=progress&uploadId=";
      uiUploadInput.uploadURL = context + "/upload?action=upload&uploadId=";
      uiUploadInput.abortURL = context + "/upload?action=abort&uploadId=";
      uiUploadInput.deleteURL = context + "/upload?action=delete&uploadId=";
    }
    
    var uiInput = $("#" + id);
    if (uploadId.length) {
    	uiInput.data("inputs", uploadId);
    	if (limited) {
    		uiInput.data("limited", uploadId.length);
    	}
    }	    

    for ( var i = 0; i < uploadId.length; i++) {
      var url = uiUploadInput.progressURL + uploadId[i];
      var responseText = ajaxAsyncGetRequest(url, false);
      try {        
    	  eval("var response = " + responseText);
      } catch (err) {
        return;
      }	     	      
      
      if (response.upload[uploadId[i]] && response.upload[uploadId[i]].percent == 100) {
        uiUploadInput.showUploaded(uploadId[i], response.upload[uploadId[i]].fileName);
      }
    }
    uiUploadInput.createEntryUpload(id);
    uiUploadInput.fileSelectedStatus(id);
  },

  createEntryUpload : function(id, uploadId) {
  	var uiInput = $("#" + id);
  	var inputs = uiInput.data("inputs");
  	var limited = uiInput.data("limited");
  	var uploadBtn = uiInput.find(".uploadButton");  	
  	
  	if (!uploadId) {
  		for (var i = 0; i < inputs.length; i++) {
  			var jCont = $("#uploadContainer" + inputs[i]);
  			if (!jCont.length) {
  				uploadId = inputs[i];
  				break;
  			}
  		}
  		
  		if (!uploadId) {
  			if (inputs.length === limited) {
  				uploadBtn.hide();
  				return;
  			}
  			
  			var createURL = uiInput.children(".createUploadURL").text();
  			ajaxAsyncGetRequest(createURL, false);
  			var uploadId = inputs[inputs.length - 1]; 
  			var idx = uploadId.search(/-\d+$/) + 1;
  			uploadId = uploadId.substring(0, idx) + (parseInt(uploadId.substring(idx)) + 1);
  			inputs.push(uploadId);
  			uiInput.data("inputs", inputs);
  		}  	  	  	  	  	
  	}
  	  	         
  	var uploadCont = uiUploadInput.cloneContainer(id, uploadId);
  	uploadBtn.off("click").click(function() {
  		uploadCont.find("input").click();
  	}).show();  	  	    
  },
  
  cloneContainer : function(id, uploadId) {
  	var uiInput = $("#" + id);
  	var template = uiInput.children("script[type='text/template']");
  	var uploadCont = $(template.text());
  	uploadCont.attr("id", "uploadContainer" + uploadId);  	  	  	          
    uploadCont.on("click", ".deleteFileLabel, .removeFile", function() {
  		  if ($(this).hasClass("removeFile")) {
  		  	uiUploadInput.deleteUpload(uploadId);    			      			      		 
  		  } else {
  		  	uiUploadInput.abortUpload(uploadId);
  		  }
  		  return false;
    });        
    
    var file = uploadCont.find("input"); 
  	file.attr("id", "file" + uploadId);
  	file.on("change", function() {
  		uiUploadInput.upload(uploadId);    		  
  	});
  	
  	uploadCont.find("iframe").attr("name", "uploadIFrame" + uploadId);
  	template.before(uploadCont);
    uploadCont.show();
    uploadCont.find("*[rel='tooltip']").tooltip();
    return uploadCont;
  },

  showUploaded : function(id, fileName) {
    uiUploadInput.remove(id);
    var jCont = $('#uploadContainer' + id);
    if (!jCont.length) {
    	$(".uiUploadInput").each(function() {
    		var uiInput = $(this);
    		if ($.inArray(id, uiInput.data("inputs")) != -1) {
    			jCont = uiUploadInput.cloneContainer(uiInput.attr("id"), id);
    			return false;
    		}
    	});
    }
    jCont.find(".progressBarFrame").hide();

    var selectFileFrame = jCont.find(".selectFileFrame");
    selectFileFrame.show();

    selectFileFrame.find(".fileNameLabel").html(uiUploadInput.processFileInfo(fileName));    
  },
  
  processFileInfo : function(fileName) {
  	fileName = decodeURIComponent(fileName);
  	if (fileName.length > 20) {
  		fileName = fileName.substring(0, 21) + "...";
  	}
  	return fileName;
  },

  refreshProgress : function() {
    var list = uiUploadInput.listUpload;
    if (list.length < 1)
      return;
    var url = uiUploadInput.progressURL;

    for ( var i = 0; i < list.length; i++) {
      url = url + "&uploadId=" + list[i];
    }
    var responseText = ajaxAsyncGetRequest(url, false);    

    try {
    	eval("var response = " + responseText);
    } catch (err) {
      return;
    }

    for (id in response.upload) {
      var jCont = $("#uploadContainer" + id);
      if (response.upload[id].status == "failed") {
      	var message = jCont.siblings(".limitMessage").html();
        uiUploadInput.abortUpload(id);
        message = message.replace("{0}", response.upload[id].size);
        message = message.replace("{1}", response.upload[id].unit);
        alert(message);
        continue;
      }

      var percent = response.upload[id].percent;
      var bar = jCont.find(".bar").first();
      bar.css("width", percent + "%");
      var label = jCont.find(".percent").first();
      label.html(percent + "%");

      var fileName = response.upload[id].fileName;
      jCont.find(".progressBarFrame .fileNameLabel").html(uiUploadInput.processFileInfo(fileName));
      
      if (percent == 100) {
        uiUploadInput.showUploaded(id, fileName);
      }
    }
    
    setTimeout( uiUploadInput.refreshProgress, uiUploadInput.refreshTime);
  },

  deleteUpload : function(id) {
    var url = uiUploadInput.deleteURL + id;
    ajaxAsyncGetRequest(url, false);
        
    var jCont = $('#uploadContainer' + id);
    var uiInput = jCont.closest(".uiUploadInput");
    var inputs = uiInput.data("inputs");
    if (inputs.length > 1) {
    	var rmInput = uiInput.children(".removeInputUrl").text();
    	ajaxAsyncGetRequest(rmInput + "&objectId=" + id, false);
    	
    	var uiInput = jCont.closest(".uiUploadInput");
    	inputs.splice($.inArray(id, inputs), 1);
    	uiInput.data("inputs", inputs);    	
    }
        
    jCont.remove();
    if (uiInput.find(".uploadButton").css("display") == "none") {
    	uiUploadInput.createEntryUpload(uiInput.attr("id"));    	
    }
    uiUploadInput.fileSelectedStatus(uiInput.attr("id"));
  },

  abortUpload : function(id) {
    uiUploadInput.remove(id);
    var url = uiUploadInput.abortURL + id;
    ajaxAsyncGetRequest(url, false);
    
    var jCont = $('#uploadContainer' + id);
    var uiInput = jCont.closest(".uiUploadInput");
    jCont.remove();
    if (uiInput.find(".uploadButton").css("display") == "none") {
    	uiUploadInput.createEntryUpload(uiInput.attr("id"));    	
    }
    uiUploadInput.fileSelectedStatus(uiInput.attr("id"));
  },

  /**
   * Start upload file
   * 
   * @param {Object}
   *          clickEle
   * @param {String}
   *          id
   */
  upload : function(id) {
    var jCont = $('#uploadContainer' + id);
    var uiInput = jCont.closest(".uiUploadInput");
    uiUploadInput.createEntryUpload(uiInput.attr("id"));    

    var file = document.getElementById('file' + id);
    if (file == null || file == undefined)
    	return;
    if (file.value == null || file.value == '')
    	return;
    var temp = file.value;
    
    var progressBarFrame = jCont.find(".progressBarFrame").first();
    progressBarFrame.show();
    progressBarFrame.find(".fileNameLabel").html(uiUploadInput.processFileInfo(temp.split(/(\\|\/)/g).pop()));
        
    var bar = jCont.find(".bar").first();
    bar.css("width", "0%");
    var label = bar.children(".percent").first();
    label.html("0%");
    
    uiUploadInput.fileSelectedStatus(uiInput.attr("id"));
    
    var uploadAction = uiUploadInput.uploadURL + id;
    var formHTML = "<form id='form" + id
    + "' class='UIUploadForm' style='margin: 0px; padding: 0px' action='"
    + uploadAction
    + "' enctype='multipart/form-data' target='uploadIFrame" + id
    + "' method='post'></form>";
    var div = document.createElement("div");
    div.innerHTML = formHTML;
    var form = div.firstChild;
    
    form.appendChild(file);
    document.body.appendChild(div);
    form.submit();
    document.body.removeChild(div);
    
    if (uiUploadInput.listUpload.length == 0) {
    	setTimeout(function() {uiUploadInput.refreshProgress(id);},
    			uiUploadInput.refreshTime);
    }
    uiUploadInput.listUpload.push(id);
  },
  
  fileSelectedStatus : function(id) {
  	var uiUploadInput = $("#" + id);
  	var frames = uiUploadInput.find(".uploadContainer").find(".selectFileFrame, .progressBarFrame");
  	var hasFile = false;
  	frames.each(function() {
  		if ($(this).css("display") == "block") {
  			hasFile = true;
  			return false;
  		}; 
  	});
  	var uploadButton = uiUploadInput.find(".uploadButton");
  	var noFile = uploadButton.find(".noFile");
  	var moreFiles = uploadButton.find(".moreFiles");
  	if (hasFile) {
  		noFile.hide();
  		moreFiles.show();
  	} else {
  		noFile.show();
  		moreFiles.hide();
  	}
  },
  
  remove : function(id) {
  	var idx = $.inArray(id, uiUploadInput.listUpload);
  	if (idx !== -1) {
  		uiUploadInput.listUpload.splice(idx, 1);  		
  	}
  }
};

_module.UIUploadInput = uiUploadInput;