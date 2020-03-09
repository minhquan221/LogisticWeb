using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;

namespace LogisticWeb.Controllers
{
    public class ScanBarcodeController : BaseController
    {
        // GET: Selection
        [CommonAuthen]
        public ActionResult Index()
        {
            return View();
        }
    }
}