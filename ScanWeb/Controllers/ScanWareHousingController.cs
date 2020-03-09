using ModelHelper;
using ModelHelper.Common;
using ScanWeb.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ScanWeb.Controllers
{
    public class ScanWareHousingController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Scan(string QRcode)
        {
            var result = APIHelper.CallAPI<JsonResultData>("scan/scanarrival", new
            {
                PalletCode = QRcode,
                UserName = LoginUser.Current.USERNAME
            });
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        //[HttpGet]
        //public JsonResult ScanWH()
        //{
        //    var result = APIHelper.CallAPI<JsonResultData>("scan/scanarrival", new
        //    {
        //        PalletCode = "LAMIPEL ERP\nMaterial:SP002-WBS TR\nPallet No:L.0007A/0120-01\nFile No:L.0007/0120\nSupplier:LAMIPEL S.P.A\nContract No:LVT-08A/19\nInvoice PKL:1\nContainer:L.0007A/0120\nPCS:100.000\nNW:1000.000\nSQFT:0.000\nSAVG:0.000\nWAVG:10.000",
        //        UserName = "admin"
        //    });
        //    return Json(result, JsonRequestBehavior.AllowGet);
        //}

    }
}