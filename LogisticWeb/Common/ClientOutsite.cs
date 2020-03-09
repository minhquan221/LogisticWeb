using ModelHelper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using LogisticWeb.Models;

namespace LogisticWeb.Common
{
    public class ClientOutsite
    {
        public static List<string> _current = null;

        public static List<string> Current
        {
            get
            {
                return _current == null ? new List<string>() : _current;
            }
        }
    }
}