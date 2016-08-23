/*
 * Date Format
 * 
 * URL: http://blog.stevenlevithan.com/archives/date-time-format
 */
var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
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

		var	_ = utc ? "getUTC" : "get",
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
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};

Date.prototype.addDays = function(days) {
	var dat = new Date(this.valueOf());
	dat.setDate(dat.getDate() + days);
	return dat;
}

/*
 * Check fields
 */
function check() {
	
	var firstName = top.document.loanForm.firstName.value,
		loanamt   = top.document.loanForm.amt.value,
		paymnt    = top.document.loanForm.pay.value,
		rate      = top.document.loanForm.rate.value
	;

	var alert = document.getElementById('loanMessage');
	
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
		
	} else if ( ! checkLoan() ) {
		return false;
		
	} else {
		show(); 
	}
}

/*
 * Check loan type
 */
function checkLoan() {

	var pay = top.document.loanForm.pay.value;
	
	// if ( amount_type === "gerencial" && pay > 180 ) {
	// 	alert.innerHTML = "Los prÃ©stamos Gerencialas varÃ­an de 0 a 15 aÃ±os a una tasa interÃ©s de un 10%.";
	// 	return false;
	// }
	
	// if ( amount_type === "pignoracion" && pay > 180 ) {
	// 	alert.innerHTML = "Los prÃ©stamos con PignoraciÃ³n varÃ­an de 0 a 15 aÃ±os a una tasa interÃ©s de un 10%.";
	// 	return false;
	// }
	
	// if ( amount_type === "hipotecario" && pay > 180 ) {
	// 	alert.innerHTML = "Los prÃ©stamos hipotecarios varÃ­an de 0 a 15 aÃ±os a una tasa interÃ©s de un 12%.";
	// 	return false;
	// }
	
	// if ( amount_type === "escolar" && pay > 11 ) {
	// 	alert.innerHTML = "Los prÃ©stamos Escolares varÃ­an de 1 a 11 meses a una tasa interÃ©s de un 15%.";
	// 	return false;
	// }
	
	// if ( amount_type === "solidario" && pay > 144 ) {
	// 	alert.innerHTML = "Los prÃ©stamos Solidarios varÃ­an de 0 a 12 aÃ±os a una tasa interÃ©s de un 18%.";
	// 	return false;
	// }
	
	// if ( amount_type === "cortoplazo" && pay > 36 ) {
	// 	alert.innerHTML = "Los prÃ©stamos a Corto Plazo varÃ­an de 0 a 3 aÃ±os a una tasa interÃ©s de un 18%.";
	// 	return false;
	// }
	
	// if ( amount_type === "vacaciones" && pay > 36 ) {
	// 	alert.innerHTML = "Los prÃ©stamos para Vacaciones varÃ­an de 1 a 12 meses a una tasa interÃ©s de un 18%.";
	// 	return false;
	// }
	
	// if ( amount_type === "electrodomestico" && pay > 24 ) {
	// 	alert.innerHTML = "Los prestamos de Electrodomesticos varÃ­an de 0 a 2 aÃ±os a una tasa interÃ©s de un 18%.";
	// 	return false;
	// }
	
	return true;
}

/*
 * Asign rate and pay by amount type.
 *
 * @since 1.0.0
 */
function checkAmount( form ) {
	// switch ( form.amount_type.value ) {
	// 	case "gerencial":
	// 		form.rate.value = 10;
	// 		form.pay.value = 180;				
	// 		form.pay.focus();				
	// 	break;

	// 	case "pignoracion":
	// 		form.rate.value = 10;
	// 		form.pay.value = 180;
	// 		form.pay.focus();
	// 	break;

	// 	case "hipotecario":
	// 		form.rate.value = 12;
	// 		form.pay.value = 180;
	// 		form.pay.focus();
	// 	break;

	// 	case "escolar":
	// 		form.rate.value = 15;
	// 		form.pay.value = 11;
	// 		form.pay.focus();
	// 	break;

	// 	case "solidario":
	// 		form.pay.value = 144;
	// 		form.rate.value = 18;
	// 		form.pay.focus();
	// 	break;

	// 	case "cortoplazo":
	// 		form.rate.value = 18;
	// 		form.pay.value = 36;
	// 		form.pay.focus();
	// 		break;

	// 	case "vacaciones":
	// 		form.rate.value = 18;
	// 		form.pay.value = 12;
	// 		form.pay.focus();
	// 	break;

	// 	case "electrodomesticos":
	// 		form.rate.value = 18;
	// 		form.pay.value = 24;
	// 		form.pay.focus();
	// 		return false;
	// 	break;
	// }
}

