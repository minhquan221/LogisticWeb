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
using WebRepositories.Interface;

namespace LogisticWeb.Common
{
    public static class ServiceHelper
    {
        public static ISecurityService _securityService;
    }
}