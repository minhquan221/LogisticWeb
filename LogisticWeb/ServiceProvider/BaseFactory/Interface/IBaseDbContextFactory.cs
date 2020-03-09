using BusinessObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace LogisticWeb.ServiceProvider.BaseFactory.Interface
{
    public interface IBaseDbContextFactory
    {
        RepositoryDbContext GetInstance();
    }
}