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
    public class ScanProductShoulderController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index()
        {
            if (!LoginUser.Current.ISUSERSHOULDER)
                Response.Redirect("/");
            var resultCheckUser = APIHelper.CallAPI<JsonResultData>("scan/checkshouldertableuser", new
            {
                UserName = LoginUser.Current.USERNAME
            });
            if (resultCheckUser.IsOk)
            {
                LoginUser.Current.RESACODE = resultCheckUser.dataObj.ToString();
                ViewBag.Resacode = LoginUser.Current.RESACODE;
            }
            ViewBag.Table = LoginUser.Current.SHOULDERTABLE;
            return View();
        }

        [HttpPost]
        public JsonResult Scan(string QRcode)
        {
            try
            {
                var result = APIHelper.CallAPI<JsonResultData>("scan/scanproductionstep3", new
                {
                    PalletCode = QRcode,
                    ResaCode = LoginUser.Current.RESACODE,
                    UserName = LoginUser.Current.USERNAME,
                    type = 1,
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult Scan2(string QRcode)
        {
            try
            {
                var result = APIHelper.CallAPI<JsonResultData>("scan/scanproductionstep3", new
                {
                    PalletCode = QRcode,
                    ResaCode = LoginUser.Current.RESACODE,
                    UserName = LoginUser.Current.USERNAME,
                    type = 2,
                });
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

    }
}