<?php

/**
 * Custom login styles.
 *
 * @since 1.0.0
 */
function anva_loan_scripts() {
	
	wp_enqueue_style( 'anva-loan-calculator', ANVA_LOAN_CALC_PLUGIN_URI . 'assets/css/anva-loan-calculator.css', array(), ANVA_LOAN_CALC_PLUGIN_VERSION );
	
	wp_enqueue_script( 'jquery-table-sorter', ANVA_LOAN_CALC_PLUGIN_URI . 'assets/js/jquery.tablesorter.pager.js', array( 'jquery' ), '2.0.5' );

	wp_enqueue_script( 'anva-loan-calculator', ANVA_LOAN_CALC_PLUGIN_URI . 'assets/js/anva-loan-calculator.js', array( 'jquery' ), ANVA_LOAN_CALC_PLUGIN_VERSION );

	wp_localize_script( 'anva-loan-calculator', 'loanCalcObject', anva_loan_js_locals() );
	
}

/**
 * Get all js locals
 */
function anva_loan_js_locals() {

	$localize = array(
		'ajax_url'       => admin_url( 'admin-ajax.php' ),
		'plugin_url'     => ANVA_LOAN_CALC_PLUGIN_URI,
		'plugin_css_url' => ANVA_LOAN_CALC_PLUGIN_URI . 'assets/css/styles.css',
		'plugin_images'  => ANVA_LOAN_CALC_PLUGIN_URI . 'assets/',
	);

	return apply_filters( 'anva_get_js_locals', $localize );
}
