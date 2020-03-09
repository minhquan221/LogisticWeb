using ModelHelper;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.IO;
using System.Linq;
//using System.Net;
using System.Text;
using System.Web;
using System.Web.Mvc;
using LogisticWeb.Common;
using System.Net;
using System.Net.Sockets;
using Newtonsoft.Json;
using WebRepositories.Interface;
using System.Web.Hosting;

namespace LogisticWeb.Controllers
{
    public class CommonController : BaseController
    {
        private ISecurityService _svc;
        public CommonController(ISecurityService svc)
        {
            _svc = svc;
        }

        private string GetIpClient(HttpContextBase HttpContext)
        {
            var ClientIP = HttpContext.Request.ServerVariables["REMOTE_ADDR"];
            return ClientIP;
        }

        [HttpPost]
        public string GetIp()
        {
            if (HttpContext.Request.Headers["PrivateKeyAuthen"] == null)
                return string.Empty;

            string privateKey = HttpContext.Request.Headers["PrivateKeyAuthen"];
            var result = _svc.GetDataPrivate(privateKey);
            if (result == null)
                return string.Empty;
            var ClientIP = HttpContext.Request.ServerVariables["REMOTE_ADDR"];
            return ClientIP;
        }

        [HttpGet]
        public string GetIpGet()
        {
            string ip = HttpContext.Request.ServerVariables["HTTP_X_FORWARDED_FOR"];
            string ClientIP = HttpContext.Request.ServerVariables["REMOTE_ADDR"];
            return ip + " - " + ClientIP;
        }
        [HttpPost]
        public string AuthenComputer(string privateKey)
        {
            try
            {
                RegisterCertificate data = null;
                string Header = HttpContext.Request.Headers["Signature"];
                bool Validate = _svc.CheckValid(ref data, privateKey, Header);
                if (Validate)
                {
                    if (data != null)
                    {
                        if (data.IPInternet == GetIpClient(HttpContext))
                        {

                            var resultS = _svc.UpdateIP(data);
                            if (!resultS.Successful)
                            {
                                return resultS.ErrorMessage;
                            }
                            else
                            {
                                ClientOutsite.Current.Add(data.IPInternet);
                                return true.ToString();
                            }
                        }
                        else
                        {
                            return false.ToString() + " IP not match with request";
                        }
                    }
                    else
                    {
                        return false.ToString() + " authorize fail in list user permit";
                    }

                }
                return false.ToString() + " validate key fail";
            }
            catch (Exception ex)
            {
                return false.ToString() + " " + ex.ToString();
            }
        }
        [ChildActionOnly]
        public ActionResult MenuSiteBar()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult Header()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult Footer()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult ChildMenu()
        {
            //ViewData["ParrentMenuId"] = parrentId;
            //return PartialView(lstMenu != null ? lstMenu : new List<MenuModel>());
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult ProfileHeaderUser()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult StyleCustomize()
        {
            return PartialView();
        }

        [ChildActionOnly]
        public ActionResult DropboxForm(string id, string name, string selectedvalue, string style, string action, string multiElement, List<Object> data)
        {
            //DropdownElement<Object> result = new DropdownElement<Object>();
            return PartialView();
        }

        [HttpPost]
        public ActionResult FileUpload(HttpFileCollection fx)
        {
            return View();
        }

        [HttpPost]
        [ValidateInput(false)]
        public JsonResult ResponseViewTemplate(string Name, string[] array = null)
        {
            return Json(new { data = XMLHelper.Current.BuilResouce(Name, array) }, JsonRequestBehavior.AllowGet);
        }
        
    }
}