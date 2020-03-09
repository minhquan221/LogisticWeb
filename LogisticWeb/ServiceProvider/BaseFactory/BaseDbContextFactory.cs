using LogisticWeb.ServiceProvider.BaseFactory.Interface;
using BusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;

namespace LogisticWeb.ServiceProvider.BaseFactory
{
    public class BaseDbContextFactory : IBaseDbContextFactory
    {
        // Note : we can move this class to service layer.
        public RepositoryDbContext GetInstance()
        {
            String connectionString = this.GetConnectionString();
            return new RepositoryDbContext(connectionString);
        }

        private String GetConnectionString()
        {
            String LogConnection = Common.Constants.LogConnectionString;
            return WebConfigurationManager.ConnectionStrings[LogConnection].ConnectionString;
        }
    }
}