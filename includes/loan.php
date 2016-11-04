<?php

class Anva_Loan_Calculator
{
	/**
     * A single instance of this class.
     *
     * @since 1.0.0
     */
    private static $instance = NULL;

	/**
     * Creates or returns an instance of this class.
     *
     * @since 1.0.0
     * @return A single instance of this class.
     */
    public static function get_instance()
    {
        if ( self::$instance == NULL ) {
            self::$instance = new self;
        }

        return self::$instance;
    }

	private function __construct()
	{
		add_shortcode( 'anva_loan_calculator', array( $this, 'shortcode' ) );
	}

	public function shortcode( $atts, $content = NULL )
	{
		extract( shortcode_atts( array(
			'email' => true,
			'report' => true
		), $atts ) );

		$this->form( $email, $report );
	}

	public function form( $email = true, $report = true )
	{
		?>
		<div id="loan" class="loan">
		    <div class="loan__wrap">

		        <h2 class="loan__heading">
		            <?php _e( 'Entre sus Datos de Prestamo', 'anva-loan' ); ?>
		        </h2>
		        
		        <form class="loan__form" name="loanForm">
		            <div id="loanMessage" class="loan__messages"></div>
		            <div class="loan__form-wrap">
		                <ul class="loan__list">
		                	<li class="loan__item">
		                        <div class="loan__grid">
		                            <label class="loan__label" for="firstName">
		                                <?php _e( 'First Name' ) ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                            <input type="text" id="firstName" name="firstName" placeholder="<?php _e( 'First Name' ); ?>" class="loan__field">
		                        </div>
		                    </li>
		                    <li class="loan__item">
		                        <div class="loan__grid">
		                            <label class="loan__label" for="lastName">
		                                <?php _e( 'Last Name' ) ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                            <input type="text" id="lastName" name="lastName" placeholder="<?php _e( 'Last Name' ); ?>" class="loan__field">
		                        </div>
		                    </li>
		                    <li class="loan__item">
		                        <div class="loan__grid">
		                            <label class="loan__label" for="amt">
		                                <?php _e( 'Amount Term', 'anva-loan' ); ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                            <input type="text" id="amt" name="amt" placeholder="<?php _e( 'ex. 15000' ); ?>" class="loan__field">
		                        </div>
		                    </li>  
		                    <li class="loan__item">
		                        <div class="loan__grid">
		                            <label class="loan__label" for="pay">
		                                <?php _e( 'Loan Term', 'anva-loan' ); ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                        	<span><?php _e(' Months', 'anva-loan' ); ?></span>
		                            <input type="text" id="pay" name="pay" placeholder="<?php _e( 'ex. 12' ); ?>" onchange="changeYearsConversion(this.form)" class="loan__field loan__field--mini">
		                        	<span><?php _e(' or Years', 'anva-loan' ); ?></span>
		                            <input type="text" id="pay_years" name="pay_years" placeholder="<?php _e( 'ex. 2' ); ?>" onchange="changeMonthConversion(this.form)" class="loan__field loan__field--mini">
		                        </div>
		                    </li>
		                    <li class="loan__item">
		                        <div class="loan__grid">
		                            <label class="loan__label" for="rate">
		                                <?php _e( 'Interest Rate (Annual)' ); ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                            <input type="text" id="rate" name="rate" placeholder="<?php _e( '% per year' ); ?>" class="loan__field loan__field--text">
		                        </div>
		                    </li>   
		                    <li class="loan__item">
		                        <div class="loan__grid">
		                            <label class="loan__label" for="pay_type">
		                                <?php _e( 'Capitalization Options' ) ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                            <select id="pay_type" name="pay_type" class="loan__field loan__field--select">
		                                <?php foreach ( $this->get_pay_type() as $key => $pay ) : ?>
		                                    <option value="<?php echo $key; ?>"><?php echo $pay; ?></option>
		                                <?php endforeach; ?>
		                            </select>
		                        </div>
		                    </li>   
		                    <li class="loan__item">
		                        <div class="loan__grid loan__grid">
		                            <label class="loan__label" for="days">
		                                <?php _e( 'Payment Start Date' ); ?>:
		                            </label>
		                        </div>
		                        <div class="loan__grid">
		                            <select id="days" name="days" class="loan__field loan__field--select loan__field--mini">
		                                <?php foreach ( range( 1, 31 ) as $day ) : ?>
		                                    <option value="<?php echo $day; ?>" <?php selected( date('j'), $day );?>>
		                                        <?php echo $day; ?>
		                                    </option>
		                                <?php endforeach; ?>
		                            </select>

		                            <select id="months" name="months" class="loan__field loan__field--select loan__field--mini">
		                            	<?php foreach ( $this->get_months() as $key => $month ) : ?>
		                                    <option value="<?php echo $key; ?>" <?php selected( date('n'), $key ); ?>>
		                                    	<?php echo $month; ?>
		                                    </option>
		                                <?php endforeach; ?>
		                            </select>
		                                
		                            <select id="years" name="years" class="loan__field loan__field--select loan__field--mini">
		                                <?php foreach ( range( date('Y'), date('Y') + 30 ) as $year ) : ?>
		                                    <option value="<?php echo $year; ?>" <?php selected( date('Y'), $year ); ?>>
		                                    	<?php echo $year; ?>		
		                                    </option>
		                                <?php endforeach; ?>
		                            </select>
		                        </div>
		                    </li>
		                    
		                    <?php if ( $email ) : ?>
			                    <li class="loan__item loan__item--email">
			                        <div class="loan__grid">
				                        <div class="loan__checkbox">
				                        	<input type="checkbox" id="email" name="email" class="loan__field loan__field--checkbox">
					                        <label class="loan__label" for="email">
					                            <?php _e( 'Check to Send Report Email' ); ?>:
					                        </label>
				                        </div>
			                        </div>
			                        <div class="loan__grid">
			                            <input type="text" id="email" name="email" placeholder="ej. your@email.com" class="loan__field">
			                        </div>
			                    </li>
		                    <?php endif; ?>

		                    <li class="loan__item loan__item--actions">
		                        <button type="button" class="loan__button button" onclick="return check()">
		                            <i class="fa fa-table"></i> <?php _e( 'Calcular' ); ?>
		                        </button>
		                        <button type="button" class="loan__button button" onclick="clearScreen()">
		                            <i class="fa fa-times"></i> <?php _e( 'Resetear' ); ?>
		                        </button>
		                    </li>
		                </ul>
		            </div>
		        </form>
		    </div>
		    
		    <div id="print">
		        <div class="loan_pmt" id="pmt"></div>
		        <div class="loan_out" id="det"></div>
		    </div>
		    
		    <div id="loan_overlay" class="loan__overlay"></div>

		</div>
		<?php
	}

