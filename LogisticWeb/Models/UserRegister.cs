using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace LogisticWeb.Models
{
    public class UserRegister
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public bool ISADMIN { get; set; }
        public string USERTYPE { get; set; }
        public string NAMETYPE { get; set; }

    }
}