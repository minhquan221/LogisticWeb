using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace ScanWeb.Common
{
    public class Constants
    {
        public static string SessionLogin = "LoginSession";
        public static string SessionMachine = "LoginMachineName";
        public static string LogConnectionString = !string.IsNullOrEmpty(ConfigurationManager.AppSettings["LogDB"]) ? ConfigurationManager.AppSettings["LogDB"] : "LogDB";
        public static string UrlNodeServer = ConfigurationManager.AppSettings["ServerNode:URL"].ToString();
        public static string PortNodeServer = ConfigurationManager.AppSettings["ServerNode:Port"].ToString();
        //public static string[] IPAllow = ConfigurationManager.AppSettings["IpAccept"] != null ? ConfigurationManager.AppSettings["IpAccept"].ToString().Split(';') : null;

    }
}