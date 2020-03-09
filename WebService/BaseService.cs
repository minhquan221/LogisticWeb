using BusinessObject.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebRepositories.Interface;

namespace WebService
{
    public class BaseService : IService
    {
        public BaseService(IRepositoryUnitOfWork unitOfWork)
        {
        }

    }
}
