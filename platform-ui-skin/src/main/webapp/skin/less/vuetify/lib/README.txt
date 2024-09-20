Modifications applied on imported libraries:
* vuetify.less:
  - calc() is modified to ~"calc()": anything inside brackets in LESS is calculated at CSS transformation time,
      thus ~"..." is used to force less compiler to ignore computing value and let its interpretationn made in browser side.
  - Prefix general classes with ":not(.ignore-vuetify-classes)": this is added to be able to use Platform css classes inside Vuetify application without interferring with Vuetify CSS
      (for example: btn, btn-primary, alert-warning ...)
  - Delete font-family definition on ".v-application" element: the default font-family for all Vuetify components has to be the inherited font from eXo Platform.
  - Delete font definition on button, input, optgroup, select and textarea elements to use the inherited font from eXo Platform or the icons font-family if one of those elements defines an icon.
  - Delete padding and margin reset definition defined for all elements:
      the default margin and padding definition for all elements using (*) generic selector is deleted to avoid applying it for all the application including default elements style predefined in eXo Platform
  - Change responsibe breakpoints :
      @mobileWidth: 768px;
      @tabletWidth: 980px;
      @largeTabletWidth: 1024px;
      @desktop: 1280px;
      @largeDesktop: 1700px;
  - .v-tabs--centered > .v-tabs-bar .v-tabs-slider-wrapper (centered tabs) doesn't use centered tabs because of bad usage of CSS priorities, thus !important is added to effectively center tabs
  - delete '!important' from .v-card-flat:@box-shadow (line 22363) to avoid force disabling box-shadow on cards when using flat attribute on v-card
  - Add fix on v-alert.prominent.dense icon size introduced in 2.4
  - Add @baseBorderRadius variable to use centralized border radius for Vuetify components
  - Change all rgba(0, 0, 0, 0.6) to use @textHeaderColor or @textSubtitleColor
  - Change all rgba(0, 0, 0, 0.87) to use @textColor
  - Change all rgba(0, 0, 0, 0.38) to use @textDisabledColor
  - Change text-transform: capitalize; on .v-btn
  - Change letter-spacing on .v-tab
  - Delete text-transform on .v-tab
  - Delete font-size on .v-tab
  - Change color to use @menuTextColor on .v-tab
  - Delete .v-card--link focus background to not have grey background once clicked
  - Fix .v-list-item__title & .v-list-item__subtitle line-height in dense configuration
  - Change rgba(0, 0, 0, 0.38) by @placeholderText variable in :placeholder style
