
/* Please use this command to compile this file into the parent `js` directory:
    coffee --no-header -w -o ../ -c bika.lims.site.coffee
 */

(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  window.SiteView = (function() {
    function SiteView() {
      this.on_ajax_error = bind(this.on_ajax_error, this);
      this.on_ajax_end = bind(this.on_ajax_end, this);
      this.on_ajax_start = bind(this.on_ajax_start, this);
      this.on_service_info_click = bind(this.on_service_info_click, this);
      this.on_reference_definition_list_change = bind(this.on_reference_definition_list_change, this);
      this.on_numeric_field_keypress = bind(this.on_numeric_field_keypress, this);
      this.on_numeric_field_paste = bind(this.on_numeric_field_paste, this);
      this.on_at_float_field_keyup = bind(this.on_at_float_field_keyup, this);
      this.on_at_integer_field_keyup = bind(this.on_at_integer_field_keyup, this);
      this.on_autocomplete_keydown = bind(this.on_autocomplete_keydown, this);
      this.on_date_range_end_change = bind(this.on_date_range_end_change, this);
      this.on_date_range_start_change = bind(this.on_date_range_start_change, this);
      this.stop_spinner = bind(this.stop_spinner, this);
      this.start_spinner = bind(this.start_spinner, this);
      this.notify_in_panel = bind(this.notify_in_panel, this);
      this.notificationPanel = bind(this.notificationPanel, this);
      this.set_cookie = bind(this.set_cookie, this);
      this.setCookie = bind(this.setCookie, this);
      this.read_cookie = bind(this.read_cookie, this);
      this.readCookie = bind(this.readCookie, this);
      this.log = bind(this.log, this);
      this.portal_alert = bind(this.portal_alert, this);
      this.portalAlert = bind(this.portalAlert, this);
      this.get_authenticator = bind(this.get_authenticator, this);
      this.get_portal_url = bind(this.get_portal_url, this);
      this.init_referencedefinition = bind(this.init_referencedefinition, this);
      this.init_datepickers = bind(this.init_datepickers, this);
      this.init_spinner = bind(this.init_spinner, this);
      this.init_client_add_overlay = bind(this.init_client_add_overlay, this);
      this.bind_eventhandler = bind(this.bind_eventhandler, this);
      this.load = bind(this.load, this);
    }

    SiteView.prototype.load = function() {
      console.debug("SiteView::load");
      jarn.i18n.loadCatalog('senaite.core');
      this._ = window.jarn.i18n.MessageFactory("senaite.core");
      this.init_spinner();
      this.init_client_add_overlay();
      this.init_datepickers();
      this.init_referencedefinition();
      this.bind_eventhandler();
      return this.allowed_keys = [8, 9, 13, 35, 36, 37, 39, 46, 44, 60, 62, 45, 69, 101, 61];
    };


    /* INITIALIZERS */

    SiteView.prototype.bind_eventhandler = function() {

      /*
       * Binds callbacks on elements
       *
       * N.B. We attach all the events to the form and refine the selector to
       * delegate the event: https://learn.jquery.com/events/event-delegation/
       */
      console.debug("SiteView::bind_eventhandler");
      $("body").on("change", "#ReferenceDefinition\\:list", this.on_reference_definition_list_change);
      $("body").on("keypress", ".numeric", this.on_numeric_field_keypress);
      $("body").on("paste", ".numeric", this.on_numeric_field_paste);
      $("body").on("keyup", "input[name*='\\:int\'], .ArchetypesIntegerWidget input", this.on_at_integer_field_keyup);
      $("body").on("keyup", "input[name*='\\:float\'], .ArchetypesDecimalWidget input", this.on_at_float_field_keyup);
      $("body").on("keydown", "input.autocomplete", this.on_autocomplete_keydown);
      $("body").on("change", ".date_range_start", this.on_date_range_start_change);
      $("body").on("change", ".date_range_end", this.on_date_range_end_change);
      $("body").on("click", "a.service_info", this.on_service_info_click);
      $(document).on("ajaxStart", this.on_ajax_start);
      $(document).on("ajaxStop", this.on_ajax_end);
      return $(document).on("ajaxError", this.on_ajax_error);
    };

    SiteView.prototype.init_client_add_overlay = function() {

      /*
       * Initialize Client Overlay
       */
      console.debug("SiteView::init_client_add_overlay");
      return $('a.add_client').prepOverlay({
        subtype: 'ajax',
        filter: 'head>*,#content>*:not(div.configlet),dl.portalMessage.error,dl.portalMessage.info',
        formselector: '#client-base-edit',
        closeselector: '[name="form.button.cancel"]',
        width: '70%',
        noform: 'close',
        config: {
          closeOnEsc: false,
          onLoad: function() {
            this.getOverlay().find('.ArchetypesRemarksWidget').remove();
          },
          onClose: function() {}
        }
      });
    };

    SiteView.prototype.init_spinner = function() {

      /*
       * Initialize Spinner Overlay
       */
      console.debug("SiteView::init_spinner");
      $(document).unbind('ajaxStart');
      $(document).unbind('ajaxStop');
      $('#ajax-spinner').remove();
      this.counter = 0;
      this.spinner = $("<div id='bika-spinner'><img src='" + (this.get_portal_url()) + "/spinner.gif' alt=''/></div>");
      return this.spinner.appendTo('body').hide();
    };

    SiteView.prototype.init_datepickers = function() {

      /*
       * Initialize date pickers
       *
       * XXX Where are these event handlers used?
       */
      var curDate, dateFormat, limitString, y;
      console.debug("SiteView::init_datepickers");
      curDate = new Date;
      y = curDate.getFullYear();
      limitString = '1900:' + y;
      dateFormat = this._('date_format_short_datepicker');
      if (dateFormat === 'date_format_short_datepicker') {
        dateFormat = 'yy-mm-dd';
      }
      $('input.datepicker_range').datepicker({

        /**
        This function defines a datepicker for a date range. Both input
        elements should be siblings and have the class 'date_range_start' and
        'date_range_end'.
         */
        showOn: 'focus',
        showAnim: '',
        changeMonth: true,
        changeYear: true,
        dateFormat: dateFormat,
        yearRange: limitString
      });
      $('input.datepicker').on('click', function() {
        console.warn("SiteView::datepicker.click: Refactor this event handler!");
        $(this).datepicker({
          showOn: 'focus',
          showAnim: '',
          changeMonth: true,
          changeYear: true,
          dateFormat: dateFormat,
          yearRange: limitString
        }).click(function() {
          $(this).attr('value', '');
        }).focus();
      });
      $('input.datepicker_nofuture').on('click', function() {
        console.warn("SiteView::datetimepicker_nofuture.click: Refactor this event handler!");
        $(this).datepicker({
          showOn: 'focus',
          showAnim: '',
          changeMonth: true,
          changeYear: true,
          maxDate: curDate,
          dateFormat: dateFormat,
          yearRange: limitString
        }).click(function() {
          $(this).attr('value', '');
        }).focus();
      });
      $('input.datepicker_2months').on('click', function() {
        console.warn("SiteView::datetimepicker_2months.click: Refactor this event handler!");
        $(this).datepicker({
          showOn: 'focus',
          showAnim: '',
          changeMonth: true,
          changeYear: true,
          maxDate: '+0d',
          numberOfMonths: 2,
          dateFormat: dateFormat,
          yearRange: limitString
        }).click(function() {
          $(this).attr('value', '');
        }).focus();
      });
      return $('input.datetimepicker_nofuture').on('click', function() {
        console.warn("SiteView::datetimepicker_nofuture.click: Refactor this event handler!");
        $(this).datetimepicker({
          showOn: 'focus',
          showAnim: '',
          changeMonth: true,
          changeYear: true,
          maxDate: curDate,
          dateFormat: dateFormat,
          yearRange: limitString,
          timeFormat: 'HH:mm',
          beforeShow: function() {
            setTimeout((function() {
              $('.ui-datepicker').css('z-index', 99999999999999);
            }), 0);
          }
        }).click(function() {
          $(this).attr('value', '');
        }).focus();
      });
    };

    SiteView.prototype.init_referencedefinition = function() {

      /*
       * Initialize reference definition selection
       * XXX: When is this used?
       */
      console.debug("SiteView::init_referencedefinition");
      if ($('#ReferenceDefinition:list').val() !== '') {
        console.warn("SiteView::init_referencedefinition: Refactor this method!");
        return $('#ReferenceDefinition:list').change();
      }
    };


    /* METHODS */

    SiteView.prototype.get_portal_url = function() {

      /*
       * Return the portal url
       */
      return window.portal_url;
    };

    SiteView.prototype.get_authenticator = function() {

      /*
       * Get the authenticator value
       */
      return $("input[name='_authenticator']").val();
    };

    SiteView.prototype.portalAlert = function(html) {

      /*
       * BBB: Use portal_alert
       */
      console.warn("SiteView::portalAlert: Please use portal_alert method instead.");
      return this.portal_alert(html);
    };

    SiteView.prototype.portal_alert = function(html) {

      /*
       * Display a portal alert box
       */
      var alerts;
      console.debug("SiteView::portal_alert");
      alerts = $('#portal-alert');
      if (alerts.length === 0) {
        $('#portal-header').append("<div id='portal-alert' style='display:none'><div class='portal-alert-item'>" + html + "</div></div>");
      } else {
        alerts.append("<div class='portal-alert-item'>" + html + "</div>");
      }
      alerts.fadeIn();
    };

    SiteView.prototype.log = function(message) {

      /*
       * Log message via bika.lims.log
       */
      console.debug("SiteView::log: message=" + message);
      return window.bika.lims.log(message);
    };

    SiteView.prototype.readCookie = function(cname) {

      /*
       * BBB: Use read_cookie
       */
      console.warn("SiteView::readCookie: Please use read_cookie method instead.");
      return this.read_cookie(cname);
    };

    SiteView.prototype.read_cookie = function(cname) {

      /*
       * Read cookie value
       */
      var c, ca, i, name;
      console.debug("SiteView::read_cookie:" + cname);
      name = cname + '=';
      ca = document.cookie.split(';');
      i = 0;
      while (i < ca.length) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
          return c.substring(name.length, c.length);
        }
        i++;
      }
      return null;
    };

    SiteView.prototype.setCookie = function(cname, cvalue) {

      /*
       * BBB: Use set_cookie
       */
      console.warn("SiteView::setCookie: Please use set_cookie method instead.");
      return this.set_cookie(cname, cvalue);
    };

    SiteView.prototype.set_cookie = function(cname, cvalue) {

      /*
       * Read cookie value
       */
      var d, expires;
      console.debug("SiteView::set_cookie:cname=" + cname + ", cvalue=" + cvalue);
      d = new Date;
      d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
      expires = 'expires=' + d.toUTCString();
      document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
    };

    SiteView.prototype.notificationPanel = function(data, mode) {

      /*
       * BBB: Use notify_in_panel
       */
      console.warn("SiteView::notificationPanel: Please use notfiy_in_panel method instead.");
      return this.notify_in_panel(data, mode);
    };

    SiteView.prototype.notify_in_panel = function(data, mode) {

      /*
       * Render an alert inside the content panel, e.g.in autosave of ARView
       */
      var html;
      console.debug("SiteView::notify_in_panel:data=" + data + ", mode=" + mode);
      $('#panel-notification').remove();
      html = "<div id='panel-notification' style='display:none'><div class='" + mode + "-notification-item'>" + data + "</div></div>";
      $('div#viewlet-above-content-title').append(html);
      $('#panel-notification').fadeIn('slow', 'linear', function() {
        setTimeout((function() {
          $('#panel-notification').fadeOut('slow', 'linear');
        }), 3000);
      });
    };

    SiteView.prototype.start_spinner = function() {

      /*
       * Start Spinner Overlay
       */
      console.debug("SiteView::start_spinner");
      this.counter++;
      this.timer = setTimeout(((function(_this) {
        return function() {
          if (_this.counter > 0) {
            _this.spinner.show('fast');
          }
        };
      })(this)), 500);
    };

    SiteView.prototype.stop_spinner = function() {

      /*
       * Stop Spinner Overlay
       */
      console.debug("SiteView::stop_spinner");
      this.counter--;
      if (this.counter < 0) {
        this.counter = 0;
      }
      if (this.counter === 0) {
        clearTimeout(this.timer);
        this.spinner.stop();
        this.spinner.hide();
      }
    };


    /* EVENT HANDLER */

    SiteView.prototype.on_date_range_start_change = function(event) {

      /*
       * Eventhandler for Date Range Filtering
       *
       * 1. Go to Setup and enable advanced filter bar
       * 2. Set the start date of adv. filter bar, e.g. in AR listing
       */
      var $el, brother, date_element, el;
      console.debug("°°° SiteView::on_date_range_start_change °°°");
      el = event.currentTarget;
      $el = $(el);
      date_element = $el.datepicker('getDate');
      brother = $el.siblings('.date_range_end');
      return $(brother).datepicker('option', 'minDate', date_element);
    };

    SiteView.prototype.on_date_range_end_change = function(event) {

      /*
       * Eventhandler for Date Range Filtering
       *
       * 1. Go to Setup and enable advanced filter bar
       * 2. Set the start date of adv. filter bar, e.g. in AR listing
       */
      var $el, brother, date_element, el;
      console.debug("°°° SiteView::on_date_range_end_change °°°");
      el = event.currentTarget;
      $el = $(el);
      date_element = $el.datepicker('getDate');
      brother = $el.siblings('.date_range_start');
      return $(brother).datepicker('option', 'maxDate', date_element);
    };

    SiteView.prototype.on_autocomplete_keydown = function(event) {

      /*
       * Eventhandler for Autocomplete fields
       *
       * XXX: Refactor if it is clear where this code is used!
       */
      var $el, availableTags, el, extractLast, split;
      console.debug("°°° SiteView::on_autocomplete_keydown °°°");
      el = event.currentTarget;
      $el = $(el);
      availableTags = $.parseJSON($('input.autocomplete').attr('voc'));
      split = function(val) {
        return val.split(/,\s*/);
      };
      extractLast = function(term) {
        return split(term).pop();
      };
      if (event.keyCode === $.ui.keyCode.TAB && $el.autocomplete('instance').menu.active) {
        event.preventDefault();
      }
      return;
      return $el.autocomplete({
        minLength: 0,
        source: function(request, response) {
          response($.ui.autocomplete.filter(availableTags, extractLast(request.term)));
        },
        focus: function() {
          return false;
        },
        select: function(event, ui) {
          var terms;
          terms = split($el.val());
          terms.pop();
          terms.push(ui.item.value);
          terms.push('');
          this.el.val(terms.join(', '));
          return false;
        }
      });
    };

    SiteView.prototype.on_at_integer_field_keyup = function(event) {

      /*
       * Eventhandler for AT integer fields
       */
      var $el, el;
      console.debug("°°° SiteView::on_at_integer_field_keyup °°°");
      el = event.currentTarget;
      $el = $(el);
      if (/\D/g.test($el.val())) {
        $el.val($el.val().replace(/\D/g, ''));
      }
    };

    SiteView.prototype.on_at_float_field_keyup = function(event) {

      /*
       * Eventhandler for AT float fields
       */
      var $el, el;
      console.debug("°°° SiteView::on_at_float_field_keyup °°°");
      el = event.currentTarget;
      $el = $(el);
      if (/[^-.\d]/g.test($el.val())) {
        $el.val($el.val().replace(/[^.\d]/g, ''));
      }
    };

    SiteView.prototype.on_numeric_field_paste = function(event) {

      /*
       * Eventhandler when the user pasted a value inside a numeric field.
       */
      var $el, el;
      console.debug("°°° SiteView::on_numeric_field_paste °°°");
      el = event.currentTarget;
      $el = $(el);
      window.setTimeout((function() {
        $el.val($el.val().replace(',', '.'));
      }), 0);
    };

    SiteView.prototype.on_numeric_field_keypress = function(event) {

      /*
       * Eventhandler when the user pressed a key inside a numeric field.
       */
      var $el, el, isAllowedKey, key;
      console.debug("°°° SiteView::on_numeric_field_keypress °°°");
      el = event.currentTarget;
      $el = $(el);
      key = event.which;
      isAllowedKey = this.allowed_keys.join(',').match(new RegExp(key));
      if (!key || 48 <= key && key <= 57 || isAllowedKey) {
        window.setTimeout((function() {
          $el.val($el.val().replace(',', '.'));
        }), 0);
        return;
      } else {
        event.preventDefault();
      }
    };

    SiteView.prototype.on_reference_definition_list_change = function(event) {

      /*
       * Eventhandler when the user clicked on the reference defintion dropdown.
       *
       * 1. Add a ReferenceDefintion at /bika_setup/bika_referencedefinitions
       * 2. Add a Supplier in /bika_setup/bika_suppliers
       * 3. Add a ReferenceSample in /bika_setup/bika_suppliers/supplier-1/portal_factory/ReferenceSample
       *
       * The dropdown with the id="ReferenceDefinition:list" is rendered there.
       */
      var $el, authenticator, el, option, uid;
      console.debug("°°° SiteView::on_reference_definition_list_change °°°");
      el = event.currentTarget;
      $el = $(el);
      authenticator = this.get_authenticator();
      uid = $el.val();
      option = $el.children(':selected').html();
      if (uid === '') {
        $('#Blank').prop('checked', false);
        $('#Hazardous').prop('checked', false);
        $('.bika-listing-table').load('referenceresults', {
          '_authenticator': authenticator
        });
        return;
      }
      if (option.search(this._('(Blank)')) > -1 || option.search("(Blank)") > -1) {
        $('#Blank').prop('checked', true);
      } else {
        $('#Blank').prop('checked', false);
      }
      if (option.search(this._('(Hazardous)')) > -1 || option.search("(Hazardous)") > -1) {
        $('#Hazardous').prop('checked', true);
      } else {
        $('#Hazardous').prop('checked', false);
      }
      $('.bika-listing-table').load('referenceresults', {
        '_authenticator': authenticator,
        'uid': uid
      });
    };

    SiteView.prototype.on_service_info_click = function(event) {

      /*
       * Eventhandler when the service info icon was clicked
       */
      var el;
      console.debug("°°° SiteView::on_service_info_click °°°");
      event.preventDefault();
      el = event.currentTarget;
      $(el).prepOverlay({
        subtype: "ajax",
        width: '70%',
        filter: '#content>*:not(div#portal-column-content)',
        config: {
          closeOnClick: true,
          closeOnEsc: true,
          onBeforeLoad: function(event) {
            var overlay;
            overlay = this.getOverlay();
            return overlay.draggable();
          },
          onLoad: function(event) {
            event = new Event("DOMContentLoaded", {});
            return window.document.dispatchEvent(event);
          }
        }
      });
      return $(el).click();
    };

    SiteView.prototype.on_ajax_start = function(event) {

      /*
       * Eventhandler if an global Ajax Request started
       */
      console.debug("°°° SiteView::on_ajax_start °°°");
      return this.start_spinner();
    };

    SiteView.prototype.on_ajax_end = function(event) {

      /*
       * Eventhandler if an global Ajax Request ended
       */
      console.debug("°°° SiteView::on_ajax_end °°°");
      return this.stop_spinner();
    };

    SiteView.prototype.on_ajax_error = function(event, jqxhr, settings, thrownError) {

      /*
       * Eventhandler if an global Ajax Request error
       */
      console.debug("°°° SiteView::on_ajax_error °°°");
      this.stop_spinner();
      return this.log("Error at " + settings.url + ": " + thrownError);
    };

    return SiteView;

  })();

}).call(this);
