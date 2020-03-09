using BusinessObject;
using DatabaseConnect.Infrastructure;
using ModelDatabase;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WebRepositories.Interface;

namespace WebRepositories
{
    public class SecurityRepository : GenericRepository<SYS_SECURITY>,  ISecurityRepository
    {
        private RepositoryDbContext _dbContext;

        public SecurityRepository(RepositoryDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;

        }

        #region Override GenericRepository



        #endregion

        #region Overload GenericRepository


        #endregion
    }
}
