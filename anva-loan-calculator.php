<?php
/*
Plugin Name: Anva Loan Calculator
Description: Add a loan calculator to your site using widgets and shortcodes.
Version: 1.0.0
Author: Anthuan Vásquez
Author URI: http://anthuanvasquez.net
License: GPL2
Text Domain: anva-loan
Domain Path: /languages/
*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

// Plugin Constans
define ( 'ANVA_LOAN_CALCULATOR_PLUGIN_VERSION', '1.0.0' );
define ( 'ANVA_LOAN_CALCULATOR_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define ( 'ANVA_LOAN_CALCULATOR_PLUGIN_URI', plugin_dir_url( __FILE__ ) );

// Load dependencies
require_once( ANVA_LOAN_CALCULATOR_PLUGIN_DIR . '/includes/general.php' );
require_once( ANVA_LOAN_CALCULATOR_PLUGIN_DIR . '/includes/loan.php' );
require_once( ANVA_LOAN_CALCULATOR_PLUGIN_DIR . '/includes/widget.php' );

/**
 * Anva Loan Calculator Init.
 *
 * @since 1.0.0
 */
function anva_loan_init() {
	
	$loan = Anva_Loan_Calculator::get_instance();

	add_action( 'wp_enqueue_scripts', 'anva_loan_scripts' );
	add_action( 'widgets_init', 'anva_loan_widget' );
	
}
add_action( 'after_setup_theme', 'anva_loan_init' );

/**
 * Loand calculator textdomain.
 *
 * @since  1.0.0
 */
function anva_loan_textdomain() {
	$dir = basename( dirname( __FILE__ ) ) . '/languages/';
	load_plugin_textdomain( 'anva-loan', false, $dir );
}
add_action( 'plugins_loaded', 'anva_loan_textdomain' );
