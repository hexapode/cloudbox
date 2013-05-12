package com.lacloudbox.frontmarket.server;

import java.util.Date;
import javax.jdo.annotations.IdGeneratorStrategy;
import javax.jdo.annotations.IdentityType;
import javax.jdo.annotations.PersistenceCapable;
import javax.jdo.annotations.Persistent;
import javax.jdo.annotations.PrimaryKey;

@PersistenceCapable(identityType = IdentityType.APPLICATION)
public class BoxInfos
{

	@PrimaryKey
	@Persistent(valueStrategy = IdGeneratorStrategy.IDENTITY)
	private Long	id;
	@Persistent
	private String	ip;
	@Persistent
	private String	name;
	@Persistent
	private Date	lastUpdateDate;

	public BoxInfos()
	{
		this.lastUpdateDate = new Date();
	}

	public BoxInfos(String name, String ip)
	{
		this();
		this.name = name;
		this.ip = ip;
	}

	public Long getId()
	{
		return this.id;
	}

	public String getIp()
	{
		return this.ip;
	}

	public Date getLastUpdateDate()
	{
		return this.lastUpdateDate;
	}

	public String getName()
	{
		return this.name;
	}
}
