package com.lacloudbox.frontmarket.shared;

import java.io.Serializable;

public class CloudBoxServiceException extends RuntimeException implements Serializable
{
	public CloudBoxServiceException()
	{
		super();
	}

	public CloudBoxServiceException(String msg)
	{
		super(msg);
	}
}
