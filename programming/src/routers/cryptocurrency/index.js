const routes = require("express").Router();
const { ResponseHandle, ErrorSchema } = require("../../utils/responseHandler");
const {
  validateCreate,
  validateUpdate,
  calTotalCryptocurrency,
} = require("./service");
const {
  create,
  findOne,
  isExist,
  updateOneById,
  find,
} = require("../../utils/baseRepository");
const { DbName } = require("../../utils/Constants");
const { authenticateAdminJWT } = require("../../middleware/auth.middleware");
const { myDataSource } = require("../../data-source");

routes.post("/", authenticateAdminJWT, async (req, res) => {
  try {
    const body = req.body;
    const headers = req.headers;
    const validate = validateCreate(res, body);

    console.log("headers", headers);

    if (!validate) {
      console.log("validate", validate);
      return;
    }

    const { name } = body;

    await myDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        await isExist(DbName.CRYPTO, { where: {name} }, transactionalEntityManager);

        await create(DbName.CRYPTO, body, transactionalEntityManager);
      }
    );

    ResponseHandle(res, 200, { message: "created success" });
  } catch (err) {
    console.log("catch", err);
    ResponseHandle(res, err.statusCode ?? 500, err);
  }
});

routes.put("/:id", authenticateAdminJWT, async (req, res) => {
  try {
    const body = req.body;
    const validate = validateUpdate(res, body);
    const { id } = req.params ?? {};

    if (id == null) {
      throw new ErrorSchema("id is required");
    }

    if (!validate) {
      console.log("validate", validate);
      return;
    }

    const { name, symbol, rate } = body ?? {};

    await myDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        const crypto = await findOne(
          DbName.CRYPTO,
          {
            where: {
              id,
            },
          },
          transactionalEntityManager
        );

        console.log("crypto", crypto);

        // const newBalance = wallet.cryptocurrency.rate * balance

        // console.log("newBalance", newBalance)

        await updateOneById(
          DbName.CRYPTO,
          crypto.id,
          { name, symbol, rate },
          transactionalEntityManager
        );
      }
    );

    ResponseHandle(res, 200, { message: "updated success" });
  } catch (err) {
    console.log("catch", err);
    ResponseHandle(res, err.statusCode ?? 500, err);
  }
});

routes.get("/total", authenticateAdminJWT, async (req, res) => {
  try {
    await myDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // const result = await find(DbName.WALLET, { relations: { cryptocurrency: true } }, transactionalEntityManager)

        const result = await transactionalEntityManager
          .getRepository(DbName.WALLET)
          .createQueryBuilder(DbName.WALLET)
          .leftJoinAndSelect("wallet.cryptocurrency", "cryptocurrency")
          .select([
            "cryptocurrency.id AS id",
            "cryptocurrency.name AS name",
            "cryptocurrency.symbol AS symbol",
            "SUM(balance) AS totalBalance",
          ])
          .groupBy("cryptocurrencyId")
          .getRawMany();

        // console.log("test", test)
        // const mappingData = calTotalCryptocurrency(result)
        return ResponseHandle(res, 200, result);
      }
    );
  } catch (err) {
    console.log("catch", err);
    ResponseHandle(res, err.statusCode ?? 500, err);
  }
});

module.exports = routes;
