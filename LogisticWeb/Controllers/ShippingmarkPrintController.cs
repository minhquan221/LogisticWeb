using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Models;
using LogisticWeb.Common;
using LogisticWeb.Models.ViewModel;
using ModelDatabase;
using ModelHelper;
using ModelHelper.ViewModel;
using BarcodeHelper;

namespace LogisticWeb.Controllers
{
    public class ShippingmarkPrintController : BaseController
    {
        // GET: Selection
        [CommonAuthen]
        public ActionResult Index()
        {
            MD_PALETTE model = new MD_PALETTE();
            return View(model);
        }

        [HttpPost]
        //[CommonAction]
        public JsonResult SearchNavigator(string inputstring)
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<SYS_NAVIGATOR>>>("navigator/search",
                    new { inputstring });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    Msg = ex.ToString(),
                    dataErr = ex,
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        //[CommonAction]
        public JsonResult SearchResa(string inputstring)
        {
            try
            {
                var resultJson = APIHelper.CallAPI<JsonResultObject<List<SYS_RESA>>>("resa/searchsuggestion", 
                    new { inputstring });
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    Msg = ex.ToString(),
                    dataErr = ex,
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        //[CommonAction]
        public JsonResult CreatePalletNumber(MD_PALETTE info)
        {
            try
            {
                //GenerateName
                var resultJson = APIHelper.CallAPI<JsonResultData>("pallet/generatename", info);
                return Json(resultJson, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    Msg = ex.ToString(),
                    dataErr = ex,
                }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        [CommonAuthen]
        public JsonResult SavePallet(MD_PALETTE info)
        {
            if (string.IsNullOrEmpty(info.RESACODE))
            {
                return Json(new JsonResultData{
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = "không đc để trống mã Resa / Resa code empty not allow"
                }, JsonRequestBehavior.AllowGet);
            }
            if (string.IsNullOrEmpty(info.NAVIGATORNAME))
            {
                return Json(new JsonResultData
                {
                    IsOk = false,
                    dataObj = null,
                    dataErr = null,
                    Msg = "không đc để trống tên người tạo / Navigator empty not allow"
                }, JsonRequestBehavior.AllowGet);
            }
            if (info.ID != 0)
            {
                var resultOldVal = APIHelper.CallAPI<JsonResultObject<List<MD_PALETTE>>>("pallet/getdetail", new
                {
                    id = info.ID
                });
                if (!resultOldVal.IsOk)
                {
                    return Json(resultOldVal, JsonRequestBehavior.AllowGet);
                }
                MD_PALETTE oldmodel = resultOldVal.dataObj != null && resultOldVal.dataObj.Count > 0 ? resultOldVal.dataObj.First() : new MD_PALETTE();
                if (!string.IsNullOrEmpty(oldmodel.CONTAINERID) && (oldmodel.SELECTION != info.SELECTION || oldmodel.SUBSELECTION != info.SUBSELECTION))
                {
                    return Json(new JsonResultData
                    {
                        IsOk = false,
                        dataObj = null,
                        dataErr = null,
                        Msg = "không đc đổi Selection khi Pallet đang trong PKL / Do not allow change Selection while Pallet in PKL"
                    }, JsonRequestBehavior.AllowGet);
                }
                info.UPDATEDUSER = LoginUser.Current.USERNAME;
                info.UPDATEDDATE = DateTime.Now;
                //update
                info.BARCODE = Barcode.Current.CreateQRCodeRawString(new QRCodeViewModel
                {
                    GROSSWEIGHT = info.GROSSWEIGHT,
                    HIDE = info.HIDE,
                    NAME = info.NAME,
                    NETWEIGHT = info.NETWEIGHT,
                    PALLETWEIGHT = info.PALLETWEIGHT,
                    RESACODE = info.RESACODE,
                    SELECTION = info.SELECTION,
                    SQUAREFOOT = info.SQUAREFOOT,
                    SUBSELECTION = info.SUBSELECTION
                });
                List<string> array = new List<string>();
                array.Add(info.NAME);
                array.Add(info.SELECTION);
                array.Add(info.SUBSELECTION);
                array.Add(info.HIDE);
                array.Add(info.NETWEIGHT);
                array.Add(info.GROSSWEIGHT);
                array.Add(info.SQUAREFOOT);
                array.Add(DateTime.Now.ToString("yyyy-MM-dd"));
                array.Add(info.RESACODE);
                array.Add(info.BARCODE);
                array.Add(info.CONTAINERID);
                info.CONTENTPRINT = BarcodeHelper.XMLHelper.Current.BuilResouce((info.ISSEMIPRODUCTION ? "PalletSemiPrint" : "ShippingMarkPrint"), array.ToArray());
                return Json(APIHelper.CallAPI<JsonResultData>("pallet/update", new
                {
                    info.ID,
                    info.NAME,
                    info.BARCODE,
                    info.CONTENTPREVIEW,
                    info.CONTENTPRINT,
                    info.DVT,
                    info.GROSSWEIGHT,
                    info.HIDE,
                    info.NETWEIGHT,
                    info.PALLETWEIGHT,
                    info.SELECTION,
                    info.SUBSELECTION,
                    info.RESACODE,
                    info.UPDATEDUSER,
                    info.SQUAREFOOT,
                    info.WAVG,
                    info.SAVG,
                    info.UPDATEDDATE,
                    info.NAVIGATORNAME,
                    info.ISSEMIPRODUCTION
                }), JsonRequestBehavior.AllowGet);
            }
            else
            {
                info.CREATEDUSER = LoginUser.Current.USERNAME;
                info.CREATEDDATE = DateTime.Now;
                info.BARCODE = Barcode.Current.CreateQRCodeRawString(new QRCodeViewModel
                {
                    GROSSWEIGHT = info.GROSSWEIGHT,
                    HIDE = info.HIDE,
                    NAME = info.NAME,
                    NETWEIGHT = info.NETWEIGHT,
                    PALLETWEIGHT = info.PALLETWEIGHT,
                    RESACODE = info.RESACODE,
                    SELECTION = info.SELECTION,
                    SQUAREFOOT = info.SQUAREFOOT,
                    SUBSELECTION = info.SUBSELECTION
                });
                List<string> array = new List<string>();
                array.Add(info.NAME);
                array.Add(info.SELECTION);
                array.Add(info.SUBSELECTION);
                array.Add(info.HIDE);
                array.Add(info.NETWEIGHT);
                array.Add(info.GROSSWEIGHT);
                array.Add(info.SQUAREFOOT);
                array.Add(DateTime.Now.ToString("yyyy-MM-dd"));
                array.Add(info.RESACODE);
                array.Add(info.BARCODE);
                array.Add(info.CONTAINERID);
                info.CONTENTPRINT = BarcodeHelper.XMLHelper.Current.BuilResouce("ShippingMarkPrint", array.ToArray());
                var result = APIHelper.CallAPI<JsonResultData>("pallet/insert", new
                {
                    info.ID,
                    info.NAME,
                    info.BARCODE,
                    info.CONTENTPREVIEW,
                    info.CONTENTPRINT,
                    info.DVT,
                    info.GROSSWEIGHT,
                    info.HIDE,
                    info.NETWEIGHT,
                    info.PALLETWEIGHT,
                    info.SELECTION,
                    info.SUBSELECTION,
                    info.RESACODE,
                    info.CREATEDUSER,
                    info.SQUAREFOOT,
                    info.WAVG,
                    info.SAVG,
                    info.CREATEDDATE,
                    info.NAVIGATORNAME,
                    info.ISSEMIPRODUCTION
                });
                if (!result.IsOk)
                {
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                return Json(new JsonResultData
                {
                    IsOk = true,
                    dataObj = info.CONTENTPRINT,
                    dataErr = null,
                    Msg = string.Empty
                }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        //[CommonAction]
        public JsonResult CountPallet(SelectionViewModel info)
        {
            return Json(APIHelper.CallAPI<JsonResultData>("pallet/countbyselection", info), JsonRequestBehavior.AllowGet);
        }

        //[HttpPost]
        ////[CommonAction]
        //public JsonResult CreateBarcode(string info)
        //{
        //    return Json(BarcodeHelper.Current.CreateBarcode(info), JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        //[CommonAction]
        public JsonResult CreateQRCode(QRCodeViewModel info)
        {
            return Json(Barcode.Current.CreateQRCodeRaw(info), JsonRequestBehavior.AllowGet);
        }

        
    }
}