/**
 * Fix values.
 * 
 * @param  int    value             
 * @param  int    numberOfCharacters
 * @param  float  numberOfDecimals  
 * @param  string padCharacter      
 * @return string               
 */
function fixVal( value, numberOfCharacters, numberOfDecimals, padCharacter ) {

	var i, stringObject, stringLength, numberToPad;        // define local variables

	value        = value*Math.pow(10,numberOfDecimals);           // shift decimal point numberOfDecimals places
	value        = Math.round(value);                             //  to the right and round to nearest integer
	stringObject = new String(value);                      // convert numeric value to a String object
	stringLength = stringObject.length;                    // get length of string
	
	while( stringLength < numberOfDecimals ) {             // pad with leading zeroes if necessary
		stringObject="0"+stringObject;                     // add a leading zero
		stringLength=stringLength+1;                       //  and increment stringLength variable
	}

	if ( numberOfDecimals > 0 ) {			           	   // now insert a decimal point
		stringObject=stringObject.substring(0,stringLength-numberOfDecimals)+"."+
		stringObject.substring(stringLength-numberOfDecimals,stringLength);
	}

	if ( stringObject.length < numberOfCharacters && numberOfCharacters > 0 ) {
		numberToPad=numberOfCharacters-stringObject.length; // number of leading characters to pad
		for (i=0; i<numberToPad; i = i + 1 ) {
			stringObject=padCharacter+stringObject;
		}
	}

	return stringObject;                                       // return the string object
}

function show() {
	
	var firstName   = top.document.loanForm.firstName.value,
	    amount      = parseFloat(top.document.loanForm.amt.value), 	// monto del prestamo
	    numpay      = parseInt(top.document.loanForm.pay.value), 		// numero de pagos
	    rate        = parseFloat(top.document.loanForm.rate.value)     // tasa de interes
	;

	// Set overlay on submit report
	var overlay = document.getElementById('loan_overlay');
	
	overlay.className += overlay.className ? ' active' : 'active';
 
 	// convertir tasa de interes a porciento
	rate = (rate/100);
	
	// determinar el tipo de pago
	var pay_type       = top.document.loanForm.pay_type.value,
		pay_type_count = 0
	;
	
	switch ( pay_type ) {
		case "monthly":
			pay_type_count = 12;
		break;

		case "biweekly":
			pay_type_count = 24;
			numpay = numpay * 2;
		break;
		
		case "weekly":
			pay_type_count = 48;
			numpay = numpay * 4;
		break;
		
		case "quarterly":
			pay_type_count = 4;
			numpay = numpay / 3;
		break;
		
		case "semi-annual":
			pay_type_count = 6;
			numpay = numpay / 6;
		break;
		
		case "annual":
			pay_type_count = 1;
			numpay = numpay / 12;
		break;
	}

	var ddays    = 0,
		date     = new Date(),
		monthly  = rate/pay_type_count, // default is 12
		payment  = ((amount*monthly)/(1-Math.pow((1+monthly),-numpay))),
		total    = payment*numpay,
		interest = total-amount,
		output   = "",
		detail   = ""
	;

	// Datos del Prestamo
	output += "<h2 class='loan__heading'>Descripcion de Prestamo</h2>";
	output += "<table class='loan__table-overview table table-bordered'>";
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
	output += "<td align='right'>"+numpay+"</td>";
	output += "</tr>";
	output += "<tr>";
	output += "<td>Tasa Anual:</td>";
	output += "<td align='right'>"+fixVal(rate,0,4,' ')+"</td>";
	output += "</tr>";
	output += "<tr>";
	output += "<td>Tasa Mensual:</td>";
	output += "<td align='right'>"+fixVal(monthly,0,5,' ')+"</td>";
	output += "</tr>";
	output += "<tr>";
	output += "<td>Pago Programado:</td>";
	output += "<td align='right'>$"+fixVal(payment,0,2,' ')+"</td>";
	output += "</tr>";
	output += "<tr>";
	output += "<td>Total a Pagar:</td>";
	output += "<td align='right'>$"+fixVal(total,0,2,' ')+"</td>";
	output += "</tr>";
	output += "<tr>";
	output += "<td>Total de InterÃ©s:</td>";
	output += "<td align='right'>$"+fixVal(interest,0,2,' ')+"</td>";
	output += "</tr>";
	output += "</table>";

	// Tabla de Amortizacion
	detail += "<h2 class='loan__heading'>Tabla de Amortizacion</h2>";
	detail += "<table class='loan__table-history table table-striped'>";
	detail += "<tr>";
	detail += "<th>Pago No.</th>";
	detail += "<th>Fecha</th>";
	detail += "<th>Pago Programado</th>";
	detail += "<th>InterÃ©s</th>";
	detail += "<th>Principal</th>";
	detail += "<th>Balance</th>";
	detail += "</tr>";
	detail += "<tr>";
	detail += "<td align='center'>0</td>";
	detail += "<td>&nbsp;</td>";
	detail += "<td>&nbsp;</td>";
	detail += "<td>&nbsp;</td>";
	detail += "<td>&nbsp;</td>";
	detail += "<td align='right'>"+fixVal(amount,0,2,' ')+"</td>";
	detail += "</tr>";

	newPrincipal = amount;

	var i = 1,
	    currentDate,
	    dateString
	;

	while ( i <= numpay ) {
		
		newInterest 	= monthly*newPrincipal;
		reduction 		= payment-newInterest;
		newPrincipal 	= newPrincipal-reduction;
		currentDate 	= date.addDays(ddays);
		dateString 		= dateFormat(currentDate, "dd/mm/yyyy").toString();

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
			ddays = ddays + 365;

		// Mensual
		} else {
			ddays = ddays + 30;
		}
		
		detail += "<tr>";
		detail += "<td align='center'>" + i + "</td>";
		detail += "<td align='right'>" + dateString + "</td>";
		detail += "<td align='right'>" + fixVal(payment,0,2,' ') + "</td>";
		detail += "<td align='right'>" + fixVal(newInterest,0,2,' ') + "</td>";
		detail += "<td align='right'>" + fixVal(reduction,0,2,' ') + "</td>";
		detail += "<td align='right'>" + fixVal(newPrincipal,0,2,' ') + "</td>";
		detail += "</tr>";

		i++;
	}

	detail += "</table>";
	detail += "<a class='print' href='javascript:printDiv();'>Imprimir</a>";

	document.getElementById("pmt").innerHTML = output;
	document.getElementById("det").innerHTML = detail;

	// Remove overlay
	overlay.className = 'loan__overlay';

	jQuery(".table.table-striped")
    .tablesorter({widthFixed: true, widgets: ['zebra']}) 
    .tablesorterPager({container: $("#pager")});
}

