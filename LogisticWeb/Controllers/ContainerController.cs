using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using ModelHelper;
using ModelDatabase;
using ModelHelper.ViewModel;
using System.Configuration;
using BarcodeHelper;

namespace LogisticWeb.Controllers
{
    public class ContainerController : BaseController
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
        public JsonResult GetChartHome()
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/ChartHome");
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult exportexcel(string pageindex, string pagesize, string filterquery = "", string listColumn = "")
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultData>("container/ExportExcelFilter", new
                {
                    data = new SearchViewModel
                    {
                        PageIndex = pageindex,
                        PageSize = pagesize,
                        FilterQuery = filterquery
                    },
                    listColumn = listColumn,
                    path = Server.MapPath("~/export")
                });
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
        public JsonResult Dispatch(MD_CONTAINER container, DateTime dispatchedDate)
        {
            var resultUpdateDispatch = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/dispatch", new
            {
                data = container,
                dispatchedDate
            });
            if (!resultUpdateDispatch.IsOk || resultUpdateDispatch.dataObj == null)
            {
                return Json(resultUpdateDispatch, JsonRequestBehavior.AllowGet);
            }
            return Json(new JsonResultData {
                IsOk = true,
                dataObj = resultUpdateDispatch.dataObj.First(),
                dataErr = null,
                Msg = string.Empty,
                totalrows = resultUpdateDispatch.totalrows
            }, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        [HttpPost]
        public JsonResult updateFullContainer(MD_CONTAINER container, List<string> list, bool close = false)
        {
            var resultUpdateContainer = APIHelper.CallAPI<JsonResultData>("container/update", new
            {
                data = container,
                list,
                close
            });
            if (resultUpdateContainer.IsOk)
            {
                if (list == null || list.Count == 0)
                {
                    return Json(resultUpdateContainer, JsonRequestBehavior.AllowGet);
                }
                var result = APIHelper.CallAPI<JsonResultData>("pallet/updatecontainerpallet", new
                {
                    list,
                    ContainerNo = container.NAME,
                    cntClose = close
                });
                if (result.IsOk)
                {
                    if (container.SHIPPINGDATE.HasValue)
                    {
                        var resultUpdateDispatch = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/dispatch", new
                        {
                            data = container,
                            dispatchedDate = container.SHIPPINGDATE.Value
                        });
                        if (!resultUpdateDispatch.IsOk)
                        {
                            return Json(resultUpdateDispatch, JsonRequestBehavior.AllowGet);
                        }
                    }
                    if (close)
                    {
                        var resultSendMail = APIHelper.CallAPI<JsonResultData>("pallet/sendmailpklexport", new
                        {
                            ContainerNo = container.NAME
                        });
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
                else
                {
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(resultUpdateContainer, JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public JsonResult updatepallet(List<string> list, string ContainerNo)
        {
            var result = APIHelper.CallAPI<JsonResultData>("pallet/updatecontainerpallet", new
            {
                list,
                ContainerNo
            });
            return Json(result, JsonRequestBehavior.AllowGet);
        }

        [CommonAuthen]
        public ActionResult CreatNew()
        {
            return View();
        }

        [CommonAuthen]
        public ActionResult Detail(string id = "")
        {
            MD_CONTAINER model = new MD_CONTAINER();
            if (string.IsNullOrEmpty(id))
            {
                RedirectToAction("index", "home");
            }
            var result = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/getlist", new
            {
                PageIndex = 0,
                PageSize = -1,
                OrderBy = " ID ASC ",
                FilterQuery = " NAME = '" + id + "' "
            });
            if (result.IsOk)
            {
                model = result.dataObj.FirstOrDefault();
            }

            return View(model);
        }

        [CommonAuthen]
        [HttpPost]
        public JsonResult Delete(string id = "")
        {
            if (!string.IsNullOrEmpty(id))
            {
                //delete
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/getlist", new
                {
                    PageIndex = 0,
                    PageSize = -1,
                    OrderBy = " ID ASC ",
                    FilterQuery = " NAME = '" + id + "' "
                });
                //var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/getdetail", new
                //{
                //    id = id
                //});
                if (!resultJson.IsOk)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                var containerDetail = resultJson.dataObj.First();
                if (containerDetail == null)
                {
                    return Json(resultJson, JsonRequestBehavior.AllowGet);
                }
                if (containerDetail.ISDONE && containerDetail.SHIPPINGDATE.HasValue)
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataErr = null,
                        dataObj = null,
                        Msg = "PKL dispatched can not be delete",
                        totalrows = 0
                    }, JsonRequestBehavior.AllowGet);
                }
                return Json(APIHelper.CallAPI<JsonResultData>("container/delete", new
                {
                    data = containerDetail
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

        [CommonAuthen]
        [HttpPost]
        public JsonResult CreateNewContainer()
        {
            try
            {
                string containerNo = string.Empty;
                string DateContain = DateTime.Now.ToString("yyyy-MM-dd");
                string NameContain = DateTime.Now.Year.ToString().Substring(2, 2) + string.Format("{0:d2}", DateTime.Now.Month);
                var result = APIHelper.CallAPI<JsonResultData>("container/insert", new
                MD_CONTAINER
                {
                    CONTRACTNUMBER = "",
                    MAXSQFT = "",
                    MAXWEIGHT = "25500",
                    NAME = NameContain,
                    NUMBERPALLET = "0",
                    CREATEDDATE = DateTime.Now,
                    NOTE = ""
                });
                if (result.IsOk)
                {
                    containerNo = result.dataObj.ToString();
                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = new
                    {
                        PKL = containerNo,
                        Date = DateContain
                    },
                    Msg = string.Empty,
                    dataErr = null,
                    totalrows = 1
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = null,
                    Msg = ex.ToString(),
                    dataErr = ex,
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }




        [HttpPost]
        public JsonResult GetList(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/getlist", new
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
                    return Json(new JsonResultObject<List<MD_CONTAINER>>
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

        //GetListIndex

        [HttpPost]
        public JsonResult GetListIndex(string pageindex, string pagesize, string filterquery = "", string orderby = "")
        {
            long PageIndex = 0;
            long PageSize = -1;
            if (long.TryParse(pageindex, out PageIndex) && long.TryParse(pagesize, out PageSize))
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<ContainerList>>>("container/getlistindex", new
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
                    return Json(new JsonResultObject<List<ContainerList>>
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

    }
}