	public function get_pay_type()
	{
		$pay_type = array(
		    'monthly'     => __( 'Monthly', 'anva-loan' ),
		    'biweekly'    => __( 'Biweekly', 'anva-loan' ),
		    'weekly'      => __( 'Weekly', 'anva-loan' ),
		    'quarterly'   => __( 'Quarterly', 'anva-loan' ),
		    'semi-annual' => __( 'Semi-annual', 'anva-loan' ),
		    'annual'      => __( 'Annual', 'anva-loan' ),
		);

		return $pay_type;
	}

	public function get_months()
	{
		$months = array(
			1  => __( 'January', 'anva-loan' ),
			2  => __( 'February', 'anva-loan' ),
			3  => __( 'March', 'anva-loan' ),
			4  => __( 'April', 'anva-loan' ),
			5  => __( 'May', 'anva-loan' ),
			6  => __( 'June', 'anva-loan' ),
			7  => __( 'July', 'anva-loan' ),
			8  => __( 'Agoust', 'anva-loan' ),
			9  => __( 'September', 'anva-loan' ),
			10 => __( 'October', 'anva-loan' ),
			11 => __( 'November', 'anva-loan' ),
			12 => __( 'December', 'anva-loan' ),
		);

		return $months;
	}

	/**
	 * @todo send email when the report is created.
	 */
	public function send_email()
	{
		// Send email after generate the report
	}
}
