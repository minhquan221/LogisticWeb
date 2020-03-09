using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;

namespace LogisticWeb.Common
{
    public class Constants
    {
        public static string SessionLogin = "LoginSession";
        public static string CurrentLoginUrl = "SessionUser_Url";
        public static string SessionMachine = "LoginMachineName";
        public static string ServerNodeIP = ConfigurationManager.AppSettings["ServerNode:URL"] + ":" + ConfigurationManager.AppSettings["ServerNode:Port"];
        public static string LogConnectionString = !string.IsNullOrEmpty(ConfigurationManager.AppSettings["LogDB"]) ? ConfigurationManager.AppSettings["LogDB"] : "LogDB";
        //public static string[] IPAllow = ConfigurationManager.AppSettings["IpAccept"] != null ? ConfigurationManager.AppSettings["IpAccept"].ToString().Split(';') : null;

    }
}