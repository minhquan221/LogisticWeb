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
using WebRepositories.Interface;
using LogisticWeb.ServiceProvider.BaseFactory;
using WebService;
using WebRepositories;
using BusinessObject;

namespace LogisticWeb.Common
{
    public class SecurityServiceHelper
    {
        public static ISecurityService _current;

        public static ISecurityService Current
        {
            get
            {
                if (_current != null)
                    return _current;
                else
                {
                    var dbContext = new BaseDbContextFactory().GetInstance();
                    var unitOfWork = new RepositoryUnitOfWork(dbContext);
                    var Repository = new SecurityRepository(dbContext);
                    return new SecurityService(unitOfWork, Repository);
                }
            }
        }
    }
}