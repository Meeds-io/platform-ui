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

(function ($, base, portalControl, uiRightClickPopupMenu) {
    eXo.webui.UIDropDownControl = {

        init:function (id) {
            var elmt = $('#' + id);
            elmt.find('a.OptionItem').on('click', this.onclickEvt);
        },

        selectItem:function (method, id, selectedIndex) {
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
        onclickEvt:function () {
            var dropdown = $(this).closest(".dropdown-menu").parent();
            var title = dropdown.find(".dropdown-toggle > span").first();
            title.html($(this).html());
        }
    };

    eXo.webui.UIColorPicker = {

        show:function (obj) {
            document.onmousedown = eXo.webui.UIColorPicker.hide;
            var jObj = $(obj);
            this.tableColor = jObj.next("div")[0];
            this.title = jObj.find(".DisplayValue").first()[0];
            this.input = jObj.parent().find(".UIColorPickerValue").first()[0];
            this.showHide();
            this.getSelectedValue();
        },

        setColor:function (color) {
            if ($(this.title).hasClass(color)) {
                this.hide();
                return;
            }
            var className = "DisplayValue " + color;
            this.title.className = className;
            this.input.value = color;
            this.hide();
        },

        clearSelectedValue:function () {
            var colorCell = $(this.tableColor).find("a");
            colorCell.each(function () {
                var jObj = $(this);
                if (jObj.hasClass("SelectedColorCell")) {
                    jObj.removeClass("SelectedColorCell");
                    return false;
                }
            });
        },

        getSelectedValue:function () {
            var selectedValue = this.input.value;

            this.clearSelectedValue();
            var colorCell = $(this.tableColor).find("a");
            colorCell.each(function () {
                var jObj = $(this);
                if (jObj.hasClass(selectedValue)) {
                    jObj.addClass("SelectedColorCell");
                    return false;
                }
            });
        },

        hide:function () {
            if (eXo.webui.UIColorPicker.tableColor) {
                eXo.webui.UIColorPicker.tableColor.style.display = "none";
                eXo.webui.UIColorPicker.tableColor = null;
                eXo.webui.UIColorPicker.title = null;
                eXo.webui.UIColorPicker.input = null;
                document.onmousedown = null;
            }
        },

        showHide:function () {
            var obj = this.tableColor;
            if (obj.style.display != "block") {
                obj.style.display = "block";
            } else {
                obj.style.display = "none";
            }
        }
    };

    eXo.webui.UICombobox = {

        init:function (textbox) {
            if (typeof (textbox) == "string")
                textbox = document.getElementById(textbox);
            textbox = $(textbox).next("input");
            var UICombobox = eXo.webui.UICombobox;
            var onfocus = textbox.attr("onfocus");
            var onclick = textbox.attr("onclick");
            if (!onfocus)
                textbox.on("focus", UICombobox.show);
            if (!onclick)
                textbox.on("click", UICombobox.show);
        },

        show:function (evt) {
            var uiCombo = eXo.webui.UICombobox;
            uiCombo.items = $(this.parentNode).find("a");
            if (uiCombo.list)
                uiCombo.list.style.display = "none";
            uiCombo.list = $(this.parentNode).find(".UIComboboxContainer").first()[0];
            uiCombo.list.parentNode.style.position = "absolute";
            uiCombo.fixForIE6(this);
            uiCombo.list.style.display = "block";
            uiCombo.list.style.top = this.offsetHeight + "px";
            uiCombo.list.style.width = this.offsetWidth + "px";
            uiCombo.setSelectedItem(this);
            $(uiCombo.list).one("mousedown", false);
            $(document).one("mousedown", uiCombo.hide);
        },

        getSelectedItem:function (textbox) {
            var val = textbox.value;
            var data = eval(textbox.getAttribute("options"));
            var len = data.length;
            for (var i = 0; i < len; i++) {
                if (val == data[i])
                    return i;
            }
            return false;
        },

        setSelectedItem:function (textbox) {
            if (this.lastSelectedItem)
                $(this.lastSelectedItem).removeClass("UIComboboxSelectedItem");
            var selectedIndex = parseInt(this.getSelectedItem(textbox));
            if (selectedIndex >= 0) {
                $(this.items[selectedIndex]).addClass("UIComboboxSelectedItem");
                this.lastSelectedItem = this.items[selectedIndex];
                var y = base.Browser.findPosYInContainer(this.lastSelectedItem,
                        this.list);
                this.list.firstChild.scrollTop = y;
                var hidden = $(textbox).prev("input")[0];
                hidden.value = this.items[selectedIndex].getAttribute("value");

            }
        },

        fixForIE6:function (obj) {
            if (!base.Browser.isIE6())
                return;
            if ($(this.list).children("iframe").length > 0)
                return;
            var iframe = document.createElement("iframe");
            iframe.frameBorder = 0;
            iframe.style.width = obj.offsetWidth + "px";
            this.list.appendChild(iframe);
        },

        cancelBubbe:function (evt) {
            var _e = window.event || evt;
            _e.cancelBubble = true;
        },

        complete:function (obj, evt) {
            if (evt.keyCode == 16) {
                this.setSelectedItem(obj);
                return;
            }
            if (evt.keyCode == 13) {
                this.setSelectedItem(obj);
                this.hide();
                return;
            }
            var sVal = obj.value.toLowerCase();
            if (evt.keyCode == 8)
                sVal = sVal.substring(0, sVal.length - 1)
            if (sVal.length < 1)
                return;
            var data = eval($.trim(obj.getAttribute("options")));
            var len = data.length;
            var tmp = null;
            for (var i = 0; i < data.length; i++) {
                tmp = $.trim(data[i]);
                var idx = tmp.toLowerCase().indexOf(sVal, 0);
                if (idx == 0 && tmp.length > sVal.length) {
                    obj.value = data[i];
                    if (obj.createTextRange) {
                        hRange = obj.createTextRange();
                        hRange.findText(data[i].substr(sVal.length));
                        hRange.select();
                    } else {
                        obj.setSelectionRange(sVal.length, tmp.length);
                    }
                    break;
                }
            }
            this.setSelectedItem(obj);
        },

        hide:function () {
            eXo.webui.UICombobox.list.style.display = "none";
        },

        getValue:function (obj) {
            var UICombobox = eXo.webui.UICombobox;
            var val = obj.getAttribute("value");
            var hiddenField = $(UICombobox.list.parentNode).next("input");
            hiddenField.attr("value", val);
            var text = hiddenField.next("input");
            text.attr("value", $(obj).find(".UIComboboxLabel").first().html());
            UICombobox.list.style.display = "none";
        }
    };

    /**
     * Deprecated - use jQuery to register event, then return false instead
     */
    eXo.core.EventManager = {
        cancelBubble:function (evt) {
            if (base.Browser.isIE())
                window.event.cancelBubble = true;
            else
                evt.stopPropagation();
        },

        cancelEvent:function (evt) {
            eXo.core.EventManager.cancelBubble(evt);
            if (base.Browser.isIE())
                window.event.returnValue = true;
            else
                evt.preventDefault();
        }
    };

    var portletForm = {
        init:function (id, portalControl) {
            var tabs = $("#" + id + " .UIHorizontalTabs .MiddleTab");
            tabs.each(function () {
                var tab = $(this);
                tab.on("click", function () {
                    if (tab.attr("id") === "EditMode") {
                        portletForm.hideSaveButton(this);
                    } else {
                        portletForm.showSaveButton(this);
                    }
                    portalControl.UIHorizontalTabs.changeTabForUIFormTabpane(this, id.replace("tab-", ""), tab.attr("id"));
                    var actionLink = tab.find("~ .ExtraActions");
                    eval(actionLink.html());
                });
            });
        },

        hideSaveButton:function (comp) {
            $(comp).closest(".WorkingArea").find("div.HorizontalLayout").children(".UIAction, .uiAction").children("a.ActionButton, .btn").each(function () {
                var button = $(this);
                if (button.attr("id").indexOf("Save") >= 0) {
                    button.css("display", "none");
                }
                else if (button.attr("id").indexOf("Close") >= 0) {
                    button.html(button.attr("closeLabel"));
                }
            });
        },

        showSaveButton:function (comp) {
            $(comp).closest(".WorkingArea").find("div.HorizontalLayout").children(".UIAction, .uiAction").children("a.ActionButton, .btn").each(function () {
                var button = $(this);
                if (button.attr("id").indexOf("Save") >= 0) {
                    button.css("display", "inline-block");
                }
                else if (button.attr("id").indexOf("Close") >= 0) {
                    button.html(button.attr("cancelLabel"));
                }
            });
        }
    };

    var uiTree = {
        init:function (id, colapseClass, disableContextMenu, portalControl) {
            var parent = $('#' + id);
            if (!parent.data("collapseRegistered")) {
                parent.on('click', '.' + colapseClass, function () {
                    portalControl.UIPortalControl.collapseTree(this);
                });
                if (disableContextMenu) {
                    uiRightClickPopupMenu.disableContextMenu(id);
                }
            }
            parent.data("collapseRegistered", true);
            parent.find(".LevelUpArrowIcon").on("mousedown", function (event) {
                event.stopPropagation();
            });
        }
    };

    return {
        UIDropDownControl:eXo.webui.UIDropDownControl,
        UITree:uiTree,
        UIColorPicker:eXo.webui.UIColorPicker,
        UICombobox:eXo.webui.UICombobox,
        UIPortletForm:portletForm
    };
})($, base, portalControl, uiRightClickPopupMenu);