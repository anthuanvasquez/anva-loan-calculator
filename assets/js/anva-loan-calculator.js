( function( window, document, undefined ) {
    /*
     * Date Format
     * 
     * URL: http://blog.stevenlevithan.com/archives/date-time-format
     */
    var dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d:    d,
                    dd:   pad(d),
                    ddd:  dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m:    m + 1,
                    mm:   pad(m + 1),
                    mmm:  dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy:   String(y).slice(2),
                    yyyy: y,
                    h:    H % 12 || 12,
                    hh:   pad(H % 12 || 12),
                    H:    H,
                    HH:   pad(H),
                    M:    M,
                    MM:   pad(M),
                    s:    s,
                    ss:   pad(s),
                    l:    pad(L, 3),
                    L:    pad(L > 99 ? Math.round(L / 10) : L),
                    t:    H < 12 ? "a"  : "p",
                    tt:   H < 12 ? "am" : "pm",
                    T:    H < 12 ? "A"  : "P",
                    TT:   H < 12 ? "AM" : "PM",
                    Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    dateFormat.masks = {
        "default":      "ddd mmm dd yyyy HH:MM:ss",
        shortDate:      "m/d/yy",
        mediumDate:     "mmm d, yyyy",
        longDate:       "mmmm d, yyyy",
        fullDate:       "dddd, mmmm d, yyyy",
        shortTime:      "h:MM TT",
        mediumTime:     "h:MM:ss TT",
        longTime:       "h:MM:ss TT Z",
        isoDate:        "yyyy-mm-dd",
        isoTime:        "HH:MM:ss",
        isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

    // For convenience...
    Date.prototype.format = function ( mask, utc ) {
        return dateFormat(this, mask, utc);
    };

    Date.prototype.addDays = function( days ) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    };
    
    Number.prototype.numberFormat = function(decimals, dec_point, thousands_sep) {
        dec_point = typeof dec_point !== 'undefined' ? dec_point : '.';
        thousands_sep = typeof thousands_sep !== 'undefined' ? thousands_sep : ',';

        var parts = this.toFixed(decimals).split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_sep);

        return parts.join(dec_point);
    };

    /**
     * Fix format values.
     *
     * @since  1.0.0
     * @return string               
     */
    function fixVal( num ) {
        return num.numberFormat(2);
    }

    // Loan Calculator
    var loanCalc = {

        loanForm:   document.getElementById('loanForm'),
        loanSubmit: document.getElementById('loanSubmit'),
        loanClear:  document.getElementById('loanClear'),

        init: function() {
            
            var loanMonth = document.getElementById('pay'),
                loanYear  = document.getElementById('pay_years')
            ;

            // Button submit
            if ( this.loanSubmit ) {
                this.loanSubmit.addEventListener('click', loanCalc.validateFields);
            }

            // Button clear
            if ( this.loanClear ) {
                this.loanClear.addEventListener('click', loanCalc.clearScreen);
            }

            if ( loanMonth ) {
                loanMonth.addEventListener('change', loanCalc.yearConvertion, false);
            }

            if ( loanYear ) {
                loanYear.addEventListener('change', loanCalc.monthConvertion, false);
            }

        },

        /*
         * Check valid fields.
         *
         * @since 1.0.0
         * @return boolean
         */
        validateFields: function() {
            
            var firstName = top.document.loanForm.firstName.value,
                loanamt   = top.document.loanForm.amt.value,
                paymnt    = top.document.loanForm.pay.value,
                rate      = top.document.loanForm.rate.value,
                alert     = document.getElementById('loanMessage'),
                email     = document.getElementById('emailCheck').checked
            ;

            if ( firstName === "" ) {
                alert.innerHTML = "Por favor introduce tu nombre.";
                top.document.loanForm.firstName.value = "";
                top.document.loanForm.firstName.focus();
                return false;
                
            } else if ( loanamt === "" || isNaN(parseFloat(loanamt)) || loanamt === 0 ) {
                
                alert.innerHTML = "Por favor ingrese un monto valido para el prestamo.";
                top.document.loanForm.amt.value = "";
                top.document.loanForm.amt.focus();
                
                return false;
            
            } else if ( paymnt === "" || isNaN(parseFloat(paymnt)) || paymnt === 0 ) {
                
                alert.innerHTML = "Por favor, introduzca un nÃºmero de pago vÃ¡lido.";
                top.document.loanForm.pay.value = "";
                top.document.loanForm.pay.focus();
                
                return false;
                
            } else if ( rate === "" || isNaN(parseFloat(rate)) || rate === 0 ) {
                
                alert.innerHTML = "Por favor introduce la tasa de interÃ©s anual.";
                top.document.loanForm.rate.value = "";
                top.document.loanForm.rate.focus();
                
                return false;

            } else if ( email && top.document.loanForm.email.value === "" ) {
                ;
                
                alert.innerHTML = "No deje el campo de email vacio.";
                top.document.loanForm.email.focus();

                return false
                
            } else {
                loanCalc.show(); 
            }
        },

        /**
         * Show overview and history tables.
         * 
         * @return string [description]
         */
        show: function() {
            
            var firstName   = top.document.loanForm.firstName.value,
                amount      = parseFloat( top.document.loanForm.amt.value ),
                numPay      = parseInt( top.document.loanForm.pay.value ),
                rate        = parseFloat( top.document.loanForm.rate.value )
            ;

            // Set overlay on submit report
            var overlay      = document.getElementById('loan_overlay'),
                pay_type     = top.document.loanForm.pay_type.value,
                payTypeCount = 0
            ;
            
            // Overlay
            overlay.className += 'loan__overlay active';

            // Convert rate value
            rate = ( rate / 100 );
            
            switch ( pay_type ) {
                case "monthly":
                    payTypeCount = 12;
                break;

                case "biweekly":
                    payTypeCount = 24;
                    numPay = numPay * 2;
                break;
                
                case "weekly":
                    payTypeCount = 48;
                    numPay = numPay * 4;
                break;
                
                case "quarterly":
                    payTypeCount = 4;
                    numPay = numPay / 3;
                break;
                
                case "semi-annual":
                    payTypeCount = 6;
                    numPay = numPay / 6;
                break;
                
                case "annual":
                    payTypeCount = 1;
                    numPay = numPay / 12;
                break;
            }

            var ddays    = 0,
                date     = new Date(),
                monthly  = ( rate / payTypeCount ),
                payment  = ( ( amount * monthly ) / ( 1 - Math.pow( ( 1 + monthly ), -numPay ) ) ),
                total    = ( payment * numPay ),
                interest = ( total - amount ),
                output   = "",
                detail   = ""
            ;

            // Loan Overview
            output += "<h2 class='loan__heading loan__heading--overview'>Descripcion de Prestamo</h2>";
            output += "<table class='loan__table loan__table--bordered loan__table--overview'>";
            output += "<tr>";
            output += "<td>Beneficiario:</td>";
            output += "<td align='right'>"+firstName+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Importe del Prestamo:</td>";
            output += "<td align='right'>$"+amount+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Numero de Pagos:</td>";
            output += "<td align='right'>"+numPay+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Tasa Anual:</td>";
            output += "<td align='right'>"+fixVal(rate)+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Tasa Mensual:</td>";
            output += "<td align='right'>"+fixVal(monthly)+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Pago Programado:</td>";
            output += "<td align='right'>$"+fixVal(payment)+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Total a Pagar:</td>";
            output += "<td align='right'>$"+fixVal(total)+"</td>";
            output += "</tr>";
            output += "<tr>";
            output += "<td>Total de InterÃ©s:</td>";
            output += "<td align='right'>$" + fixVal( interest ) + "</td>";
            output += "</tr>";
            output += "</table>";

            // Loan History
            detail += "<h2 class='loan__heading loan__heading--history'>Tabla de Amortizacion</h2>";
            detail += "<table class='loan__table loan__table--striped loan__table--history table table-striped'>";
            detail += "<tr>";
            detail += "<th>Pay No.</th>";
            detail += "<th>Date</th>";
            detail += "<th>Pago Programado</th>";
            detail += "<th>Rate</th>";
            detail += "<th>Principal</th>";
            detail += "<th>Balance</th>";
            detail += "</tr>";
            detail += "<tr>";
            detail += "<td align='center'>0</td>";
            detail += "<td>&nbsp;</td>";
            detail += "<td>&nbsp;</td>";
            detail += "<td>&nbsp;</td>";
            detail += "<td>&nbsp;</td>";
            detail += "<td align='right'>" + fixVal( amount )+"</td>";
            detail += "</tr>";

            var newPrincipal = amount;

            var i = 1,
                currentDate,
                dateString
            ;

            while ( i <= numPay ) {
                
                var newInterest  = ( monthly * newPrincipal ),
                    reduction    = ( payment - newInterest ),
                    newPrincipal = ( newPrincipal - reduction ),
                    currentDate  = date.addDays( ddays ),
                    dateString   = dateFormat( currentDate, "dd/mm/yyyy" ).toString()
                ;

                // Quincenal
                if ( pay_type === "biweekly" ) {
                    ddays = ddays + 15;

                // Semanal
                } else if ( pay_type === "weekly"  ) {
                    ddays = ddays + 7;

                // Trimestral
                } else if ( pay_type === "quarterly" ) {
                    ddays = ddays + 90;

                // Semestral
                } else if ( pay_type === "semi-annual" ) {
                    ddays = ddays + 180;

                // Anual
                } else if ( pay_type === "annual" ) {

                    // Check leap-year
                    var year = currentDate.getFullYear();

                    if ( ( year % 4 === 0 ) && ( ( year % 100 !== 0 ) || ( year % 400 === 0 ) ) ) {
                        ddays = ddays + 366;
                    } else {
                        ddays = ddays + 365;
                    }

                // Monthly
                } else {
                    ddays = ddays + 30;
                }
                
                detail += "<tr>";
                detail += "<td align='center'>" + i + "</td>";
                detail += "<td align='right'>" + dateString + "</td>";
                detail += "<td align='right'>" + fixVal(payment) + "</td>";
                detail += "<td align='right'>" + fixVal(newInterest) + "</td>";
                detail += "<td align='right'>" + fixVal(reduction) + "</td>";
                detail += "<td align='right'>" + fixVal(newPrincipal) + "</td>";
                detail += "</tr>";

                i++;
            }

            detail += "</table>";
            detail += "<button type='button' id='loanPrint' class='loand__button loan__button--print button'>Imprimir</button>";

            document.getElementById("pmt").innerHTML         = output;
            document.getElementById("det").innerHTML         = detail;
            document.getElementById('loanMessage').innerHTML = "";

            // Remove overlay
            overlay.className = 'loan__overlay';

            loanCalc.printDiv();

            // jQuery(".table.table-striped")
            // .tablesorter({widthFixed: true, widgets: ['zebra']}) 
            // .tablesorterPager({container: $("#pager")});
        
        },

        sendEmail: function() {

        },

        /*
         * Reset form.
         */
        clearScreen: function() {
            
            var today = new Date();

            // Fields
            top.document.loanForm.firstName.value      = "";
            top.document.loanForm.pay.value            = "";
            top.document.loanForm.pay_years.value      = "";
            top.document.loanForm.rate.value           = "";
            top.document.loanForm.pay_type.value       = "monthly"; // Set to months
            top.document.loanForm.amt.value            = "";
            top.document.loanForm.days.value           = today.getDate();
            top.document.loanForm.months.selectedIndex = today.getMonth();
            top.document.loanForm.years.value          = today.getFullYear();
            
            // Elements
            document.getElementById("pmt").innerHTML         = "";
            document.getElementById("det").innerHTML         = "";
            document.getElementById('loanMessage').innerHTML = "";

        },

        yearConvertion: function() {
        
            // 1 month = 0.0833334 years
            var years = 0,
                months = top.document.loanForm.pay.value
            ;

            if ( months > 0 ) {
                years = ( 0.0833334 * months );
            }


            document.getElementById("pay_years").value = Math.round(years);

        },

        monthConvertion: function() {
            // 1 year = 12 months
            var months = 0,
                years = top.document.loanForm.pay_years.value
            ;

            if ( years > 0 ) {
                months = ( 12 * years );
            }

            document.getElementById("pay").value = Math.round(months);

        },

        printDiv: function() {
            var loanPrint = document.getElementById('loanPrint');
             if ( loanPrint ) {
                loanPrint.addEventListener('click', loanCalc.print);
            }
        },

        print: function() {
            var divToPrint = document.getElementById( 'print' ),
                newWin     = window.open( '', 'Loan Print-Window', 'width=800,height=800' )
            ;

            newWin.document.open();
            newWin.document.write('<html><head><link rel="stylesheet" href="' + loanCalcObject.plugin_css_url + '" type="text/css" media="all" /></head><body onload="window.print();">' + divToPrint.innerHTML + '</body></html>');
            newWin.document.close();
        }
    };

    // Initialize functions
    window.onload = loanCalc.init;

})( window, document, undefined );