/*
 * Reset Form
 */
function clearScreen() {

	// Fields
	top.document.loanForm.firstName.value = "";
	top.document.loanForm.pay.value         = "";
	top.document.loanForm.pay_years.value   = "";
	top.document.loanForm.rate.value        = "";
	top.document.loanForm.pay_type.value    = "monthly"; // Set to months
	top.document.loanForm.amt.value         = "";
	
	// Elements
	top.document.getElementById("pmt").innerHTML = "";
	top.document.getElementById("det").innerHTML = "";
	
	// Date
	var today = new Date();
	
	top.document.loanForm.days.value           = today.getDate();
	top.document.loanForm.months.selectedIndex = today.getMonth();
	top.document.loanForm.years.value          = today.getFullYear();

}

function changeYearsConversion( form ) {
	
	// 1 month = 0.0833333333 year
	var years = 0,
		months = top.document.loanForm.pay.value
	;

	if ( months > 0 ) {
		years = ( 0.0833333333 * months );
	}

	document.getElementById("pay_years").value = Math.round(years);

}

function changeMonthConversion( form ) {
	
	// 1 year = 12 month
	var	months = 0,
		years = top.document.loanForm.pay_years.value
	;

	if ( years > 0 ) {
		months = ( 12 * years );
	}

	document.getElementById("pay").value = Math.round(months);

}

function printDiv() {
	var divToPrint = document.getElementById( 'print' ),
		newWin     = window.open( '', 'Print-Window', 'width=800,height=800' )
	;

	newWin.document.open();
	newWin.document.write('<html><head><link rel="stylesheet" href="' + plugin_url + '"/assets/css/styles.css" type="text/css" media="all" /></head><body onload="window.print();">' + divToPrint.innerHTML + '</body></html>');
	newWin.document.close();
}
