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
    public class CommonController : BaseController
    {
        public ActionResult BacklinkAction()
        {
            return Redirect(BackLink);
        }

        [HttpPost]
        //[CommonAuthen]
        public JsonResult DoneResaMobile(string resacode)
        {
            try
            {
                var result = APIHelper.CallAPI<JsonResultData>("resa/doneresamobile", new
                {
                    resacode = resacode,
                    username = LoginUser.Current.USERNAME
                });
                if (result.IsOk)
                {
                    //var resainfo = new
                    //{
                    //    Resacode = resacode,
                    //    User = LoginUser.Current.USERNAME
                    //};
                    var data = new
                    {
                        TYPE = "RESA",
                        URL = string.Format("/resa/detail?id={0}", resacode),
                        MESSAGE = string.Format("Resa {0} has done by {1}", resacode, LoginUser.Current.USERNAME),
                        USERCREATED = LoginUser.Current.USERNAME,
                    };
                    SocketHelper.Current.SendMessage("pushnotification", data);
                }
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