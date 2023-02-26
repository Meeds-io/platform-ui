/*
 * This file is part of the Meeds project (https://meeds.io/).
 * Copyright (C) 2020 Meeds Association
 * contact@meeds.io
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
$(function () {

    module("bootstrap-alerts")

      test("should provide no conflict", function () {
        var alert = $.fn.alert.noConflict()
        ok(!$.fn.alert, 'alert was set back to undefined (org value)')
        $.fn.alert = alert
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).alert, 'alert method is defined')
      })

      test("should return element", function () {
        ok($(document.body).alert()[0] == document.body, 'document.body returned')
      })

      test("should fade element out on clicking .close", function () {
        var alertHTML = '<div class="alert-message warning fade in">'
          + '<a class="close" href="#" data-dismiss="alert">×</a>'
          + '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>'
          + '</div>'
          , alert = $(alertHTML).alert()

        alert.find('.close').click()

        ok(!alert.hasClass('in'), 'remove .in class on .close click')
      })

      test("should remove element when clicking .close", function () {
        $.support.transition = false

        var alertHTML = '<div class="alert-message warning fade in">'
          + '<a class="close" href="#" data-dismiss="alert">×</a>'
          + '<p><strong>Holy guacamole!</strong> Best check yo self, you\'re not looking too good.</p>'
          + '</div>'
          , alert = $(alertHTML).appendTo('#qunit-fixture').alert()

        ok($('#qunit-fixture').find('.alert-message').length, 'element added to dom')

        alert.find('.close').click()

        ok(!$('#qunit-fixture').find('.alert-message').length, 'element removed from dom')
      })

      test("should not fire closed when close is prevented", function () {
        $.support.transition = false
        stop();
        $('<div class="alert"/>')
          .bind('close', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .bind('closed', function () {
            ok(false);
          })
          .alert('close')
      })

})