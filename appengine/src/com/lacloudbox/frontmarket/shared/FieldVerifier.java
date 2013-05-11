package com.lacloudbox.frontmarket.shared;

public class FieldVerifier
{
	public static String	INVALID_NAME	= "This name is not valid";
	public static String	INVALID_IP		= "The IP associated with this name is not a valid IP, or is not a local IP";

	public static boolean isValidIp(String ip)
	{
		// /!\ will match values between 256 and 299
		if (ip == null)
		{
			return false;
		}

		if (!ip.matches("^[012]?[0-9]?[0-9]\\.[012]?[0-9]?[0-9]\\.[012]?[0-9]?[0-9]\\.[012]?[0-9]?[0-9]$"))
		{
			return false;
		}

		// 127.0.0.1
		if (ip.matches("^127\\.0?0?0\\.0?0?0\\.0?0?1$"))
		{
			return true;
		}
		// 10. 0.0.0 – 10.255.255.255
		if (ip.matches("^0?10\\..*"))
		{
			return true;
		}
		// 172. 16.0.0 – 172. 31.255.255
		if (ip.matches("(^172\\.0?1[6-9]\\..*)|(^172\\.0?2[0-9]\\..*)|(^172\\.0?3[0-1]\\..*)"))
		{
			return true;
		}
		// 192.168.0.0 – 192.168.255.255
		if (ip.matches("^192\\.168\\..*"))
		{
			return true;
		}
		return false;
	}

	public static boolean isValidName(String name)
	{
		if (name == null)
		{
			return false;
		}
		return name.matches("[a-zA-Z]+");
	}
}
