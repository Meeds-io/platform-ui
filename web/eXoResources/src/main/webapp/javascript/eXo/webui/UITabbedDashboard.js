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
function initTabbedDashboardPortlet(id)
{
  
  /**
   * A flag indicating that there is ongoing request to create new dashboard page. That helps
   * us to avoid concurrent dashboard creating requests coming from one user.
   *
   */
  var inRequest = false;
  require(['SHARED/jquery'], function($){
    
    var tab = $("#" + id);
    tab.find(".addDashboard").on("click", function() {
      showAddTabInput(this);   
    });

    tab.on("click", ".active span", function() {
      var span = $(this);
      showEditLabelInput(this, span.attr("id"), span.text()); 
    });
    
    tab.find('.displayMoreTab').on('click', function() {
    	$(this).parent().toggleClass('open');
    });
    
    function renameTabLabel(input)
    {
      var newLabel = input.val();
      if (newLabel && newLabel.length > 0)
      {
        var portletID = input.closest(".PORTLET-FRAGMENT").parent().attr("id");

        var href = eXo.env.server.portalBaseURL + "?portal:componentId=" + portletID;
        href += "&portal:type=action";
        href += "&portal:isSecure=false";
        href += "&uicomponent=UITabPaneDashboard";
        href += "&op=RenameTabLabel";
        href += "&objectId=" + input.attr("id");
        href += "&newTabLabel=" + encodeURIComponent(newLabel);
        window.location = href;
      }
    };

    function showEditLabelInput(target, nodeName, currentLabel)
    {
      var jqObj = $(target);
      jqObj.closest(".active").addClass("editing");

      var input = $("<input>").attr({type : "text", id : nodeName, name : currentLabel, value : currentLabel, maxLength : 50});
      //input.css("border", "1px solid #b7b7b7").css("width", (target.offsetWidth - 2) + "px");

      jqObj = jqObj.replaceWith(input);
      input.blur(function()
      {
        $(this).replaceWith(jqObj).closest(".active").removeClass("editing");
      });

      input.keypress(function(e)
      {
        var keyNum = e.keyCode ? e.keyCode : e.which;
        if (keyNum == 13)
        {
          renameTabLabel($(this));
        }
        else if (keyNum == 27)
        {
          $(this).replaceWith(jqObj);
        }
      });

      input.focus();
    };

    function createTab(input)
    {
      if (this.inRequest)
      {
        return;
      }
      else
      {
        var label = input.val();
        if (label && label.length > 0)
        {
          var href = eXo.env.server.portalBaseURL + "?portal:componentId=" + input.attr("id");
          href += "&portal:type=action";
          href += "&portal:isSecure=false";
          href += "&uicomponent=UITabPaneDashboard";
          href += "&op=AddDashboard";
          href += "&objectId=" + encodeURIComponent(label);
          this.inRequest = true;
          window.location = href;
        }
      }
    };

    function showAddTabInput(addButton)
    {
      var jqAddButton = $(addButton);
      jqAddButton.hide();
      var parent = tab.find('ul.dropdown-menu');
      var tabs = parent.find('li');
      var tabIndex = tabs.length;
      
      parent = $(addButton).closest('ul.nav');
      tabs = parent.find('li');
      tabIndex += tabs.length - 1;
      
      var newTab = parent.find("li.active").clone();
      newTab.removeClass("active").addClass("editing");
      newTab.insertBefore(jqAddButton);

      var portletID = jqAddButton.closest("div.PORTLET-FRAGMENT").parent().attr("id");
      var input = $("<input>").attr({type : "text", id : portletID , maxlength : 50, value : "Tab_" + tabIndex});
      input.css({"border" : "1px solid #b7b7b7", "width" : "80px"});

      newTab.find("span").eq(0).replaceWith(input);
      input.next("i").hide();

      input.blur(function()
      {
        $(newTab).remove();
        jqAddButton.show();
      });

      input.keypress(function(e)
      {
        var keyNum = e.keyCode ? e.keyCode : e.which;
        if (keyNum == 13)
        {
          createTab($(this));
        }
        else if (keyNum == 27)
        {
          $(newTab).remove();
        }
      });

      input.focus();
    }
  });
}