using BusinessObject;

namespace LogisticWeb.Controllers
{
    internal class UnitOfWork
    {
        private RepositoryDbContext dbContext;

        public UnitOfWork(RepositoryDbContext dbContext)
        {
            this.dbContext = dbContext;
        }
    }
}