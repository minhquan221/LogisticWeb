using ModelDatabase;
using ScanWeb.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ScanWeb.Common
{
    public class LoginUser
    {
        public static LoginUserMobile _current = null;

        public static LoginUserMobile Current
        {
            get
            {
                if (HttpContext.Current.Session[Constants.SessionLogin] != null)
                {
                    _current = (LoginUserMobile)HttpContext.Current.Session[Constants.SessionLogin];
                }
                else
                {
                    return null;
                }
                return _current;
            }
        }
    }
}