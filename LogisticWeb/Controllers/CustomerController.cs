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
    public class CustomerController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index(string pageindex = "")
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
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_CUSTOMER>>>("customer/getlist", new
                {
                    PageIndex = PageIndex,
                    PageSize = PageSize,
                    FilterQuery = filterquery,
                    OrderBy = orderby
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var listData = resultJson.dataObj;
                if (listData != null)
                {
                    return Json(new JsonResultObject<List<MD_CUSTOMER>>
                    {
                        IsOk = true,
                        dataObj = listData,
                        Msg = string.Empty,
                        dataErr = null,
                        totalrows = resultJson.totalrows
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new JsonResultData
                    {
                        IsOk = true,
                        dataObj = null,
                        Msg = string.Empty,
                        dataErr = null,
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(ErrorHelper.Current.ErrorValidateData(), JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_PALETTE model = new MD_PALETTE();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("customer/getdetail", new
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
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_CUSTOMER>>>("customer/getdetail", new
                {
                    id = id
                });
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var customerView = new CustomerViewModel().ParseFromDBObject(resultJson.dataObj.FirstOrDefault());
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = customerView,
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
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("customer/getdetail", new
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
                return Json(APIHelper.CallAPI<JsonResultData>("customer/delete", new
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
        public JsonResult Save(CustomerViewModel info)
        {
            //insert
            return Json(APIHelper.CallAPI<JsonResultData>("customer/insert", new
            MD_CUSTOMER
            {
                NOTE = info.CUSTOMERNOTE,
                TELEPHONE = info.CUSTOMERTEL,
                ADDRESS = info.CUSTOMERADDR,
                FAX = info.CUSTOMERFAX,
                CUSTOMERNAME = info.CUSTOMERNAME,
                CUSTOMERPRIMARY = info.CUSTOMERNAMEPRIMARY,
                CREATEDUSER = LoginUser.Current.USERNAME,
                CREATEDDATE = DateTime.Now
            }), JsonRequestBehavior.AllowGet);

        }
    }
}