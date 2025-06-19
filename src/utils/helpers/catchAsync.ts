// import dbConnection from "../../lib/dbConnection";

import errorHandler from "../ErrorHandelars";

const catchAsync =
  (handler: (req: Request, res: Response) => void) =>
  async (req: Request, res: Response) => {
    try {
      //   await dbConnection();
      return await handler(req, res);
    } catch (error) {
      return errorHandler(error as Error);
    }
  };

export default catchAsync;
