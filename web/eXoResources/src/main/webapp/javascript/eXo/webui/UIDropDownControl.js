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

eXo.webui.UIDropDownControl = {

  init : function(id)
  {
    var elmt = $('#' + id);
    elmt.find('a.OptionItem').on('click', this.onclickEvt);
  },

  selectItem : function(method, id, selectedIndex) {
    if (method)
      method(id, selectedIndex);
  },

  /**
   * Use as event when user selects a item in drop down list Display content of
   * selected item and hide drop down control
   * 
   * @param {Object}
   *          obj selected object
   */
  onclickEvt : function() {
    var dropdown = $(this).closest(".dropdown-menu").parent();
    var title = dropdown.find(".dropdown-toggle > span").first();
    title.html($(this).html());
  }
};

_module.UIDropDownControl = eXo.webui.UIDropDownControl;