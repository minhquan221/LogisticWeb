using System;
using System.Threading.Tasks;
using System.Web.Mvc;
using LogisticWeb.ServiceProvider.Logging;
using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(LogisticWeb.Startup))]

namespace LogisticWeb
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            // Always be first middleware
            app.Use<UnhandledExceptionMiddleware>();


            ConfigureContainer(app);

            //ConfigureAuth(app);

            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
        }
    }
}
