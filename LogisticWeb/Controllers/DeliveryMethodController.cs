using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelDatabase;
using ModelHelper;
using ModelHelper.ViewModel;
using System.Configuration;

namespace LogisticWeb.Controllers
{
    public class DeliveryMethodController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index(string pageindex="")
        {
            long index = 1;
            if (!string.IsNullOrEmpty(pageindex))
            {
                long.TryParse(pageindex, out index);
            }
            ViewBag.PageIndex = index;
            return View();
        }

        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby="")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_DELIVERYMETHOD>>>("deliverymethod/getlist", new
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
        public ActionResult Detail(string id = "")
        {
            MD_ITEMDETAIL model = new MD_ITEMDETAIL();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_ITEMDETAIL>>>("consignee/getdetail", new
                {
                    id = id
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
            }
            return View(model);
        }

        [HttpPost]
        public JsonResult Getbyid(string id)
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_ITEMDETAIL>>>("consignee/getdetail", new
                {
                    id = id
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = null,
                    dataErr = null,
                    Msg = string.Empty,
                    totalrows = 1
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = ex.ToString(),
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                //delete
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_ITEMDETAIL>>>("consignee/getdetail", new
                {
                    id = id
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var Detail = resultJson.dataObj.First();
                if (Detail == null)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                return Json(APIHelper.CallAPI<JsonResultData>("consignee/delete", new
                {
                    data = Detail
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataErr = null,
                    dataObj = null,
                    Msg = "Id is null",
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult Save(ConsigneeViewModel info)
        {
            //insert
            return Json(APIHelper.CallAPI<JsonResultData>("consignee/insert", new
            MD_CONSIGNEE
            {
                NOTE = info.CONSIGNEENOTE,
                TELEPHONE = info.CONSIGNEETEL,
                ADDRESS = info.CONSIGNEEADDR,
                FAX = info.CONSIGNEEFAX,
                CONSIGNEENAME = info.CONSIGNEENAME,
                CONSIGNEENAMEPRIMARY = info.CONSIGNEENAMEPRIMARY,
                CREATEDUSER = LoginUser.Current.USERNAME,
                CREATEDDATE = DateTime.Now
            }), JsonRequestBehavior.AllowGet);

        }
    }
}