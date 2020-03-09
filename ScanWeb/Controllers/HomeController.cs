using ScanWeb.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScanWeb.Controllers
{
    public class HomeController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index()
        {
            return View();
        }

    }
}