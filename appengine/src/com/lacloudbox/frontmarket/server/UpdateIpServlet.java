package com.lacloudbox.frontmarket.server;

import java.io.IOException;
import javax.jdo.JDOHelper;
import javax.jdo.PersistenceManager;
import javax.jdo.PersistenceManagerFactory;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import com.lacloudbox.frontmarket.shared.FieldVerifier;

public class UpdateIpServlet extends HttpServlet
{
	private static final PersistenceManagerFactory	PMF	= JDOHelper.getPersistenceManagerFactory("transactions-optional");

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		processRequest(req);
	}

	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException
	{
		processRequest(req);
	}

	private PersistenceManager getPersistenceManager()
	{
		return PMF.getPersistenceManager();
	}

	private void processRequest(HttpServletRequest req)
	{
		String tmp1 = req.getParameter("boxName");
		if ((tmp1 == null) || !(tmp1 instanceof String))
		{
			throw new IllegalArgumentException(FieldVerifier.INVALID_NAME);
		}
		String boxName = tmp1;
		if (!FieldVerifier.isValidName(boxName))
		{
			throw new IllegalArgumentException(FieldVerifier.INVALID_NAME);
		}

		String tmp2 = req.getParameter("boxIp");
		if ((tmp2 == null) || !(tmp2 instanceof String))
		{
			throw new IllegalArgumentException(FieldVerifier.INVALID_IP);
		}
		String ip = tmp2;
		if (!FieldVerifier.isValidIp(ip))
		{
			throw new IllegalArgumentException(FieldVerifier.INVALID_IP);
		}

		//---

		PersistenceManager pm = getPersistenceManager();
		try
		{
			pm.makePersistent(new BoxInfos(boxName, ip));
		}
		finally
		{
			pm.close();
		}
	}

}
