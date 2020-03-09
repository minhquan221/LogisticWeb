using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.NetworkInformation;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ModelDatabase;
using ModelHelper;
using Newtonsoft.Json;
using LogisticWeb.Common;
using LogisticWeb.Models;
using LogisticWeb.Models.ViewModel;
using EncryptLibrary;
using ModelHelper.ViewModel;

namespace LogisticWeb.Controllers
{
    public class ErrorController : BaseController
    {
        // GET: Index
        public ActionResult Index()
        {
            return View();
        }
    }
}