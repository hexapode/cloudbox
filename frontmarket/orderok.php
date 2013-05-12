<?php
	/*==================================================================
	 PayPal Express Checkout Call
	 ===================================================================
	*/
	// Check to see if the Request object contains a variable named 'token'	
	$token = "";
	if (isset($_REQUEST['token']))
	{
		$token = $_REQUEST['token'];
		
	}

	// If the Request object contains the variable 'token' then it means that the user is coming from PayPal site.	
	if ( $token != "" )
	{

		require_once ("paypalfunctions.php");

		/*
		'------------------------------------
		' Calls the GetExpressCheckoutDetails API call
		'
		' The GetShippingDetails function is defined in PayPalFunctions.jsp
		' included at the top of this file.
		'-------------------------------------------------
		*/
		

		$resArray = GetShippingDetails( $token );
		$ack = strtoupper($resArray["ACK"]);
		if( $ack == "SUCCESS" || $ack == "SUCESSWITHWARNING") 
		{
			/*
			' The information that is returned by the GetExpressCheckoutDetails call should be integrated by the partner into his Order Review 
			' page		
			*/
			$email 				= $resArray["EMAIL"]; // ' Email address of payer.
			$payerId 			= $resArray["PAYERID"]; // ' Unique PayPal customer account identification number.
			$payerStatus		= $resArray["PAYERSTATUS"]; // ' Status of payer. Character length and limitations: 10 single-byte alphabetic characters.
			$salutation			= $resArray["SALUTATION"]; // ' Payer's salutation.
			$firstName			= $resArray["FIRSTNAME"]; // ' Payer's first name.
			$middleName			= $resArray["MIDDLENAME"]; // ' Payer's middle name.
			$lastName			= $resArray["LASTNAME"]; // ' Payer's last name.
			$suffix				= $resArray["SUFFIX"]; // ' Payer's suffix.
			$cntryCode			= $resArray["COUNTRYCODE"]; // ' Payer's country of residence in the form of ISO standard 3166 two-character country codes.
			$business			= $resArray["BUSINESS"]; // ' Payer's business name.
			$shipToName			= $resArray["PAYMENTREQUEST_0_SHIPTONAME"]; // ' Person's name associated with this address.
			$shipToStreet		= $resArray["PAYMENTREQUEST_0_SHIPTOSTREET"]; // ' First street address.
			$shipToStreet2		= $resArray["PAYMENTREQUEST_0_SHIPTOSTREET2"]; // ' Second street address.
			$shipToCity			= $resArray["PAYMENTREQUEST_0_SHIPTOCITY"]; // ' Name of city.
			$shipToState		= $resArray["PAYMENTREQUEST_0_SHIPTOSTATE"]; // ' State or province
			$shipToCntryCode	= $resArray["PAYMENTREQUEST_0_SHIPTOCOUNTRYCODE"]; // ' Country code. 
			$shipToZip			= $resArray["PAYMENTREQUEST_0_SHIPTOZIP"]; // ' U.S. Zip code or other country-specific postal code.
			$addressStatus 		= $resArray["ADDRESSSTATUS"]; // ' Status of street address on file with PayPal   
			$invoiceNumber		= $resArray["INVNUM"]; // ' Your own invoice or tracking number, as set by you in the element of the same name in SetExpressCheckout request .
			$phonNumber			= $resArray["PHONENUM"]; // ' Payer's contact telephone number. Note:  PayPal returns a contact telephone number only if your Merchant account profile settings require that the buyer enter one. 
		} 
		else  
		{
			//Display a user friendly Error on the page using any of the following error information returned by PayPal
			$ErrorCode = urldecode($resArray["L_ERRORCODE0"]);
			$ErrorShortMsg = urldecode($resArray["L_SHORTMESSAGE0"]);
			$ErrorLongMsg = urldecode($resArray["L_LONGMESSAGE0"]);
			$ErrorSeverityCode = urldecode($resArray["L_SEVERITYCODE0"]);
			
			echo "GetExpressCheckoutDetails API call failed. ";
			echo "Detailed Error Message: " . $ErrorLongMsg;
			echo "Short Error Message: " . $ErrorShortMsg;
			echo "Error Code: " . $ErrorCode;
			echo "Error Severity Code: " . $ErrorSeverityCode;
		}
	}
		
