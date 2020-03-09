using ModelDatabase;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace LogisticWeb.Models
{
    public class UserLogin: SYS_USER
    {
        public string SocketId { get; set; }
    }
}