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

    module("bootstrap-scrollspy")

      test("should provide no conflict", function () {
        var scrollspy = $.fn.scrollspy.noConflict()
        ok(!$.fn.scrollspy, 'scrollspy was set back to undefined (org value)')
        $.fn.scrollspy = scrollspy
      })

      test("should be defined on jquery object", function () {
        ok($(document.body).scrollspy, 'scrollspy method is defined')
      })

      test("should return element", function () {
        ok($(document.body).scrollspy()[0] == document.body, 'document.body returned')
      })

      test("should switch active class on scroll", function () {
        var sectionHTML = '<div id="masthead"></div>'
          , $section = $(sectionHTML).append('#qunit-fixture')
          , topbarHTML ='<div class="topbar">'
          + '<div class="topbar-inner">'
          + '<div class="container">'
          + '<h3><a href="#">Bootstrap</a></h3>'
          + '<ul class="nav">'
          + '<li><a href="#masthead">Overview</a></li>'
          + '</ul>'
          + '</div>'
          + '</div>'
          + '</div>'
          , $topbar = $(topbarHTML).scrollspy()

        ok($topbar.find('.active', true))
      })

})