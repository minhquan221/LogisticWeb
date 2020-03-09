using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Hosting;
using ModelHelper;
using ModelHelper.SocketModel;
using Newtonsoft.Json;

namespace LogisticWeb.Common
{
    public class SocketServer
    {
        public static List<RegisterCertificate> ClientOutsite = new List<RegisterCertificate>();

        public static string data = null;

        public static void StartServer()
        {
            byte[] bytes = new Byte[1024];
            try
            {
                IPAddress ipAddress = IPAddress.Parse("210.211.113.131");

                //Console.WriteLine("Starting TCP listener...");

                TcpListener listener = new TcpListener(ipAddress, 1337);

                listener.Start();
                while (true)
                {
                    Socket client = listener.AcceptSocket();
                    data = null;
                    //Console.WriteLine("Connection accepted.");

                    var childSocketThread = new Thread(() =>
                    {
                        bytes = new byte[100];
                        int size = client.Receive(bytes);

                        int bytesRec = client.Receive(bytes);
                        data += Encoding.ASCII.GetString(bytes, 0, bytesRec);
                        var objectReceived = JsonConvert.DeserializeObject<SocketData>(data);

                        string filePath = HostingEnvironment.MapPath("~/logsocket");
                        if (!Directory.Exists(filePath))
                        {
                            Directory.CreateDirectory(filePath);
                        }
                        File.WriteAllText(filePath + "\\" + "log_socket_done_" + DateTime.Now.ToString("yyyyMMdd_HHmmssttt"), data);

                        client.Send(Encoding.ASCII.GetBytes("has received data from you"));



                        //switch (objectReceived.type)
                        //{
                        //    case "authen":
                        //        break;
                        //    case "reconnect":
                        //        break;
                        //    case "":
                        //        break;
                        //    default:
                        //        break;

                        //}

                        client.Close();
                    });
                    childSocketThread.Start();
                }

                listener.Stop();
            }
            catch (Exception ex)
            {
                string filePath = HostingEnvironment.MapPath("~/logsocket");
                if (!Directory.Exists(filePath))
                {
                    Directory.CreateDirectory(filePath);
                }
                File.WriteAllText(filePath + "\\" + "log_socket_" + DateTime.Now.ToString("yyyyMMdd_HHmmssttt"), ex.ToString());
            }
        }

        private void AuthenData(SocketData sock)
        {
            RegisterCertificate data = null;
            string Header = sock.encode;
            //bool Validate = _svc.CheckValid(ref data, sock.privateKey, sock.encode);
        }

    }
}