?>


<!DOCTYPE html>
<html>
<head>
	<title>La SafeBox</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	
    <!-- Styles -->
    <link href="css/bootstrap.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/theme.css">
    <link href='http://fonts.googleapis.com/css?family=Lato:300,400,700,900,300italic,400italic,700italic,900italic' rel='stylesheet' type='text/css'>

    <link rel="stylesheet" type="text/css" href="css/lib/animate.css" media="screen, projection">
    <link rel="stylesheet" href="css/pricing.css" type="text/css" media="screen" />

    <!--[if lt IE 9]>
      <script src="http://html5shim.googlecode.com/svn/trunk/html5.js"></script>
    <![endif]-->
</head>
<body>
    <div class="navbar navbar-inverse navbar-static-top">
      <div class="navbar-inner">
        <div class="container">
            <a class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
            <a class="brand">
                <strong>La SafeBox</strong>
            </a>
        </div>
      </div>
    </div>




    <!-- Pricing Option 1 -->
    <div id="in_pricing">
        <div class="container">
            <div class="head">
                <h3>Please validate your order :</h3>
            </div>
            <div class='row'>
            	<div class='span6'>
                	<b>Address</b>
                	<br/><? echo $shipToName ?>
                	<br/><? echo $shipToStreet ?>
                	<br/><? echo $shipToStreet2 ?>
                	<br/><? echo $shipToCity . ' ' . $shipToZip ?>
                	<br/><? echo $shipToState . ' ' .  $shipToCntryCode ?>
                </div>
                
                <div class='span6'>
                	<b>Name :</b> <?php echo $salutation . ' ' 
                	.$firstname 
                	. ' '
                	. $middleName 
                	. ' '
                	. $lastName; ?>
                	<br/><b>Email :</b> <?php echo $email; ?>
                	<br/><br/><br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="confirm.php" class='btn success important'>Place your order</a>
                </div>
                 
            </div>
        </div>
    </div>
   








    <!-- Pricing Option 1 -->
    <div id="in_pricing">
        <div class="container">
            <div class="head">
                <h4>Pre-Order LaSafeBox now for a $29 initial payement instead of $49!</h4>
                <h6>To produce LaSafeBox we need 1,000 pre-order. We will charge you when we launch.</h6>
                <h6>However if we don't get enough pre-order by 7 June, we will not charge you.</h6>
            </div>
            <div class='row'>
                <div class='span5'></div>
                <div class='span4'>
                    <form action='expresscheckout.php' METHOD='POST'>
                    <input type='image' name='submit' src='https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif' border='0' align='top' alt='Check out with PayPal'/>
                    </form>
                </div>
                <div class='span3'></div>
            </div>
        </div>
    </div>
   


    <!-- starts footer -->
    <footer id="footer">
        <div class="container">
            <div class="row credits">
                <div class="span12">
                    <div class="row social">
                        <div class="span12">
                            <a href="https://www.facebook.com/LaSafeBox" class="facebook">
                                <span class="socialicons ico1"></span>
                                <span class="socialicons_h ico1h"></span>
                            </a>
                            <a href="https://twitter.com/LaSafeBox" class="twitter">
                                <span class="socialicons ico2"></span>
                                <span class="socialicons_h ico2h"></span>
                            </a>
                        </div>
                    </div>
                    <div class="row copyright">
                        <div class="span12">
                            © 2013 La SafeBox. All rights reserved.
                        </div>
                    </div>
                </div>            
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="http://code.jquery.com/jquery-latest.js"></script>
    <script src="js/bootstrap.min.js"></script>
    <script src="js/theme.js"></script>

    <script type="text/javascript" src="js/index-slider.js"></script> 

<script type="text/javascript">
  var GoSquared = {};
  GoSquared.acct = "GSN-426308-G";
  (function(w){
    function gs(){
      w._gstc_lt = +new Date;
      var d = document, g = d.createElement("script");
      g.type = "text/javascript";
      g.src = "//d1l6p2sc9645hc.cloudfront.net/tracker.js";
      var s = d.getElementsByTagName("script")[0];
      s.parentNode.insertBefore(g, s);
    }
    w.addEventListener ?
      w.addEventListener("load", gs, false) :
      w.attachEvent("onload", gs);
  })(window);
</script>
</body>
</html>