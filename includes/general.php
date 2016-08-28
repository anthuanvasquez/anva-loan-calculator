<?php

/**
 * Custom login styles.
 *
 * @since 1.0.0
 */
function anva_loan_scripts() {
	
	wp_enqueue_style( 'anva-loan-calculator', ANVA_LOAN_CALCULATOR_PLUGIN_URI . 'assets/css/anva-loan-calculator.css', array(), ANVA_LOAN_CALCULATOR_PLUGIN_VERSION );
	
	wp_enqueue_script( 'jquery-table-sorter', ANVA_LOAN_CALCULATOR_PLUGIN_URI . 'assets/js/jquery.tablesorter.pager.js', array( 'jquery' ), '2.0.5' );

	wp_enqueue_script( 'anva-loan-calculator', ANVA_LOAN_CALCULATOR_PLUGIN_URI . 'assets/js/anva-loan-calculator.js', array( 'jquery' ), ANVA_LOAN_CALCULATOR_PLUGIN_VERSION );
	
}

/**
 * Get all js locals
 */
function anva_loan_js_locals() {

	$localize = array(
		'ajax_url'      => admin_url( 'admin-ajax.php' ),
		'plugin_url'    => plugin_path_url(),
		'plugin_images' => plugin_path_url() . '/assets/',
	);

	return apply_filters( 'anva_get_js_locals', $localize );
}
