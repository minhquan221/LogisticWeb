using ModelHelper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Net;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Web;
using LogisticWeb.Models;

namespace LogisticWeb.Common
{
    public class APIHelper
    {

        public static HttpWebRequest builHeader(HttpWebRequest client, List<string[]> header = null)
        {
            if (header != null)
            {
                foreach (var item in header)
                {
                    client.Headers.Add(item[0], item[1]);
                }
            }
            return client;
        }

        public static string CallAPIAuthen(string function, object parameters = null, List<string[]> Header = null)
        {
            string ResponseData = string.Empty;
            try
            {
                var url = ConfigurationManager.AppSettings["Client:Url:API"];
                byte[] postData;
                List<string> lit = new List<string>();
                StringBuilder paramstring = new StringBuilder();
                paramstring.Append(JsonConvert.SerializeObject(parameters));
                postData = Encoding.UTF8.GetBytes(paramstring.ToString());

                HttpWebRequest client = (HttpWebRequest)HttpWebRequest.Create(url + function);
                client.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;

                client.KeepAlive = false;
                client.Method = "POST";
                string proxy = null;
                client.Proxy = new WebProxy(proxy, true);
                client = builHeader(client, Header);
                client.Headers.Add("ERPLAMIPELCERT", "minhquan221123123");
                client.CookieContainer = new CookieContainer();
                client.ContentType = "application/json";

                client.ContentLength = postData.Length;

                using (var stream = client.GetRequestStream())
                {
                    stream.Write(postData, 0, postData.Length);
                }
                var response = (HttpWebResponse)client.GetResponse();
                ResponseData = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return ResponseData;

            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
        public static T CallAPI<T>(string function, object parameters = null) where T : class
        {
            string ResponseData = string.Empty;
            try
            {
                var url = ConfigurationManager.AppSettings["Client:Url:API"];
                byte[] postData;
                List<string> lit = new List<string>();
                StringBuilder paramstring = new StringBuilder();
                paramstring.Append(JsonConvert.SerializeObject(parameters));
                postData = Encoding.UTF8.GetBytes(paramstring.ToString());

                HttpWebRequest client = (HttpWebRequest)HttpWebRequest.Create(url + function);
                client.ServerCertificateValidationCallback += (sender, certificate, chain, sslPolicyErrors) => true;

                client.KeepAlive = false;
                client.Method = "POST";
                string proxy = null;
                client.Proxy = new WebProxy(proxy, true);
                client.Headers.Add("ERPLAMIPELCERT", "minhquan221123123");
                client.CookieContainer = new CookieContainer();

                client.ContentType = "application/json";

                client.ContentLength = postData.Length;

                using (var stream = client.GetRequestStream())
                {
                    stream.Write(postData, 0, postData.Length);
                }
                var response = (HttpWebResponse)client.GetResponse();
                ResponseData = new StreamReader(response.GetResponseStream()).ReadToEnd();
                return JsonConvert.DeserializeObject<T>(ResponseData);
                
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}