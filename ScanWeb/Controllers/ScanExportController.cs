using ModelDatabase;
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
    public class ScanExportController : BaseController
    {
        [CommonAuthen]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public JsonResult Scan(string QRcode, string pklname = "")
        {
            try
            {
                var SplitPallet = QRcode.Replace("\n", "~").Split('~');
                string PalletData = SplitPallet[2];
                string Code = PalletData.Replace("Pallet No:", "");
                var getpalletdetail = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getlist", new
                {
                    PageIndex = 0,
                    PageSize = 1,
                    FilterQuery = string.Format(" NAME = '{0}' ", Code.Trim()),
                    OrderBy = ""
                });
                if (!getpalletdetail.IsOk)
                {
                    return Json(getpalletdetail, JsonRequestBehavior.AllowGet);
                }
                var detailpallet = getpalletdetail.dataObj.First();
                
                if (!string.IsNullOrEmpty(pklname))
                {
                    if (detailpallet.CONTAINERID != pklname)
                    {
                        return Json(new JsonResultData
                        {
                            IsOk = false,
                            dataObj = null,
                            dataErr = null,
                            Msg = "PALLET IN DIFFERENCE CONTAINER"
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                var getdetailpkl = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/getlist", new
                {
                    PageIndex = 0,
                    PageSize = 1,
                    FilterQuery = string.Format(" NAME = '{0}' ", detailpallet.CONTAINERID.Trim()),
                    OrderBy = ""
                });
                if (!getdetailpkl.IsOk)
                {
                    return Json(getdetailpkl, JsonRequestBehavior.AllowGet);
                }
                var detailpkl = getdetailpkl.dataObj.First();

                return Json(new {
                    IsOk = true,
                    dataObj = Code,
                    Cnt = detailpallet.CONTAINERID,
                    NumberPallet = detailpkl.NUMBERPALLET,
                    Msg = string.Empty
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult DispatchCNT(string cntCode, List<string> palletname = null)
        {
            if (string.IsNullOrEmpty(cntCode))
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = "CONTAINER MUST NOT BE NULL"
                }, JsonRequestBehavior.AllowGet);
            }
            if (palletname == null || palletname.Count == 0)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = "THERE ARE NO PALLET IN LIST"
                }, JsonRequestBehavior.AllowGet);
            }
            try
            {
                var getcntdetail = APIHelper.CallAPI<JsonResultObject<List<MD_CONTAINER>>>("container/getlist", new
                {
                    PageIndex = 0,
                    PageSize = 1,
                    FilterQuery = string.Format(" NAME = '{0}' ", cntCode.Trim()),
                    OrderBy = ""
                });
                if (!getcntdetail.IsOk)
                {
                    return Json(getcntdetail, JsonRequestBehavior.AllowGet);
                }
                var model = getcntdetail.dataObj.First();
                if (!model.ISDONE)
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataObj = null,
                        dataErr = null,
                        Msg = "CONTAINER IS NOT DONE YET"
                    }, JsonRequestBehavior.AllowGet);
                }
                var getlstPallet = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/GetListPKL", new
                {
                    containerId = model.NAME
                });
                if (!getlstPallet.IsOk)
                {
                    return Json(getlstPallet, JsonRequestBehavior.AllowGet);
                }
                var lstPallet = getlstPallet.dataObj;
                bool IsMiss = false;
                foreach (var item in lstPallet)
                {
                    if (palletname.Where(x => x.Trim() == item.NAME.Trim()).Count() == 0)
                    {
                        IsMiss = true;
                        break;
                    }
                }
                if (IsMiss)
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataObj = null,
                        dataErr = null,
                        Msg = "CONTAINER NOT SCAN FULL YET"
                    }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var result = APIHelper.CallAPI<JsonResultData>("container/dispatchmobile", new
                    {
                        data = model,
                        dispatchedDate = DateTime.Now
                    });
                    if (result.IsOk)
                    {
                        var data = new
                        {
                            TYPE = "EXPORTCNT",
                            URL = string.Format("/container/detail?id={0}", model.ID),
                            MESSAGE = string.Format("Cont. {0} has been export by {1}", model.NAME, LoginUser.Current.USERNAME),
                            USERCREATED = LoginUser.Current.USERNAME,
                        };
                        SocketHelper.Current.SendMessage("pushnotification", data);
                    }
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = ex.ToString()
                }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}