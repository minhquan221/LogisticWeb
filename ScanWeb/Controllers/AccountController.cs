using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.NetworkInformation;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using ModelDatabase;
using ModelHelper;
using ModelHelper.Common;
using Newtonsoft.Json;
using ScanWeb.Common;
using ScanWeb.Models;

namespace ScanWeb.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public ActionResult Login()
        {
            //var data = new
            //{
            //    Resacode = "ABCXYZ",
            //    User = "user2"
            //};
            //SocketHelper.Current.SendMessage("receivednotifyresa", data);
            return View();
        }

        [HttpPost]
        public JsonResult Login(User info)
        {
            var result = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/login", new
            {
                UserName = info.UserName,
                Password = info.Password
            });
            if (result.IsOk)
            {
                result.dataObj.SESSIONID = Guid.NewGuid().ToString();
                var updateSS = APIHelper.CallAPI<JsonResultObject<SYS_USER>>("user/updatesession", result.dataObj);
                if (!updateSS.IsOk)
                {
                    return Json(updateSS, JsonRequestBehavior.AllowGet);
                }
                if (updateSS.IsOk)
                {
                    var userMobile = ModelHelper.ConvertHelper.Current.ConvertObjToObj<LoginUserMobile, SYS_USER>(result.dataObj);
                    Session[Constants.SessionLogin] = userMobile;
                    SocketHelper.Current.SendMessage("userlogged", userMobile);
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return Json(new
                    {
                        IsOk = false,
                        Msg = "Error session update",
                        dataObj = string.Empty,
                        dataErr = string.Empty
                    }, JsonRequestBehavior.AllowGet);
                }
                //Session[Constants.SessionLogin] = (SYS_USER)result.dataObj;
            }
            else
            {
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Register()
        {
            return View();
        }

        //[HttpPost]
        //public JsonResult Register(User info)
        //{
        //    if (!string.IsNullOrEmpty(info.Password))
        //    {
        //        info.Password = CommonCryptography.MD5Hash(info.Password);
        //    }
        //    return Json(Services.UserService.Current.RegisterUser(info), JsonRequestBehavior.AllowGet);
        //}
        public ActionResult LogOut()
        {
            var userLogged = LoginUser.Current;
            Session.Remove(Constants.SessionLogin);
            Session.Abandon();
            if (Request.Cookies["SessionId_LoginUser"] != null)
            {
                Response.Cookies["SessionId_LoginUser"].Expires = DateTime.Now.AddDays(-1);
            }
            SocketHelper.Current.SendMessage("userlogout", userLogged);
            return RedirectToAction("Index", "Home");
        }
    }
}