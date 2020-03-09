using ModelDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Threading.Tasks;
using SocketClientNode;

namespace ScanWeb.Common
{
    public class SocketHelper
    {
        private static SocketHelper _current = new SocketHelper();
        public static SocketHelper Current
        {
            get
            {
                return _current != null ? _current : new SocketHelper();
            }
        }

        public async Task<string> SendMessage(string func, object data = null, string url = "", string port = "")
        {
            url = string.IsNullOrEmpty(url) ? Constants.UrlNodeServer : url;
            port = string.IsNullOrEmpty(port) ? Constants.PortNodeServer : port;
            SocketLib.Current.SendSocketServer(func, data, url, port);
            return "";
        }
    }

}