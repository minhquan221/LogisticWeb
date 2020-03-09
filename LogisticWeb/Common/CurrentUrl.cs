using ModelDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using LogisticWeb.Models;
using LogisticWeb.Models.ViewModel;

namespace LogisticWeb.Common
{
    public class CurrentUrl
    {
        public static string _current = "";

        public static string Current
        {
            get
            {
                if (HttpContext.Current.Session[Constants.CurrentLoginUrl] != null)
                {
                    _current = (string)HttpContext.Current.Session[Constants.CurrentLoginUrl];
                }
                else
                {
                    _current = "";
                    HttpContext.Current.Session[Constants.CurrentLoginUrl] = _current;
                }
                return _current;
            }
        }
    }
}