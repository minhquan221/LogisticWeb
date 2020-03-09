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
using BarcodeHelper;

namespace LogisticWeb.Controllers
{
    public class ContractController : BaseController
    {
        // GET: Selection
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
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<CONTRACTLIST>>>("contract/getlist", new
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
        public JsonResult GetFilter(List<string> list, string contractcode = "")
        {
            var result = APIHelper.CallAPI<JsonResultObject<List<ContractPKL>>>("contract/getfilter", new
            {
                list,
                contractcode
            });
            return Json(result, JsonRequestBehavior.AllowGet);

        }

        [CommonAuthen]
        public ActionResult Detail(string id)
        {
            MD_CONTRACT model = new MD_CONTRACT();
            if (!string.IsNullOrEmpty(id))
            {
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_CONTRACT>>>("contract/getdetail", new
                {
                    id = id
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
            }
            var contractfulldetail = new ContractEditViewModel(model);
            return View(contractfulldetail);
        }

        [HttpPost]
        public JsonResult GetCustomerContract(string contractcode)
        {
            try
            {
                MD_CONTRACT model = new MD_CONTRACT();
                var result = APIHelper.CallAPI<JsonResultObject<List<MD_CONTRACT>>>("contract/getlist", new
                {
                    PageIndex = 0,
                    PageSize = 1,
                    FilterQuery = string.Format(" CONTRACTCODE = '{0}' ", contractcode),
                    OrderBy = ""
                });
                if (result.IsOk)
                {
                    model = result.dataObj.FirstOrDefault();
                }
                var contractfulldetail = new ContractEditViewModel(model);
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = contractfulldetail.CustomerDetail != null ? contractfulldetail.CustomerDetail.CUSTOMERNAME : string.Empty
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = true,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [CommonAuthen]
        public ActionResult CreateNew()
        {
            return View();
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult GenerateCodeName()
        {
            var resultJson = APIHelper.CallAPI<JsonResultData>("contract/generatecodename");
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult Save(ContractViewModel info)
        {
            info.CREATEDDATE = DateTime.Now;
            info.CREATEDUSER = LoginUser.Current.USERNAME;
            var resultJson = APIHelper.CallAPI<JsonResultObject<ContractViewModel>>("contract/Insert", new
            {
                data = info
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update2(ContractViewModel info)
        {
            info.UPDATEDDATE = DateTime.Now;
            info.UPDATEDUSER = LoginUser.Current.USERNAME;
            var resultJson = APIHelper.CallAPI<JsonResultObject<ContractViewModel>>("contract/Update", new
            {
                data = info
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult Update(ContractViewModel info)
        {
            MD_ITEMLIST itemList = info.GetItemListInfo(true);
            if (itemList.ID != 0)
            {
                var resultUpdateItemList = APIHelper.CallAPI<JsonResultData>("itemlist/update", new
                {
                    data = itemList
                });
                if (!resultUpdateItemList.IsOk)
                {
                    return Json(resultUpdateItemList, JsonRequestBehavior.AllowGet);
                }
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    Msg = "ID ITEM LIST CAN NOT BE NULL IN UPDATE FUNCTION"
                }, JsonRequestBehavior.AllowGet);
            }
            List<MD_ITEMDETAIL> detail = info.GetDetailList();
            string lstList = "";
            foreach (var item in detail)
                lstList += item.ID + ";";
            lstList = lstList.Substring(0, lstList.Length - 1);
            var resultDeleteNotInList = APIHelper.CallAPI<JsonResultData>("itemdetail/deletenotinlist", new
            {
                lstListId = lstList,
                ItemListId = info.ITEMLISTID
            });
            if (!resultDeleteNotInList.IsOk)
            {
                return Json(resultDeleteNotInList, JsonRequestBehavior.AllowGet);
            }
            foreach (var item in detail)
            {
                if (item.ID != 0)
                {
                    var resultDetailList = APIHelper.CallAPI<JsonResultData>("itemdetail/update", new
                    {
                        data = item
                    });
                    if (!resultDetailList.IsOk)
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            Msg = "item detail Update - " + resultDetailList.Msg,
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
                else
                {
                    var resultDetailList = APIHelper.CallAPI<JsonResultData>("itemdetail/Insert", new
                    {
                        data = item
                    });
                    if (resultDetailList.IsOk)
                    {
                        info.ItemIDDetail.Add(Convert.ToInt64(resultDetailList.dataObj));
                    }
                    else
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            Msg = "item detail Insert - " + resultDetailList.Msg,
                        }, JsonRequestBehavior.AllowGet);
                    }
                }
            }
            MD_CONTRACT contractdetail = info.GetContractDetail();
            if (contractdetail.ID != 0)
            {
                var result = APIHelper.CallAPI<JsonResultData>("contract/update", new
                {
                    data = contractdetail
                });
                return Json(new JsonResultData
                {
                    IsOk = result.IsOk,
                    dataErr = null,
                    dataObj = null,
                    Msg = "contractdetail Update - " + result.Msg,
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataErr = null,
                    dataObj = null,
                    Msg = "ID CAN NOT BE NULL IN UPDATE FUNCTION",
                    totalrows = 0
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DoneContract(string itemcode)
        {
            var resultJson = APIHelper.CallAPI<JsonResultObject<ContractViewModel>>("contract/donecontract", new
            {
                itemcode = itemcode,
                UPDATEDDATE = DateTime.Now,
                UPDATEDUSER = LoginUser.Current.USERNAME
            });
            return Json(resultJson, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [CommonAuthen]
        public JsonResult exportexcel(string pageindex, string pagesize, string filterquery = "", string listColumn = "")
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultData>("contract/exportexcelfilter", new
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
    }
}