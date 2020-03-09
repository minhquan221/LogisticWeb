using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace ScanWeb.Models
{
    public class LoginUserMobile
    {
        public long ID { get; set; }
        public string USERNAME { get; set; }
        public string PASSWORD { get; set; }
        public string SESSIONID { get; set; }
        public bool ISADMIN { get; set; }
        public bool ISUSERTREAM { get; set; }
        public string TREAMNAME { get; set; }
        public string RESACODE { get; set; }
        public bool ISUSERSELECT { get; set; }
        public string SELECTTABLE { get; set; }
        public bool ISUSERSHOULDER { get; set; }
        public string SHOULDERTABLE { get; set; }
    }
}