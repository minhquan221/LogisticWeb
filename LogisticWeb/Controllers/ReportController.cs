using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelDatabase;
using ModelHelper;
using ModelHelper.Report;
using BarcodeHelper;
using System.Configuration;

namespace LogisticWeb.Controllers
{
    public class ReportController : BaseController
    {

        [CommonAuthen]
        public ActionResult RmStock()
        {
            return View();
        }

        [CommonAuthen]
        public ActionResult ReportStock()
        {
            return View();
        }

        [CommonAuthen]
        public ActionResult RmStock2()
        {
            return View();
        }

        [CommonAuthen]
        public ActionResult PaymentReport()
        {
            return View();
        }

        public bool ValidateDateFromTo(DateTime? datefrom, DateTime? dateto)
        {
            if (!datefrom.HasValue)
            {
                return false;
            }
            if (dateto.HasValue)
            {
                if (dateto.Value < datefrom.Value)
                {
                    return false;
                }
            }
            return true;
        }

        [HttpPost]
        public JsonResult ExportStock(DateTime? datefrom, DateTime? dateto)
        {
            DateTime dtFrom = new DateTime();
            DateTime dtTo = new DateTime();
            if (ValidateDateFromTo(datefrom, dateto))
            {
                if (datefrom.HasValue)
                {
                    dtFrom = datefrom.Value;
                }
                if (dateto.HasValue)
                {
                    dtTo = dateto.Value.AddDays(1).AddMilliseconds(-1);
                }
                else
                {
                    dtTo = dtFrom.AddDays(1).AddMilliseconds(-1);
                }

                var resultJson = APIHelper.CallAPI<JsonResultData>("resa/exportstock", new
                {
                    datefrom = dtFrom,
                    dateto = dtTo
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                string urlWeb = Barcode.Current.SaveFileFromLinkAPI(ConfigurationManager.AppSettings["hostApiSetting"] + "export/" + resultJson.dataObj);
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = urlWeb,
                    dataErr = null,
                    Msg = string.Empty,
                    totalrows = 1
                }, JsonRequestBehavior.AllowGet);

            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateDataString("DateTo must equal or higher than DateFrom"), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetListRmStock(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<RmStockReport>>>("report/rmstockreport", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult GetListRmStockByLot(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<RmStockLotReport>>>("report/rmstocklotreport", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public ActionResult FgStock()
        {
            List<FGStock> model = new List<FGStock>();
            var result = APIHelper.CallAPI<JsonResultObject<List<FGStock>>>("report/fgstockreport", new { type = 1 });
            if (result.IsOk)
            {
                model = result.dataObj != null ? result.dataObj : model;
            }
            return View(model);
        }

        [CommonAuthen]
        public ActionResult SemiFgStock()
        {
            List<FGStock> model = new List<FGStock>();
            var result = APIHelper.CallAPI<JsonResultObject<List<FGStock>>>("report/fgstockreport", new { type = 2 });
            if (result.IsOk)
            {
                model = result.dataObj != null ? result.dataObj : model;
            }
            return View(model);
        }

        [CommonAuthen]
        public ActionResult FgInProgress()
        {
            List<FGStock> model = new List<FGStock>();
            var result = APIHelper.CallAPI<JsonResultObject<List<FGStock>>>("report/fgprogressreport");
            if (result.IsOk)
            {
                model = result.dataObj != null ? result.dataObj : model;
            }
            return View(model);
        }

        [HttpGet]
        public JsonResult DailyReport()
        {
            var resultReport = APIHelper.CallAPI<string>("pallet/Report");
            if (resultReport == "1")
            {
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = "1",
                    Msg = string.Empty,
                    totalrows = 1,
                    dataErr = null
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = "1",
                    Msg = string.Empty,
                    totalrows = 1,
                    dataErr = null
                }, JsonRequestBehavior.AllowGet);
            }
        }


    }
}