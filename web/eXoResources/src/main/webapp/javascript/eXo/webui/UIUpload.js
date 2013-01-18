/**
 * Copyright (C) 2009 eXo Platform SAS.
 * 
 * This is free software; you can redistribute it and/or modify it under the
 * terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 * 
 * This software is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this software; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin St, Fifth Floor, Boston, MA 02110-1301 USA, or see the FSF
 * site: http://www.fsf.org.
 */

var uiUpload = {
  listUpload : [],
  refreshTime : 1000,

  /**
   * Initialize upload and create a upload request to server
   * 
   * @param {String}
   *          uploadId identifier upload
   */
  initUploadEntry : function(id, uploadId) {	    
    if (!uiUpload.progressURL) {
    	var context = eXo.env.server.context;
      uiUpload.progressURL = context + "/upload?action=progress&uploadId=";
      uiUpload.uploadURL = context + "/upload?action=upload&uploadId=";
      uiUpload.abortURL = context + "/upload?action=abort&uploadId=";
      uiUpload.deleteURL = context + "/upload?action=delete&uploadId=";
    }
    
    var uiInput = $("#" + id);	    
    uiInput.data("uploadId", uploadId);

    var url = uiUpload.progressURL + uploadId;
    var responseText = ajaxAsyncGetRequest(url, false);
    try {        
    	eval("var response = " + responseText);
    } catch (err) {
    	return;
    }	     	      
    
    if (response.upload[uploadId] == undefined
        || response.upload[uploadId].percent == undefined) {
    	uiUpload.createEntryUpload(id);    	
    } else if (response.upload[uploadId] && response.upload[uploadId].percent == 100) {
    	var jCont = uiUpload.cloneContainer(id, uploadId);
    	jCont.data("fileName", response.upload[uploadId].fileName);
    	uiUpload.showUploaded(uploadId);
    }
  },

  createEntryUpload : function(id) {
  	var uiInput = $("#" + id);
  	var uploadId = uiInput.data("uploadId");
  	var uploadBtn = uiInput.find(".uploadButton");  		
         
  	var uploadCont = uiUpload.cloneContainer(id, uploadId);  	
  	var input = uploadCont.find("input");
  	if (base.Browser.isIE()) {
  		uploadBtn.find(".btn").attr("for", input.attr("id"));
  		input.css({"position":"absolute", "left": "-5000px"}).show();
  	} else{
  		uploadBtn.off("click").click(function() {
  			input.click();
  		});  	  	      		
  	}
  	uploadBtn.show();
    uiInput.children("input[type='hidden']").val(false);
  },

  cloneContainer : function(id, uploadId) {  	  	
  	var uiInput = $("#" + id);
  	var template = uiInput.children("script[type='text/template']");
  	var uploadCont = $(template.html());
  	uploadCont.attr("id", "uploadContainer" + uploadId);  	  	  	          
    uploadCont.on("click", ".deleteFileLabel, .removeFile", function() {
  		  if ($(this).hasClass("removeFile")) {
  		  	uiUpload.deleteUpload(uploadId);    			      			      		 
  		  } else {
  		  	uiUpload.abortUpload(uploadId);
  		  }
  		  return false;
    });        
    
    var file = uploadCont.find("input"); 
  	file.attr("id", "file" + uploadId);
  	file.on("change", function() {
  		uiUpload.upload(uploadId);    		  
  	});
  	
  	var iframe = uploadCont.find("iframe"); 
  	if (base.Browser.isIE7()) {
  		var tmp = iframe[0].outerHTML;
  		tmp = tmp.replace("name=uploadIFrame", "name=uploadIFrame" + uploadId);
  		iframe.replaceWith($(tmp));
  	} else {
  		iframe.attr("name", "uploadIFrame" + uploadId);
  	}
  	template.before(uploadCont);
    uploadCont.show();
    uploadCont.find("*[rel='tooltip']").tooltip();
    return uploadCont;
  },
  
  showUploaded : function(id) {
    uiUpload.remove(id);
    var jCont = $('#uploadContainer' + id);
    jCont.find(".progressBarFrame").hide();

    var selectFileFrame = jCont.find(".selectFileFrame");
    selectFileFrame.show();

    selectFileFrame.find(".fileNameLabel").html(uiUpload.processFileInfo(id));
    jCont.siblings(".uploadButton").hide();
    
    jCont.siblings("input[type='hidden']").val(true);
  },
  
  processFileInfo : function(uploadId) {
  	var jCont = $("#uploadContainer" + uploadId);
  	var selectFileFrame = jCont.find(".selectFileFrame");
  	var delIcon = selectFileFrame.find(".removeFile");
  	
  	var fileName = jCont.data("fileName") || "";
  	fileName = decodeURIComponent(fileName);
  	
  	if (selectFileFrame.css("display") !== "none") {
  		var tmp = $("<span>" + fileName + "</span>").css("visibility", "hidden");
  		$(document.body).append(tmp);
  		if (tmp.width() > selectFileFrame.width() - delIcon.width()) {
  			fileName = fileName.substring(0, 51) + "...";
  		}
  		tmp.remove();
  	} else if (fileName.length > 20) {
  		fileName = fileName.substring(0, 21) + "...";
  	}
  	return fileName;
  },

  refreshProgress : function() {
    var list = uiUpload.listUpload;
    if (list.length < 1)
      return;
    var url = uiUpload.progressURL;

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
        uiUpload.abortUpload(id);
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
      
      if (percent == 100) {
        uiUpload.showUploaded(id);
      }
    }
    
    setTimeout( uiUpload.refreshProgress, uiUpload.refreshTime);
  },

  deleteUpload : function(id) {
    var url = uiUpload.deleteURL + id;
    ajaxAsyncGetRequest(url, false);
        
    var jCont = $('#uploadContainer' + id);
    var uiInput = jCont.closest(".uiUploadInput");        
    jCont.remove();
    uiUpload.createEntryUpload(uiInput.attr("id"));    	    
  },

  abortUpload : function(id) {
    uiUpload.remove(id);
    var url = uiUpload.abortURL + id;
    ajaxAsyncGetRequest(url, false);
    
    var jCont = $('#uploadContainer' + id);
    var uiInput = jCont.closest(".uiUploadInput");
    jCont.remove();
    uiUpload.createEntryUpload(uiInput.attr("id"));    	
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
    jCont.siblings(".uploadButton").hide();
    
    var file = document.getElementById('file' + id);
    if (file == null || file == undefined)
    	return;
    if (file.value == null || file.value == '')
    	return;
    var temp = file.value;
    
    if (file.files && file.files.length) {
    	jCont.data("fileName", file.files[0].name);
    } else {
    	jCont.data("fileName", temp.split(/(\\|\/)/g).pop());
    }
    
    var progressBarFrame = jCont.find(".progressBarFrame").first();
    progressBarFrame.show();
    progressBarFrame.find(".fileNameLabel").html(uiUpload.processFileInfo(id));
    
    var bar = jCont.find(".bar").first();
    bar.css("width", "0%");
    var label = bar.children(".percent").first();
    label.html("0%");
    
    var uploadAction = uiUpload.uploadURL + id;
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
    
    if (uiUpload.listUpload.length == 0) {
    	setTimeout(function() {uiUpload.refreshProgress(id);},
    			uiUpload.refreshTime);
    }
    uiUpload.listUpload.push(id);
  },
  
  remove : function(id) {
  	var idx = $.inArray(id, uiUpload.listUpload);
  	if (idx !== -1) {
  		uiUpload.listUpload.splice(idx, 1);  		
  	}
  }
};

_module.UIUpload = uiUpload;