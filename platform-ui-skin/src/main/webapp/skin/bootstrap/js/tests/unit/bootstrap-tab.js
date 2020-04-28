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

    module("bootstrap-tabs")

      test("should provide no conflict", function () {
        var tab = $.fn.tab.noConflict()
        ok(!$.fn.tab, 'tab was set back to undefined (org value)')
        $.fn.tab = tab
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).tab, 'tabs method is defined')
      })

      test("should return element", function () {
        ok($(document.body).tab()[0] == document.body, 'document.body returned')
      })

      test("should activate element by tab id", function () {
        var tabsHTML =
            '<ul class="tabs">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture")

        $(tabsHTML).find('li:last a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "profile")

        $(tabsHTML).find('li:first a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "home")
      })

      test("should activate element by tab id", function () {
        var pillsHTML =
            '<ul class="pills">'
          + '<li><a href="#home">Home</a></li>'
          + '<li><a href="#profile">Profile</a></li>'
          + '</ul>'

        $('<ul><li id="home"></li><li id="profile"></li></ul>').appendTo("#qunit-fixture")

        $(pillsHTML).find('li:last a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "profile")

        $(pillsHTML).find('li:first a').tab('show')
        equals($("#qunit-fixture").find('.active').attr('id'), "home")
      })


      test("should not fire closed when close is prevented", function () {
        $.support.transition = false
        stop();
        $('<div class="tab"/>')
          .bind('show', function (e) {
            e.preventDefault();
            ok(true);
            start();
          })
          .bind('shown', function () {
            ok(false);
          })
          .tab('show')
      })

      test("show and shown events should reference correct relatedTarget", function () {
        var dropHTML =
            '<ul class="drop">'
          + '<li class="dropdown"><a data-toggle="dropdown" href="#">1</a>'
          + '<ul class="dropdown-menu">'
          + '<li><a href="#1-1" data-toggle="tab">1-1</a></li>'
          + '<li><a href="#1-2" data-toggle="tab">1-2</a></li>'
          + '</ul>'
          + '</li>'
          + '</ul>'

        $(dropHTML).find('ul>li:first a').tab('show').end()
          .find('ul>li:last a').on('show', function(event){
            equals(event.relatedTarget.hash, "#1-1")
          }).on('shown', function(event){
            equals(event.relatedTarget.hash, "#1-1")
          }).tab('show')
      })

})