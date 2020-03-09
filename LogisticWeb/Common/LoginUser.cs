using ModelDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LogisticWeb.Models;
using LogisticWeb.Models.ViewModel;

namespace LogisticWeb.Common
{
    public class LoginUser
    {
        public static SYS_USER _current = null;

        public static SYS_USER Current
        {
            get
            {
                if (HttpContext.Current.Session[Constants.SessionLogin] != null)
                {
                    _current = (SYS_USER)HttpContext.Current.Session[Constants.SessionLogin];
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