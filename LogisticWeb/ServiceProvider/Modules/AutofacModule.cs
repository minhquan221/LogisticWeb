using Autofac;
using Autofac.Integration.Mvc;
using LogisticWeb.ServiceProvider.BaseFactory;
using LogisticWeb.ServiceProvider.BaseFactory.Interface;
using BusinessObject;
using BusinessObject.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace LogisticWeb.ServiceProvider.Modules
{
    public class DataModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterType<RepositoryUnitOfWork>().As<IRepositoryUnitOfWork>().InstancePerRequest();
            builder.RegisterType<BaseDbContextFactory>().As<IBaseDbContextFactory>().InstancePerRequest();
            builder.Register(c => c.Resolve<IBaseDbContextFactory>().GetInstance())
                   .As<RepositoryDbContext>().InstancePerRequest();
            builder.RegisterAssemblyTypes(Assembly.Load("WebRepositories"))
                      .Where(t => t.Name.EndsWith("Repository"))
                      .AsImplementedInterfaces()
                      .InstancePerLifetimeScope();
        }
    }
    public class ServiceModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(Assembly.Load("WebService"))
                      .Where(t => t.Name.EndsWith("Service"))
                      .AsImplementedInterfaces()
                      .InstancePerLifetimeScope();
        }
    }
    public class WebModule : Autofac.Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            //Assembly assembly = Assembly.GetExecutingAssembly();
           

            //var config = GlobalConfiguration.Configuration;

            //builder.RegisterApiControllers(assembly);

            //builder.RegisterWebApiFilterProvider(config);

            //builder.RegisterWebApiModelBinderProvider();



            Assembly assembly = Assembly.GetExecutingAssembly();
            // Register Common MVC Types
            builder.RegisterModule<AutofacWebTypesModule>();
            // Register MVC Controllers
            builder.RegisterControllers(assembly);

        }
    }
}