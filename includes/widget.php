<?php

/* Social Icons Widget */
class Anva_Loan_Calculator_Widget extends WP_Widget
{
	/**
	 * Sets up the widgets name.
	 *
	 * @since  1.0.0
	 */
	function __construct()
	{
		$widget_ops = array(
			'classname'   => 'widget_anva_loan_calculator',
			'description' => __( 'Display a loan calculator form.', 'anva-loan' )
		);

		parent::__construct( 'anva_loan_calculator_widget', 'Loan Calculator', $widget_ops );
	}

	/**
	 * Outputs the content of the widget.
	 *
	 * @param array $args
	 * @param array $instance
	 */
	function widget( $args, $instance )
	{	
		extract( $args );

		$title 	= apply_filters( 'widget_title', $instance['title'] );
 
		echo $before_widget;		

 		/* Title */
		if ( ! empty( $title ) ) {
			echo $before_title . $title . $after_title;
		}

		$loan = Anva_Loan_Calculator::get_instance();
		$loan->form();

		echo $after_widget;
	}

	/**
	 * Outputs the options form on admin.
	 *
	 * @param array $instance
	 */
	function update( $new_instance, $old_instance )
	{	
		$instance          = $old_instance;
		$instance['title'] = $new_instance['title'];

		return $instance;
	}

	/**
	 * Processing widget options on save.
	 *
	 * @param array $new_instance The new options
	 * @param array $old_instance The previous options
	 */
	function form( $instance )
	{	
		/* Default Value */
		$instance = wp_parse_args( (array) $instance, array(
			'title' => __( 'Loan Calculator', 'anva-loan' ),
		));
		
		/* Inputs */
		$title 	 = $instance['title'];

		$html 	 = '';
		$html 	.= '<p>';
		$html 	.= '<label for="'. $this->get_field_id('title') .'">'. anva_get_local( 'title' ) . ':</label>';
		$html 	.= '<input type="text" class="widefat" id="'. $this->get_field_id('title') .'" name="'. $this->get_field_name('title') .'" value="'. esc_attr($title) .'" />';
		$html 	.= '</p>';

		echo $html;
	}
}

function anva_loan_widget() {
	register_widget( 'Anva_Loan_Calculator_Widget' );
}
